export function PaginationMeta(
    items: any[],
    totalItems: number,
    page: number,
    limit: number
) {
    const hasNextPage = (page * limit) < totalItems;
    const totalPage = Math.ceil(totalItems / limit);
    return {
        meta: { itemCount: items.length, totalItems, hasNextPage, totalPage }
    };
}