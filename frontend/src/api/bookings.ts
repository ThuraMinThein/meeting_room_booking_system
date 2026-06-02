import { api } from './axios'
import type { User } from './users'

export interface Booking {
  id?: string
  title: string
  startTime: string
  endTime: string
  userId?: string
  user?: User
  createdAt?: string
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
  getBookingsByDate: async (date: Date): Promise<Booking[]> => {
    const response = await api.get<Booking[]>(`/bookings/date/${date}`)
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
