import { authApi, type LoginRequest } from "@/api/auth";
import { useAuthStore } from "@/store/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const useLogin = () => {
    const setCredentials = useAuthStore(
        (state) => state.setCredentials
    )

    return useMutation({
        mutationFn: (loginRequest: LoginRequest) =>
            authApi.login(loginRequest),

        onSuccess: (data) => {
            setCredentials(
                {
                    id: data.id,
                    name: data.name,
                    userName: data.userName,
                    role: data.role,
                },
                data.accessToken
            )

            toast("Logged In Successfully", {
                position: "top-right",
            })
        },

        onError: (error) => {

            console.log(error)
            toast.error("Login Failed", {
                description:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong",
                position: "top-right",
            })
        },
    })
}

const useGetMe = () => useQuery({
    queryKey: ['me'],
    queryFn: () => authApi.getMe(),
})

export {
    useLogin,
    useGetMe
}