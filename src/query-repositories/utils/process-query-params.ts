import {QueryBlogsModel} from "../../models/query-models/query-blogs-model";
import {QueryPostsModel} from "../../models/query-models/query-posts-model";

export const parseBlogsQuery = (req: QueryBlogsModel) => {
    let searchByTerm, sortBy, sortDir, pageNum, pageSize

    req.searchNameTerm !== undefined ? searchByTerm = req.searchNameTerm : searchByTerm = null;
    req.sortBy ? sortBy = req.sortBy : sortBy = 'createdAt';
    req.sortDirection ? sortDir = req.sortDirection : sortDir = 'desc';
    req.pageNumber ? pageNum = +req.pageNumber : pageNum = 1;
    req.pageSize ? pageSize = +req.pageSize : pageSize = 20;

    const output: [string | null, string, string, number, number] = [searchByTerm, sortBy, sortDir, pageNum, pageSize]
    return output
}

export const parsePostsQuery = (req: QueryPostsModel) => {
    let sortBy, sortDir, pageNum, pageSize

    req.sortBy ? sortBy = req.sortBy : sortBy = 'createdAt';
    req.sortDirection ? sortDir = req.sortDirection : sortDir = 'desc';
    req.pageNumber ? pageNum = +req.pageNumber : pageNum = 1;
    req.pageSize ? pageSize = +req.pageSize : pageSize = 10;

    const output: [string, string, number, number] = [sortBy, sortDir, pageNum, pageSize]
    return output
}