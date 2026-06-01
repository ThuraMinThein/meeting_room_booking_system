import { ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { IPaginationOptions } from "./interfaces";
import { PaginationMeta } from "./pagination-meta";

export async function Paginate<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>
    ,
    { page, limit }: IPaginationOptions,
) {
    const skip = (page - 1) * limit;
    const [regions, totalItems] = await queryBuilder
        .skip(skip)
        .take(limit)
        .getManyAndCount();

    const paginationInfo = PaginationMeta(regions, totalItems, page, limit);
    return { items: regions, ...paginationInfo };
}