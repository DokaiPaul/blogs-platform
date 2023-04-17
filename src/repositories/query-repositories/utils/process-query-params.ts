import {QueryBlogsModel} from "../../../models/query-models/query-blogs-model";
import {QueryPostsModel} from "../../../models/query-models/query-posts-model";
import {BlogsType} from "../../../models/view-models/blogs-view-model";
import {ObjectId} from "mongodb";
import {PostsType} from "../../../models/view-models/posts-view-model";

export const processQuery = (q: QueryBlogsModel) => {
    let searchByTerm = q.searchNameTerm || null
    let sortBy = q.sortBy || 'createdAt'
    let sortDir = q.sortDirection || 'desc'
    // @ts-ignore
    let pageNum = +q.pageNumber || 1
    // @ts-ignore
    let pageSize = +q.pageSize || 10

    const validBlog: BlogsType =
        {
            id: 'string',
            _id: new ObjectId('643af7147df5b9a278d8a3a8'),
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

    const output: [string | null, string, string, number, number] = [searchByTerm, sortBy, sortDir, pageNum, pageSize]
    return output
}

export const parsePostsQuery = (q: QueryPostsModel) => {
    let sortBy = q.sortBy || 'createdAt'
    let sortDir = q.sortDirection || 'desc'
    // @ts-ignore
    let pageNum = +q.pageNumber || 1
    // @ts-ignore
    let pageSize = +q.pageSize || 10

    const validBlog: PostsType =
        {
            id: 'string',
            _id: new ObjectId('643af7147df5b9a278d8a3a8'),
            title: 'string',
            shortDescription: 'string',
            content: 'string',
            createdAt: 'string',
            blogId: 'string',
            blogName: 'string'
        }

    if(!validBlog.hasOwnProperty(sortBy)) sortBy = 'createdAt'
    if(sortDir !== 'asc') sortDir = 'desc'
    if(Number.isNaN(pageNum)) pageNum = 1
    if(Number.isNaN(pageSize)) {
        pageSize = 10
    } else {
        if(pageSize > 100) pageSize = 100
    }

    const output: [string, string, number, number] = [sortBy, sortDir, pageNum, pageSize]
    return output
}