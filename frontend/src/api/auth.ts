import type { Role } from '@/hooks/useRole'
import { api } from './axios'
import type { User } from './users'

export interface AuthResponse {
  id: string,
  name: string,
  userName: string,
  role: Role,
  accessToken: string
}

export interface LoginRequest {
  userName: string,
  password: string,
}

export const authApi = {
  login: async (loginRequest: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { ...loginRequest })
    return response.data
  },
  getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me')
    return response.data
  }
}
