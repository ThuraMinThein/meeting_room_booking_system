import { usersApi, type GetUsersPaginatedParams, type User } from "@/api/users"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { toast } from "sonner"
import type { Role } from "./useRole"

const useCreateUser = () => useMutation({
    mutationFn: (user: User) => usersApi.createUser(user),
    onSuccess: () => {
        toast.success("User Created Successfully", {
            position: 'top-right'
        })
    },
    onError: (error) => {
        const axiosError = error as AxiosError<{ message: string }>;
        toast.error("User Creation Failed", {
            description:
                axiosError.response?.data?.message ??
                axiosError.message ??
                "Something went wrong",
            position: 'top-right'
        })
    }
})

const useGetUsersPaginated = (params: GetUsersPaginatedParams) => useQuery({
    queryKey: ['users-paginated', params],
    queryFn: () => usersApi.getUsersPaginated(params),
})

const useGetUsers = (search?: string) => useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getUsers(search),
})

const useUpdateUserRole = () => useMutation({
    mutationFn: ({ id, role }: { id: string, role: Role }) => usersApi.updateUserRole(id, role),
    onSuccess: () => {
        toast.success("User Role Updated Successfully", {
            position: 'top-right'
        })
    },
    onError: (error) => {
        const axiosError = error as AxiosError<{ message: string }>;
        toast.error("User Role Update Failed", {
            description:
                axiosError.response?.data?.message ??
                axiosError.message ??
                "Something went wrong",
            position: 'top-right'
        })
    }
})

const useDeleteUser = (id: string) => useMutation({
    mutationFn: () => usersApi.deleteUser(id),
    onSuccess: () => {
        toast.success("User Deleted Successfully", {
            position: 'top-right'
        })
    },
    onError: (error) => {
        const axiosError = error as AxiosError<{ message: string }>;
        toast.error("User Deletion Failed", {
            description:
                axiosError.response?.data?.message ??
                axiosError.message ??
                "Something went wrong",
            position: 'top-right'
        })
    }
})

export {
    useCreateUser,
    useGetUsersPaginated,
    useGetUsers,
    useUpdateUserRole,
    useDeleteUser
}