import {usersRepository} from "../repositories/users-repository";
import {UsersViewModel} from "../models/view-models/users-view-model";
import {UserInputType} from "../models/input-models/users-input-models";
import {changeKeyName} from "../utils/object-operations";
import bcrypt from 'bcrypt'
import {LoginInputModel} from "../models/input-models/login-input-model";
import {UserDbModel} from "../models/mongo-db-models/users-db-model";

export const userService = {
    async createUser (body: UserInputType): Promise<UsersViewModel> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(body.password, passwordSalt)

        const newUser: UserDbModel = {
            login: body.login,
            passwordHash,
            passwordSalt,
            email: body.email,
            createdAt: new Date()
        }

        await usersRepository.createUser(newUser)
        const output: UsersViewModel = {...newUser}
        changeKeyName(output, '_id', 'id')

        return {
            id: output.id,
            login: output.login,
            email: output.email,
            createdAt: output.createdAt.toString()
        }
    },
    async checkUsersCredentials (body: LoginInputModel): Promise<UserDbModel | null | undefined> {
        const {loginOrEmail, password} = body;
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail);

        if(user) {
            const passwordSalt = user.passwordSalt
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
    async _generateHash(pass: string, salt: string): Promise<string> {
        return await bcrypt.hash(pass, salt)
    }
}
