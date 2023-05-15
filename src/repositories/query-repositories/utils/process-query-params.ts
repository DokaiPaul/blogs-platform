import {QueryBlogsModel} from "../../../models/query-models/query-blogs-model";
import {QueryPostsModel} from "../../../models/query-models/query-posts-model";
import {BlogsType} from "../../../models/view-models/blogs-view-model";
import {PostsType} from "../../../models/view-models/posts-view-model";
import {QueryUsersModel} from "../../../models/query-models/query-users-model";
import {UsersViewModel} from "../../../models/view-models/users-view-model";
import {LikeStatus} from "../../../models/view-models/comments-view-model";

type ProcessedQuery = {
    searchByTerm?: string | null,
    searchLoginTerm?: string | null,
    searchEmailTerm?: string | null,
    sortBy: string,
    sortDir: string,
    pageNum: number,
    pageSize: number

}

export const processQuery = (q: QueryBlogsModel) => {
    let searchByTerm = q.searchNameTerm ?? null
    let sortBy = q.sortBy ?? 'createdAt'
    let sortDir = q.sortDirection ?? 'desc'
    let pageNum = +q.pageNumber || 1
    let pageSize = +q.pageSize || 10

    const validBlog: BlogsType =
        {
            id: 'string',
            name: 'string',
            description: 'string',
            websiteUrl: 'string',
            createdAt: 'string',
            isMembership: false
        }

    if(!validBlog.hasOwnProperty(sortBy)) sortBy = 'createdAt'
    if(sortDir !== 'asc') sortDir = 'desc'
    if(Number.isNaN(pageNum)) pageNum = 1
    if(Number.isNaN(pageSize)) {
        pageSize = 10
    } else {
        if(pageSize > 100) pageSize = 100
    }

    const output: ProcessedQuery = {searchByTerm, sortBy, sortDir, pageNum, pageSize}
    return output
}

export const parsePostsQuery = (q: QueryPostsModel) => {
    let sortBy = q.sortBy ?? 'createdAt'
    let sortDir = q.sortDirection ?? 'desc'
    let pageNum = +q.pageNumber || 1
    let pageSize = +q.pageSize || 10

    const validPost: PostsType =
        {
            id: 'string',
            title: 'string',
            shortDescription: 'string',
            content: 'string',
            createdAt: 'string',
            blogId: 'string',
            blogName: 'string',
            likes: [],
            dislikes: [],
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: LikeStatus.None,
                newestLikes: []
            }
        }

    if(!validPost.hasOwnProperty(sortBy)) sortBy = 'createdAt'
    if(sortDir !== 'asc') sortDir = 'desc'
    if(Number.isNaN(pageNum)) pageNum = 1
    if(Number.isNaN(pageSize)) {
        pageSize = 10
    } else {
        if(pageSize > 100) pageSize = 100
    }

    const output: ProcessedQuery = {sortBy, sortDir, pageNum, pageSize}
    return output
}

export const parseUsersQuery = (q: QueryUsersModel) => {
    let sortBy = q.sortBy ?? 'createdAt'
    let sortDir = q.sortDirection ?? 'desc'
    let pageNum = +q.pageNumber || 1
    let pageSize = +q.pageSize || 10
    let searchLoginTerm = q.searchLoginTerm ?? null
    let searchEmailTerm = q.searchEmailTerm ?? null

    const validBlog: UsersViewModel =
        {
            id: 'string',
            login: 'string',
            email: 'string',
            createdAt: 'string',
        }

    if(!validBlog.hasOwnProperty(sortBy)) sortBy = 'createdAt'
    if(sortDir !== 'asc') sortDir = 'desc'
    if(Number.isNaN(pageNum)) pageNum = 1
    if(Number.isNaN(pageSize)) {
        pageSize = 10
    } else {
        if(pageSize > 100) pageSize = 100
    }

    const output: ProcessedQuery = {searchLoginTerm, searchEmailTerm, sortBy, sortDir, pageNum, pageSize}
    return output
}