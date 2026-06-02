import { bookingsApi, type Booking, type PaginationParams } from "@/api/bookings"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { toast } from "sonner"

const useCreateBooking = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (booking: Booking) => bookingsApi.createBooking(booking),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["bookings"]
            });
            toast.success("Booking Created Successfully", {
                position: 'top-right'
            })
        },
        onError: (error) => {
            const axiosError = error as AxiosError<{ message: string }>;
            toast.error("Booking Creation Failed", {
                description:
                    axiosError.response?.data?.message ??
                    axiosError.message ??
                    "Something went wrong",
                position: 'top-right'
            })
        }
    })
}

const useGetBookings = (params: PaginationParams) => useQuery({
    queryKey: ['bookings', params],
    queryFn: () => bookingsApi.getBookings(params),
})

const useGetBookingsByDate = (date?: Date) => useQuery({
    queryKey: ['bookings', date],
    queryFn: () => bookingsApi.getBookingsByDate(date!),
    enabled: !!date,
})

const useGetBookingsByUser = (userId?: string, params?: PaginationParams) => useQuery({
    queryKey: ['bookings', userId, params],
    queryFn: () => bookingsApi.getBookingsByUser(userId!, params!),
    enabled: !!userId
})

const useGetBookingSummary = (date?: Date) => useQuery({
    queryKey: ['bookings-summary', date],
    queryFn: () => bookingsApi.getBookingSummary({ date: date! }),
    enabled: !!date
})

const useDeleteBooking = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => bookingsApi.deleteBooking(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["bookings"]
            });
            toast.success("Booking Deleted Successfully", {
                position: 'top-right'
            })
        },
        onError: (error) => {
            const axiosError = error as AxiosError<{ message: string }>;
            toast.error("Booking Deletion Failed", {
                description:
                    axiosError.response?.data?.message ??
                    axiosError.message ??
                    "Something went wrong",
                position: 'top-right'
            })
        }
    })
}

export {
    useCreateBooking,
    useGetBookings,
    useGetBookingsByDate,
    useGetBookingsByUser,
    useGetBookingSummary,
    useDeleteBooking
}