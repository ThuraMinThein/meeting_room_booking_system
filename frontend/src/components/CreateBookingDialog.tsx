import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useGetBookingsByDate } from "@/hooks/useBooking";
import { Spinner } from "./ui/spinner";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    onSubmit: (payload: {
        title: string;
        startTime: string;
        endTime: string;
    }) => Promise<void>;

};

export function CreateBookingDialog({
    open,
    onOpenChange,
    onSubmit,
}: Props) {
    const [title, setTitle] = useState("");

    const [date, setDate] = useState<Date>();

    const [startTime, setStartTime] = useState("");

    const [endTime, setEndTime] = useState("");

    const { data: bookings, isLoading } = useGetBookingsByDate(date);

    const [error, setError] = useState<string>();

    const handleCreate = async () => {
        setError(undefined);

        if (
            !title ||
            !date ||
            !startTime ||
            !endTime
        ) {
            setError(
                "Please fill all required fields."
            );

            return;
        }

        const [startHour, startMinute] =
            startTime.split(":");

        const [endHour, endMinute] =
            endTime.split(":");

        const start = new Date(date);
        start.setHours(
            Number(startHour),
            Number(startMinute),
            0,
            0
        );

        const end = new Date(date);
        end.setHours(
            Number(endHour),
            Number(endMinute),
            0,
            0
        );

        if (start < new Date()) {
            setError(
                "Start time must be in the future."
            );

            return;
        }

        if (end <= start) {
            setError(
                "End time must be after start time."
            );

            return;
        }

        const hasConflict = bookings?.some(
            (booking) => {
                const bookingStart = new Date(
                    booking.startTime
                );

                const bookingEnd = new Date(
                    booking.endTime
                );

                return (
                    start < bookingEnd &&
                    end > bookingStart
                );
            }
        );

        if (hasConflict) {
            setError(
                "Selected time overlaps with an existing booking."
            );

            return;
        }

        await onSubmit({
            title,
            startTime: start.toISOString(),
            endTime: end.toISOString(),
        });

        onOpenChange(false);

        setTitle("");
        setDate(undefined);
        setStartTime("");
        setEndTime("");
    };

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create Booking
                    </DialogTitle>

                    <DialogDescription>
                        Select a date and time.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Title</Label>

                        <Input
                            value={title}
                            onChange={(e) =>
                                setTitle(
                                    e.target.value
                                )
                            }
                            required
                            placeholder="Meeting title"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Date</Label>

                        <Popover>
                            <PopoverTrigger
                                asChild
                            >
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />

                                    {date
                                        ? format(
                                            date,
                                            "PPP"
                                        )
                                        : "Select date"}
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent
                                className="w-auto p-0"
                                align="start"
                            >
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={
                                        setDate
                                    }
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>
                                Start Time
                            </Label>

                            <Input
                                type="time"
                                disabled={!date}
                                value={startTime}
                                required
                                onChange={(e) =>
                                    setStartTime(
                                        e.target
                                            .value
                                    )
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>
                                End Time
                            </Label>

                            <Input
                                type="time"
                                disabled={!date}
                                value={endTime}
                                required
                                onChange={(e) =>
                                    setEndTime(
                                        e.target
                                            .value
                                    )
                                }
                            />
                        </div>
                    </div>

                    {isLoading && (
                        <p className="text-sm text-muted-foreground">
                            Loading existing
                            bookings <Spinner />
                        </p>
                    )}

                    {bookings && bookings.length > 0 && (
                        <div className="rounded-md border p-3">
                            <p className="mb-2 text-sm font-medium">
                                Existing bookings
                            </p>

                            <div className="space-y-1 text-sm text-muted-foreground">
                                {bookings.map(
                                    (
                                        booking
                                    ) => (
                                        <div
                                            key={
                                                booking.id
                                            }
                                        >
                                            {new Date(
                                                booking.startTime
                                            ).toLocaleTimeString()}{" "}
                                            -
                                            {" "}
                                            {new Date(
                                                booking.endTime
                                            ).toLocaleTimeString()}
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {error && (
                        <p className="text-sm text-red-500">
                            {error}
                        </p>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() =>
                            onOpenChange(
                                false
                            )
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={
                            handleCreate
                        }
                    >
                        Create Booking
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}