import { usersApi, type GetUsersPaginatedParams, type User } from "@/api/users"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { toast } from "sonner"
import type { Role } from "./useRole"

const useCreateUser = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (user: User) => usersApi.createUser(user),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["users-paginated"]
            })
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
}

const useGetUsersPaginated = (params: GetUsersPaginatedParams) => useQuery({
    queryKey: ['users-paginated', params],
    queryFn: () => usersApi.getUsersPaginated(params),
})

const useGetUsers = (search?: string) => useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getUsers(search),
})

const useUpdateUserRole = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, role }: { id: string, role: Role }) => usersApi.updateUserRole(id, role),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["users-paginated"]
            })
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
}

const useDeleteUser = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => usersApi.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["users-paginated"]
            })
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
}

export {
    useCreateUser,
    useGetUsersPaginated,
    useGetUsers,
    useUpdateUserRole,
    useDeleteUser
}