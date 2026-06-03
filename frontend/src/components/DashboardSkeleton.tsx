import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "./ui/card";

export function DashboardSkeleton() {
    return (
        <div className="space-y-6 p-4 md:p-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-10 w-40" />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-4 w-32" />
                        </CardHeader>

                        <CardContent>
                            <Skeleton className="h-10 w-20" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Skeleton className="h-10 w-72" />

            <div className="grid gap-4 lg:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-48" />
                        </CardHeader>

                        <CardContent className="space-y-3">
                            {Array.from({ length: 6 }).map((_, j) => (
                                <div
                                    key={j}
                                    className="flex items-center justify-between rounded-lg border p-3"
                                >
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-40" />
                                        <Skeleton className="h-3 w-28" />
                                    </div>

                                    <Skeleton className="h-4 w-20" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}