import type { Booking } from "@/api/bookings";
import type { User } from "@/api/users";
import { CreateBookingDialog } from "@/components/CreateBookingDialog";
import DeleteBookingButton from "@/components/DeleteBookingButton";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCreateBooking, useDeleteBooking, useGetBookings } from "@/hooks/useBooking";
import { useAuthStore } from "@/store/auth";
import { FolderCode, MoreHorizontal, Plus } from "lucide-react";
import { useState } from "react";

const formatTime = (date: string) =>
    new Date(date).toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });

const Bookings = () => {
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [limit] = useState(12);
    const { data, isError, isPending } = useGetBookings({ page, limit });
    const { mutate: createBooking } = useCreateBooking();
    const { mutate } = useDeleteBooking();
    const { user: currentUser } = useAuthStore(state => state);

    const canDeleteBooking = (
        booking: Booking,
        currentUser: User
    ) => {
        if (currentUser.role !== "User") {
            return true;
        }

        return booking.userId === currentUser.id;
    };

    const handleCreateBooking = (booking: Booking) => {
        createBooking(booking);
    }

    const handleDeleteBooking = (bookingId: string) => {
        mutate(bookingId);
    };

    if (isError) {
        return (
            <Empty >
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <FolderCode />
                    </EmptyMedia>
                    <EmptyTitle>Error Loading Meetings</EmptyTitle>
                </EmptyHeader>
            </Empty>
        )
    }

    if (!data && !isPending) {
        return (
            <Empty >
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <FolderCode />
                    </EmptyMedia>
                    <EmptyTitle>No Meetings Yet</EmptyTitle>
                    <EmptyDescription>
                        No one haven't created any meetings yet. Get started by creating
                        your first meeting.
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent className="flex-row justify-center gap-2">
                    <Button onClick={() => setOpen(true)}>Create Meeting</Button>
                </EmptyContent>
            </Empty>
        )
    }

    return (
        <div className="flex flex-col gap-6 p-4 md:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Bookings
                    </h1>

                </div>

                <Button className="w-full sm:w-auto" onClick={() => setOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Booking
                </Button>
            </div>

            <CreateBookingDialog
                open={open}
                onOpenChange={setOpen}
                onSubmit={async (payload) => { handleCreateBooking(payload) }}
            />

            <Card>
                <CardHeader>
                    <CardTitle>Booking List</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="hidden md:block">
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>Meeting Date</TableHead>
                                        <TableHead>Start Time</TableHead>
                                        <TableHead>End Time</TableHead>
                                        <TableHead>Booked At</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>

                                {isPending ? (
                                    <TableSkeleton />
                                ) : (
                                    <TableBody>
                                        {data.items.map((booking) => (
                                            <TableRow key={booking.id}>
                                                <TableCell className="font-medium">
                                                    {booking.title}
                                                </TableCell>

                                                <TableCell>
                                                    {booking.user!.name}
                                                </TableCell>

                                                <TableCell>
                                                    {
                                                        new Date(booking.startTime).toLocaleDateString("en-US", {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                        })
                                                    }
                                                </TableCell>

                                                <TableCell>
                                                    {formatTime(
                                                        booking.startTime
                                                    )}
                                                </TableCell>

                                                <TableCell>
                                                    {formatTime(
                                                        booking.endTime
                                                    )}
                                                </TableCell>

                                                <TableCell>
                                                    {
                                                        new Date(booking.createdAt!).toLocaleDateString()
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                            >
                                                                <MoreHorizontal />
                                                            </Button>
                                                        </DropdownMenuTrigger>

                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem className="flex justify-center hover:cursor-not-allowed">
                                                                View
                                                            </DropdownMenuItem>

                                                            {canDeleteBooking(
                                                                booking,
                                                                currentUser!
                                                            ) && (
                                                                    <DeleteBookingButton
                                                                        bookingId={booking.id!}
                                                                        onDelete={(id: string) =>
                                                                            handleDeleteBooking(id)
                                                                        }
                                                                        type="text"
                                                                    />
                                                                )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                )}
                            </Table>
                        </div>
                    </div>

                    <div className="space-y-4 md:hidden">
                        {data?.items.map((booking) => (
                            <Card key={booking.id}>
                                <CardContent className="space-y-4 pt-6">
                                    <div>
                                        <h3 className="font-semibold">
                                            {booking.title}
                                        </h3>

                                        <p className="text-sm text-muted-foreground">
                                            {booking.user!.name}
                                        </p>
                                    </div>

                                    <div className="grid gap-3 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">
                                                Meeting Date
                                            </p>
                                            <p>
                                                {new Date(booking.startTime!).toLocaleDateString("en-US", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">
                                                Start Time
                                            </p>
                                            <p>
                                                {formatTime(
                                                    booking.startTime
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-muted-foreground">
                                                End Time
                                            </p>
                                            <p>
                                                {formatTime(
                                                    booking.endTime
                                                )}
                                            </p>
                                        </div>

                                    </div>
                                    {canDeleteBooking(
                                        booking,
                                        currentUser!
                                    ) && (
                                            <div className="pt-2">
                                                <DeleteBookingButton
                                                    bookingId={booking.id!}
                                                    onDelete={(id) =>
                                                        handleDeleteBooking(id)
                                                    }
                                                    type="icon"
                                                />
                                            </div>
                                        )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-muted-foreground">
                            {data && data?.meta.itemCount * page} of{" "}
                            {data?.meta.totalItems} bookings
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
                                disabled={!data?.meta.hasNextPage}
                                onClick={() => setPage(page + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Bookings;