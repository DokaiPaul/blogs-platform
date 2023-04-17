import {client} from "../database/mongo-db";
import {UsersType} from "../models/view-models/users-view-model";


const usersCollection = client.db('bloggers-platform').collection<UsersType>('users')

export const usersRepository = {

}