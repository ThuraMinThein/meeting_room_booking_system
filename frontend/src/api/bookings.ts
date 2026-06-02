import { api } from './axios'

export interface Booking {
  id: string
  title: string
  startTime: Date
  endTime: Date
}

export interface PaginatedBookings {
  items: Booking[]
  meta: {
    itemCount: number
    totalItems: number
    hasNextPage: boolean
    totalPage: number
  }
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface BookingSummaryParam {
  date: Date
}

interface UserWithBookingCount {
  userId: string,
  name: string,
  bookingCount: number
}

interface BookingSummary {
  totalBookings: number
  users: UserWithBookingCount[]
}

export const bookingsApi = {
  createBooking: async (booking: Booking): Promise<void> => {
    await api.post('/bookings', booking)
  },
  getBookings: async (params: PaginationParams): Promise<PaginatedBookings> => {
    const response = await api.get<PaginatedBookings>('/bookings', { params })
    return response.data
  },
  getBookingsByUser: async (userId: string, params: PaginationParams): Promise<PaginatedBookings> => {
    const response = await api.get<PaginatedBookings>(`/bookings/user/${userId}`, { params })
    return response.data
  },
  getBookingSummary: async (params: BookingSummaryParam): Promise<BookingSummary> => {
    const response = await api.get<BookingSummary>('/bookings/summary', { params })
    return response.data
  },
  deleteBooking: async (id: string): Promise<void> => {
    await api.delete(`/bookings/${id}`)
  }
}
