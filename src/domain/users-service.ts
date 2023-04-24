import {usersRepository} from "../repositories/users-repository";
import {UsersType} from "../models/view-models/users-view-model";
import {UserInputType} from "../models/input-models/users-input-models";
import {changeKeyName} from "../utils/object-operations";
import bcrypt from 'bcrypt'
import {CreateNewUser} from "../models/additional-types/mongo-db-types";
import {LoginInputModel} from "../models/input-models/login-input-model";

export const userService = {
    async createUser (body: UserInputType): Promise<UsersType> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(body.password, passwordSalt)

        const newUser: CreateNewUser = {
            login: body.login,
            passwordHash,
            passwordSalt,
            email: body.email,
            createdAt: new Date()
        }

        await usersRepository.createUser(newUser)
        changeKeyName(newUser, '_id', 'id')

        return {
            id: newUser.id,
            login: body.login,
            email: body.email,
            createdAt: newUser.createdAt.toISOString()
        }
    },//@ts-ignore
    async checkUsersCredentials (body: LoginInputModel): Promise<CreateNewUser | boolean | undefined> {
        const {loginOrEmail, password} = body;
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
        if(!user) return false;

        const passwordSalt = user.passwordSalt
        const passwordHash = await this._generateHash(password, passwordSalt)

        if(passwordHash === user.passwordHash) {
            return user
        }
    },
    async deleteUser (id: string): Promise<boolean> {
        const result = await usersRepository.deleteUser(id)

        return result.deletedCount === 1
    },
    async _generateHash(pass: string, salt: string): Promise<string> {
        return await bcrypt.hash(pass, salt)
    }
}
