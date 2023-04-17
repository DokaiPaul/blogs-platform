import {RequestWithQuery} from "../../models/request-types";
import {QueryBlogsModel} from "../../models/query-models/query-blogs-model";
import {processQuery} from "./utils/process-query-params";
import {client} from "../../database/mongo-db";
import {changeKeyName} from "../../utils/object-operations";
import {BlogsType} from "../../models/view-models/blogs-view-model";
import {Paginator} from "../../models/view-models/paginator-view-model";
import {Sort} from "mongodb";

const blogsCollection = client.db('bloggers-platform').collection<BlogsType>('blogs')
export const blogsQueryRepository = {
    async findBlogs (req: RequestWithQuery<QueryBlogsModel>): Promise<Paginator<BlogsType[]> | null | undefined> {
        const [searchByTerm, sortBy, sortDir, pageNum, pageSize] = processQuery(req.query);

        let blogs: BlogsType[] | null;
        let filter = {};
        let sort = {[sortBy]: sortDir} as Sort

        if(searchByTerm) {
            filter = {name: {$regex: searchByTerm, $options: 'i'}}
        }

        blogs = await blogsCollection.find(filter)
            .sort(sort)
            .limit(pageSize)
            .skip((pageNum - 1) * pageSize)
            .toArray();

        blogs.forEach(b => changeKeyName(b, '_id', 'id'))

        const totalMatchedPosts = await blogsCollection.find(filter).count()
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