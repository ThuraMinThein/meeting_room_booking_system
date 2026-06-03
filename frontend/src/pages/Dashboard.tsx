import { useState } from "react";
import { format } from "date-fns";
import {
    CalendarIcon,
    Users,
    ClipboardList,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";

import { useGetBookingsByDate, useGetBookingsByUser, useGetBookingSummary } from "@/hooks/useBooking";
import { useGetUsers } from "@/hooks/useUser";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";
import { MonthlyUserStats } from "@/components/MonthlyUserStatsChart";

const Dashboard = () => {

    const [searchParams, setSearchParams] = useSearchParams();

    const activeTab = searchParams.get("tab") ?? "overview";

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);

    const { data: summary, isPending: isSummaryPending } = useGetBookingSummary(selectedDate);
    const { data: users = [] } = useGetUsers();
    const { data: bookings = [], isPending: isBookingsPending } = useGetBookingsByDate(selectedDate);
    const { data: userBookings } = useGetBookingsByUser(selectedUserId, { page, limit });

    const bookedHours = bookings.reduce(
        (total, booking) => {
            const start = new Date(
                booking.startTime
            );

            const end = new Date(
                booking.endTime
            );

            return (
                total +
                (end.getTime() -
                    start.getTime()) /
                (1000 * 60 * 60)
            );
        },
        0
    );

    if (isSummaryPending || isBookingsPending) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="space-y-6 p-4 md:p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">
                    Dashboard
                </h1>

                <Popover>
                    <PopoverTrigger
                        asChild
                    >
                        <Button variant="outline">
                            <CalendarIcon className="mr-2 h-4 w-4" />

                            {format(
                                selectedDate,
                                "PPP"
                            )}
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0 m-4">
                        <Calendar
                            mode="single"
                            selected={
                                selectedDate
                            }
                            onSelect={(
                                date
                            ) =>
                                date &&
                                setSelectedDate(
                                    date
                                )
                            }
                        />
                    </PopoverContent>
                </Popover>
            </div>


            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Monthly Total Bookings
                        </CardTitle>

                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>

                    <CardContent>
                        <div className="text-3xl font-bold">
                            {summary?.totalBookings}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Users
                        </CardTitle>

                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>

                    <CardContent>
                        <div className="text-3xl font-bold">
                            {users.length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Booked Hours Today
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="text-3xl font-bold">
                            {bookedHours.toFixed(1)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs
                defaultValue={activeTab}
                onValueChange={(value) =>
                    setSearchParams({ tab: value })
                }
            >
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="user-bookings">User's Bookings</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                    <div className="grid gap-4 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Today's Bookings
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <ScrollArea className="h-100">
                                    <div className="space-y-3">
                                        {bookings?.length === 0 && (
                                            <Empty>
                                                <EmptyHeader>
                                                    <EmptyTitle>No Bookings Today</EmptyTitle>
                                                </EmptyHeader>
                                            </Empty>
                                        )}
                                        {bookings.map((booking) => (
                                            <div
                                                key={booking.id}
                                                className="rounded-lg border p-3 flex items-center justify-between"
                                            >
                                                <div>

                                                    <p className="font-medium">
                                                        {booking.title}
                                                    </p>

                                                    <p className="text-sm text-muted-foreground">
                                                        {booking.user?.name}
                                                    </p>
                                                </div>

                                                <p className="text-sm">
                                                    {format(
                                                        new Date(
                                                            booking.startTime
                                                        ),
                                                        "HH:mm"
                                                    )}
                                                    {" - "}
                                                    {format(
                                                        new Date(
                                                            booking.endTime
                                                        ),
                                                        "HH:mm"
                                                    )}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        <MonthlyUserStats summary={summary} />
                    </div>
                </TabsContent>
                <TabsContent value="user-bookings">
                    <div className="flex items-center justify-end my-8">
                        <Select
                            value={selectedUserId}
                            onValueChange={setSelectedUserId}
                        >
                            <SelectTrigger className="w-62.5">
                                <SelectValue placeholder="Select user" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Users</SelectLabel>
                                    {users.map((user) => (
                                        <SelectItem
                                            key={user.id}
                                            value={user.id!}
                                        >
                                            {user.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    {!selectedUserId && (
                        <Empty>
                            <EmptyHeader>
                                <EmptyTitle>Select a user to view bookings.</EmptyTitle>
                            </EmptyHeader>
                        </Empty>
                    )}

                    {!userBookings || userBookings === undefined || userBookings.items.length === 0 && (
                        <Empty>
                            <EmptyHeader>
                                <EmptyTitle>User has no bookings.</EmptyTitle>
                            </EmptyHeader>
                        </Empty>
                    )}
                    {userBookings && (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            Date
                                        </TableHead>
                                        <TableHead>
                                            Start
                                        </TableHead>

                                        <TableHead>
                                            End
                                        </TableHead>

                                        <TableHead>
                                            Created
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {userBookings.items.map(
                                        (booking) => (
                                            <TableRow
                                                key={booking.id}
                                            >

                                                <TableCell>
                                                    {format(
                                                        new Date(
                                                            booking.startTime
                                                        ),
                                                        "PPP"
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {format(
                                                        new Date(
                                                            booking.startTime
                                                        ),
                                                        "HH:MM a"
                                                    )}
                                                </TableCell>

                                                <TableCell>
                                                    {format(
                                                        new Date(
                                                            booking.endTime
                                                        ),
                                                        "HH:MM a"
                                                    )}
                                                </TableCell>

                                                <TableCell>
                                                    {format(
                                                        new Date(
                                                            booking.createdAt!
                                                        ),
                                                        "PPP"
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Showing {userBookings.meta.itemCount} of{" "}
                                    {userBookings.meta.totalItems} bookings
                                </p>

                                <div className="flex w-full gap-2 sm:w-auto">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 sm:flex-none"
                                        disabled={page === 1}
                                        onClick={() => setPage(page - 1)}
                                    >
                                        Previous
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 sm:flex-none"
                                        disabled={!userBookings.meta.hasNextPage}
                                        onClick={() => setPage(page + 1)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </TabsContent>
            </Tabs>

        </div>
    );
};

export default Dashboard;