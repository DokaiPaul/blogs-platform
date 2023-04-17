export type QueryBlogsModel =
    {
        searchNameTerm?: string | null,
        sortBy?: string,
        sortDirection?: string,
        pageNumber: string,
        pageSize: string
    }