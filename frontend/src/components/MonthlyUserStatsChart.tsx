import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart"
import type { BookingSummary } from "@/api/bookings"

const chartConfig = {
    bookingCount: {
        label: "Bookings",
        color: "hsl(var(--primary))",
    },
}

export function MonthlyUserStats({ summary }: { summary: BookingSummary | undefined }) {
    const hasNoData = !summary?.users || summary.users.length === 0

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>Monthly User Stats</CardTitle>
                <CardDescription>Top users by booking volume this month</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 pb-0">
                {hasNoData ? (
                    <div className="flex h-75 items-center justify-center rounded-lg border border-dashed">
                        <p className="text-sm text-muted-foreground">No Users Have Booked for This Month</p>
                    </div>
                ) : (
                    <ScrollArea className="h-87.5 pr-4">
                        <ChartContainer config={chartConfig} className="min-h-50 w-full">
                            <BarChart
                                accessibilityLayer
                                data={summary.users}
                                layout="vertical"
                                margin={{
                                    left: 30,
                                    right: 16,
                                }}
                            >
                                <CartesianGrid horizontal={false} strokeDasharray="3 3" />

                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    className="text-xs font-medium"
                                />

                                <XAxis dataKey="bookingCount" type="number" hide />

                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />

                                <Bar
                                    dataKey="bookingCount"
                                    fill="var(--color-bookingCount)"
                                    radius={5}
                                />
                            </BarChart>
                        </ChartContainer>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    )
}