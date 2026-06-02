import type { Role } from "@/hooks/useRole";
import { api } from "./axios";

export interface User {
  id: string
  name: string
  userName: string
  role: Role
}

interface GetUsersPaginatedParams {
  page: number
  limit: number
  search?: string
  roles?: Role[]
}

export const usersApi = {
  createUser: async (user: User): Promise<User> => {
    const response = await api.post('/users', user)
    return response.data
  },
  getUsersPaginated: async (params: GetUsersPaginatedParams): Promise<User[]> => {
    const response = await api.get<{ bookings: User[] }>('/users', { params })
    return response.data.bookings || []
  },
  getUsers: async (search?: string): Promise<User[]> => {
    const params = search ? { search: search } : {}
    const response = await api.get('/users/full', { params })
    return response.data
  },
  updateUserRole: async (id: string, role: Role): Promise<User> => {
    const response = await api.patch(`/users/${id}/role`, { role })
    return response.data
  },
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`)
  }
};
