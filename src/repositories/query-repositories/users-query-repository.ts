import {MeViewModel, UsersViewModel} from "../../models/view-models/users-view-model";
import {QueryUsersModel} from "../../models/query-models/query-users-model";
import {parseUsersQuery} from "./utils/process-query-params";
import {ObjectId} from "mongodb";
import {changeKeyName} from "../../utils/object-operations";
import {Paginator} from "../../models/view-models/paginator-view-model";
import {UserModel} from "../../database/models/user-model";
import {SortOrder} from "mongoose";

export const usersQueryRepository = {
    async findUsers (query: QueryUsersModel): Promise<Paginator<UsersViewModel[]>> {
        const {searchLoginTerm, searchEmailTerm, sortBy, sortDir, pageNum, pageSize} = parseUsersQuery(query)
        let filter = {}
        let sort = {[sortBy]: sortDir as SortOrder}

        if(searchEmailTerm) filter = {email: {$regex: searchEmailTerm, $options: 'i'}}
        if(searchLoginTerm) filter = {login: {$regex: searchLoginTerm, $options: 'i'}}
        if(searchEmailTerm && searchLoginTerm) filter = {$or: [{login: {$regex: searchLoginTerm, $options: 'i'}}, {email: {$regex: searchEmailTerm, $options: 'i'}}]}

        const users: UsersViewModel[] = await UserModel.find(filter)
            .sort(sort)
            .limit(pageSize)
            .skip((pageNum - 1) * pageSize)
            .select('-__v')
            .lean()

        users.forEach(b => changeKeyName(b, '_id', 'id'))
        users.map(u => {

            delete u.passwordSalt
            delete u.passwordHash
        })

        const totalMatchedPosts = await UserModel.countDocuments(filter)
        const totalPages = Math.ceil(totalMatchedPosts / pageSize)

        return {
            pagesCount: totalPages,
            page: pageNum,
            pageSize: pageSize,
            totalCount: totalMatchedPosts,
            items: users
        };
    },
    async findUserById(id: string): Promise<MeViewModel | null> {
        const user = await UserModel.findOne({_id: new ObjectId(id)}).select('-__v').lean()

        if(!user) return null

        return {
            email: user.email,
            login: user.login,
            userId: user._id.toString()
        }
    }
}