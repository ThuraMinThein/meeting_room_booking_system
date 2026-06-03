import { Skeleton } from "./ui/skeleton";
import { TableCell, TableRow } from "./ui/table";

export default function TableSkeleton() {
    return (
        <>
            {
                Array.from({ length: 12 }).map((_, index) => (
                    <TableRow key={index}>
                        <TableCell>
                            <Skeleton className="h-4 w-32" />
                        </TableCell>

                        <TableCell>
                            <Skeleton className="h-4 w-24" />
                        </TableCell>

                        <TableCell>
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </TableCell>

                        <TableCell>
                            <Skeleton className="h-4 w-24" />
                        </TableCell>

                        <TableCell>
                            <Skeleton className="h-4 w-24" />
                        </TableCell>

                        <TableCell>
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </TableCell>
                    </TableRow>
                ))
            }
        </>
    )
}