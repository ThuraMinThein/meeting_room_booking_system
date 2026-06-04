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

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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

    const [startPeriod, setStartPeriod] = useState<"AM" | "PM">("PM");
    const [endPeriod, setEndPeriod] = useState<"AM" | "PM">("PM");

    const { data: bookings, isLoading } = useGetBookingsByDate(date);
    const [error, setError] = useState<string>();

    const parseTimeTo24H = (timeStr: string, period: "AM" | "PM") => {
        const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})$/);
        if (!match) return null;

        let hours = Number(match[1]);
        const minutes = Number(match[2]);

        if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) return null;

        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;

        return { hours, minutes };
    };

    const handleCreate = async () => {
        setError(undefined);

        if (!title || !date || !startTime || !endTime) {
            setError("Please fill all required fields.");
            return;
        }

        const parsedStart = parseTimeTo24H(startTime, startPeriod);
        const parsedEnd = parseTimeTo24H(endTime, endPeriod);

        if (!parsedStart || !parsedEnd) {
            setError("Please enter valid times in HH:MM format (e.g., 1:30).");
            return;
        }

        const start = new Date(date);
        start.setHours(parsedStart.hours, parsedStart.minutes, 0, 0);

        const end = new Date(date);
        end.setHours(parsedEnd.hours, parsedEnd.minutes, 0, 0);

        if (start < new Date()) {
            setError("Start time must be in the future.");
            return;
        }

        if (end <= start) {
            setError("End time must be after start time.");
            return;
        }

        const hasConflict = bookings?.some((booking) => {
            const bookingStart = new Date(booking.startTime);
            const bookingEnd = new Date(booking.endTime);
            return start < bookingEnd && end > bookingStart;
        });

        if (hasConflict) {
            setError("Selected time overlaps with an existing booking.");
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
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Booking</DialogTitle>
                    <DialogDescription>Select a date and time.</DialogDescription>
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
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : "Select date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={date} onSelect={setDate} />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Start Time</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="00:00"
                                    disabled={!date}
                                    value={startTime}
                                    required
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="flex-1"
                                />
                                <Select
                                    disabled={!date}
                                    value={startPeriod}
                                    onValueChange={(val: "AM" | "PM") => setStartPeriod(val)}
                                >
                                    <SelectTrigger className="w-18.75">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="AM">AM</SelectItem>
                                        <SelectItem value="PM">PM</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>End Time</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="00:00"
                                    disabled={!date}
                                    value={endTime}
                                    required
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="flex-1"
                                />
                                <Select
                                    disabled={!date}
                                    value={endPeriod}
                                    onValueChange={(val: "AM" | "PM") => setEndPeriod(val)}
                                >
                                    <SelectTrigger className="w-18.75">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="AM">AM</SelectItem>
                                        <SelectItem value="PM">PM</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {isLoading && (
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                            Loading existing bookings <Spinner />
                        </p>
                    )}

                    {bookings && bookings.length > 0 && (
                        <div className="rounded-md border p-3">
                            <p className="mb-2 text-sm font-medium">Existing bookings</p>
                            <div className="space-y-1 text-sm text-muted-foreground">
                                {bookings.map((booking) => (
                                    <div key={booking.id}>
                                        {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {" "}
                                        {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {error && <p className="text-sm text-red-500">{error}</p>}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreate}>Create Booking</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}