import { bookingsApi, type Booking, type BookingSummaryParam, type PaginationParams } from "@/api/bookings"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

const useCreateBooking = (booking: Booking) => useMutation({
    mutationFn: () => bookingsApi.createBooking(booking),
    onSuccess: () => {
        toast.success("Booking Created Successfully", {
            description: booking.startTime.toLocaleDateString(),
            position: 'top-right'
        })
    },
    onError: (error) => {
        toast.error("Booking Creation Failed", {
            description: error instanceof Error ? error.message : "Something went wrong",
            position: 'top-right'
        })
    }
})

const useGetBookings = (params: PaginationParams) => useQuery({
    queryKey: ['bookings', params],
    queryFn: () => bookingsApi.getBookings(params),
})

const useGetBookingsByUser = (userId: string, params: PaginationParams) => useQuery({
    queryKey: ['bookings', userId, params],
    queryFn: () => bookingsApi.getBookingsByUser(userId, params),
})

const useGetBookingSummary = (params: BookingSummaryParam) => useQuery({
    queryKey: ['bookings-summary', params],
    queryFn: () => bookingsApi.getBookingSummary(params),
})

const useDeleteBooking = (id: string) => useMutation({
    mutationFn: () => bookingsApi.deleteBooking(id),
    onSuccess: () => {
        toast.success("Booking Deleted Successfully", {
            position: 'top-right'
        })
    },
    onError: (error) => {
        toast.error("Booking Deletion Failed", {
            description: error instanceof Error ? error.message : "Something went wrong",
            position: 'top-right'
        })
    }
})

export {
    useCreateBooking,
    useGetBookings,
    useGetBookingsByUser,
    useGetBookingSummary,
    useDeleteBooking
}