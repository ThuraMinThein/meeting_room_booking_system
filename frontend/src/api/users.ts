import type { Role } from "@/hooks/useRole";
import { api } from "./axios";

export interface User {
  id?: string
  name: string
  userName: string
  role: Role
  createdAt?: string
  updatedAt?: string
}

export interface GetUsersPaginatedParams {
  page: number
  limit: number
  search?: string
  roles?: Role[]
}

export interface PaginatedUser {
  items: User[]
  meta: {
    itemCount: number
    totalItems: number
    hasNextPage: boolean
    totalPage: number
  }
}

export const usersApi = {
  createUser: async (user: User): Promise<User> => {
    const response = await api.post('/users', user)
    return response.data
  },
  getUsersPaginated: async (params: GetUsersPaginatedParams): Promise<PaginatedUser> => {
    const response = await api.get<PaginatedUser>('/users', {
      params,
      paramsSerializer: {
        serialize: (params) => {
          const searchParams = new URLSearchParams();
          for (const key in params) {
            if (params[key] !== undefined && params[key] !== null) {
              if (Array.isArray(params[key])) {
                searchParams.append(key, JSON.stringify(params[key]));
              } else {
                searchParams.append(key, String(params[key]));
              }
            }
          }
          return searchParams.toString();
        }
      }
    });

    return response.data || [];
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
