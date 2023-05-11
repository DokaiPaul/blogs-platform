import {usersRepository} from "../repositories/users-repository";
import {UsersViewModel} from "../models/view-models/users-view-model";
import {UserInputType} from "../models/input-models/users-input-models";
import bcrypt from 'bcrypt'
import {LoginInputModel} from "../models/input-models/login-input-model";
import {UserDbModel} from "../models/mongo-db-models/users-db-model";
import {v4 as uuidv4} from 'uuid'
import add from 'date-fns/add'
import {ObjectId} from "mongodb";
import {emailsManager} from "../managers/email-sender-manager";
import {PasswordRecoveryInputModel} from "../models/input-models/password-recovery-input-model";

export const userService = {
    async createUser (body: UserInputType): Promise<UsersViewModel | null | string> {
        const isLoginAlreadyExists = await usersRepository.findByLogin(body.login)
        if(isLoginAlreadyExists) return 'login'

        const isEmailAlreadyExist = await usersRepository.findByEmail(body.email)
        if(isEmailAlreadyExist) return 'email'

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(body.password, passwordSalt)

        const newUser: UserDbModel = {
            _id: new ObjectId(),
            login: body.login,
            passwordHash,
            passwordSalt,
            email: body.email,
            createdAt: new Date(),
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {minutes: 30}),
                isConfirmed: false
            }
        }

        await usersRepository.createUser(newUser)

        try {
            await emailsManager.sendEmailConfirmationCode(newUser, newUser.emailConfirmation.confirmationCode)
        } catch (e) {
            console.error(e)
            await usersRepository.deleteUser(newUser._id!.toString())
            return null
        }

        return {
            id: newUser._id!.toString(),
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt.toISOString()
        }
    },
    async confirmEmail (code: string): Promise<boolean> {

        const user = await usersRepository.findByConfirmationCode(code)

        if(!user) return false
        if(user.emailConfirmation.isConfirmed) return false
        if(user.emailConfirmation.confirmationCode !== code) return false
        if(user.emailConfirmation.expirationDate < new Date()) return false

        const result = await usersRepository.updateConfirmationStatus(user._id!.toString())

        return result

    },
    async resendConfirmation(email: string): Promise<boolean> {
        const user = await usersRepository.findByLoginOrEmail(email)
        if(!user) return false
        if(user.emailConfirmation.isConfirmed) return false
        const confirmationCode = uuidv4()

        try {
            await usersRepository.updateConfirmationCode(user._id!.toString(), confirmationCode)
            await emailsManager.sendEmailConfirmationCode(user, confirmationCode)
            return true
        } catch (e) {
            console.error(e)
            return false
        }
    },
    async checkUsersCredentials (body: LoginInputModel): Promise<UserDbModel | null | undefined> {
        const {loginOrEmail, password} = body;
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail);

        if(user) {
            const passwordSalt = user.passwordHash.slice(0, 30)
            const passwordHash = await this._generateHash(password, passwordSalt)

            if (passwordHash === user.passwordHash) {
                return user
            }
        }
        return null
    },
    async deleteUser (id: string): Promise<boolean> {
        const result = await usersRepository.deleteUser(id)

        return result.deletedCount === 1
    },
    async sendEmailToRecoverPassword (email: string) {
        const user = await usersRepository.findByEmail(email)
        if(!user) return null

        const confirmationCode = uuidv4()

        const recoveryCodeObject = {
            confirmationCode,
            isUsed: false,
            creationDate: new Date(),
            email: email
        }
        try{
            const result = await usersRepository.createRecoveryConfirmationCode(recoveryCodeObject)
            if(!result) return null

            await emailsManager.sendPasswordRecoveryCode(user, confirmationCode)
            return true
        } catch (e) {
            console.error(e)
            return null
        }
    },
    async confirmPasswordRecovery (recoveryData: PasswordRecoveryInputModel) {
        const result = await usersRepository.findRecoveryConfirmationCode(recoveryData.recoveryCode)

        if(!result) return null
        if(result.isUsed) return null //if isUsed is true then the confirmation code is extra and not valid

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(recoveryData.newPassword, passwordSalt)

        const updatePassword = await usersRepository.updatePassword(result.email, passwordHash)

        if(updatePassword.matchedCount !== 1) return null
        if(!result._id) return null
        await usersRepository.changeRecoveryCodeStatus(result._id)

        return updatePassword
    },
    async _generateHash(pass: string, salt: string): Promise<string> {
        return await bcrypt.hash(pass, salt)
    }
}
