import {RequestWithQuery} from "../../models/request-types";
import {QueryBlogsModel} from "../../models/query-models/query-blogs-model";
import {processQuery} from "./utils/process-query-params";
import {changeKeyName} from "../../utils/object-operations";
import {BlogsType} from "../../models/view-models/blogs-view-model";
import {Paginator} from "../../models/view-models/paginator-view-model";
import {BlogModel} from "../../database/models/blog-model";
import {SortOrder} from "mongoose";

export const blogsQueryRepository = {
    async findBlogs (req: RequestWithQuery<QueryBlogsModel>): Promise<Paginator<BlogsType[]> | null | undefined> {
        const {searchByTerm, sortBy, sortDir, pageNum, pageSize} = processQuery(req.query);

        let blogs: BlogsType[] | null;
        let filter = {};
        let sort = {[sortBy]: sortDir as SortOrder}

        if(searchByTerm) {
            filter = {name: {$regex: searchByTerm, $options: 'i'}}
        }
        blogs = await BlogModel.find(filter)
            .sort(sort)
            .limit(pageSize)
            .skip((pageNum - 1) * pageSize)

        blogs.forEach(b => changeKeyName(b, '_id', 'id'))

        const totalMatchedPosts = await BlogModel.countDocuments(filter)
        const totalPages = Math.ceil(totalMatchedPosts / pageSize)

        return {
            pagesCount: totalPages,
            page: pageNum,
            pageSize: pageSize,
            totalCount: totalMatchedPosts,
            items: blogs
        };
    }
}