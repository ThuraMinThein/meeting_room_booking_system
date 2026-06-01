export interface IPaginationOptions {
    /**
     * @default 10
     */
    limit: number;

    /**
     * @default 1
     */
    page: number;
}

export interface IPaginationMeta {

    itemCount: number;
    totalItems: number;
    hasNextPage: boolean;
    totalPage: number
}