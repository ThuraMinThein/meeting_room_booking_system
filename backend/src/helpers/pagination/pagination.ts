import { IPaginationMeta } from "./interfaces";

export class Pagination<
    PaginationObject,
    T = IPaginationMeta,
> {
    constructor(
        public readonly items: PaginationObject[],
        public readonly meta: T,
    ) { }
}

