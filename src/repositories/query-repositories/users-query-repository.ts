import {client} from "../../database/mongo-db";
import {UsersType} from "../../models/view-models/users-view-model";
import {QueryUsersModel} from "../../models/query-models/query-users-model";
import {parseUsersQuery} from "./utils/process-query-params";
import {Sort} from "mongodb";
import {changeKeyName} from "../../utils/object-operations";
import {Paginator} from "../../models/view-models/paginator-view-model";
import {CreateNewUser} from "../../models/additional-types/mongo-db-types";


const usersCollection =  client.db('bloggers-platform').collection<CreateNewUser>('users')

export const usersQueryRepository = {
    async findUsers (query: QueryUsersModel): Promise<Paginator<UsersType[]>> {
        const [searchLoginTerm, searchEmailTerm, sortBy, sortDir, pageNum, pageSize] = parseUsersQuery(query)
        let filter = {}
        let sort = {[sortBy]: sortDir} as Sort

        if(searchEmailTerm && searchLoginTerm) filter = {$and: [{login: {$regex: searchLoginTerm, $options: 'i'}}, {email: {$regex: searchEmailTerm, $options: 'i'}}]}
        if(searchEmailTerm) filter = {email: {$regex: searchEmailTerm, $options: 'i'}}
        if(searchLoginTerm) filter = {login: {$regex: searchLoginTerm, $options: 'i'}}

        const users = await usersCollection.find(filter)
            .sort(sort)
            .limit(pageSize)
            .skip((pageNum - 1) * pageSize)
            .toArray();

        users.forEach(b => changeKeyName(b, '_id', 'id'))
        users.map(u => {
            // @ts-ignore
            delete u.passwordSalt
            // @ts-ignore
            delete u.passwordHash
        })

        const totalMatchedPosts = await usersCollection.find(filter).count()
        const totalPages = Math.ceil(totalMatchedPosts / pageSize)

        return {
            pagesCount: totalPages,
            page: pageNum,
            pageSize: pageSize,
            totalCount: totalMatchedPosts,
            items: users
        };
    }
}