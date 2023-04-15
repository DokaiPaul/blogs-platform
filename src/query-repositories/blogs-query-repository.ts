import {RequestWithParamsAndQuery} from "../types/request-types";
import {QueryBlogsModel} from "../models/query-models/query-blogs-model";
import {parseBlogsQuery} from "./utils/process-query-params";
import {BlogsType} from "../types/blogs-types";
import {client} from "../database/mongo-db";
import {changeKeyName} from "../utils/object-operations";

const blogsCollection = client.db('bloggers-platform').collection<BlogsType>('blogs')
export const blogsQueryRepository = {
    async findBlogs (req: RequestWithParamsAndQuery<{id: string}, QueryBlogsModel>): Promise<BlogsType[] | null | undefined> {
        const [searchByTerm, sortBy, sortDir, pageNum, pageSize] = parseBlogsQuery(req.query);

        let blogs: BlogsType[] | null;
        let filter = {};
        let sort = {[sortBy]: sortDir}

        if(searchByTerm) {
            filter = {name: {$regex: searchByTerm, $options: 'i'}}
        }

        blogs = await blogsCollection.find(filter)
            // @ts-ignore
            .sort(sort)
            .limit(pageSize)
            .skip((pageNum - 1) * pageSize)
            .toArray();

        blogs.forEach(b => changeKeyName(b, '_id', 'id'))
        return blogs;
    }
}