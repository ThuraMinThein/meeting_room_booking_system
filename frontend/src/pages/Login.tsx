import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLogin } from "@/hooks/useAuth"
import { ADMIN_PASSWORD, ADMIN_USERNAME, OWNER_PASSWORD, OWNER_USERNAME, USER_PASSWORD, USER_USERNAME } from "@/utils/constants/credentials.constant"
import { useSearchParams } from "react-router-dom"
import { toast } from "sonner"

const Login = () => {

    const { mutate, isPending } = useLogin()

    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get("tab") ?? "credentials";

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)

        const userName = formData.get("userName")?.toString();
        const password = formData.get("password")?.toString();

        if (!userName || !password) {
            toast.error("Please fill all the fields")
            return
        }

        mutate({ userName, password })
    }

    const handleUserLogin = () => {
        mutate({ userName: USER_USERNAME, password: USER_PASSWORD })
    }

    const handleAdminLogin = () => {

        mutate({ userName: ADMIN_USERNAME, password: ADMIN_PASSWORD })
    }

    const handleOwnerLogin = () => {

        mutate({ userName: OWNER_USERNAME, password: OWNER_PASSWORD })
    }

    return (
        <Tabs
            defaultValue={activeTab}
            onValueChange={(value) =>
                setSearchParams({ tab: value })
            }
        >
            <div className="flex flex-col min-h-screen justify-center items-center bg-muted/30 px-4">
                <div className="w-full max-w-md flex flex-col">

                    <div className="flex justify-center pb-6">
                        <TabsList>
                            <TabsTrigger value="credentials">Credentials Login</TabsTrigger>
                            <TabsTrigger value="select">Select Role</TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="w-full min-h-85 flex flex-col items-start justify-start">

                        <TabsContent value="credentials" className="mt-0 w-full animate-none">
                            <Card className="w-full">
                                <CardHeader className="space-y-1">
                                    <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                                    <CardDescription>
                                        Enter your credentials to access your account
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="userName">User Name</Label>
                                            <Input id="userName" name="userName" type="text" placeholder="userName" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Password</Label>
                                            <Input id="password" name="password" type="password" placeholder="••••••••" required />
                                        </div>
                                        <Button type="submit" className="w-full" disabled={isPending}>
                                            {isPending ? <Spinner /> : "Sign In"}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="select" className="mt-0 w-full animate-none">
                            <Card className="w-full">
                                <CardHeader className="space-y-1">
                                    <CardTitle className="text-2xl font-bold">Select Role</CardTitle>
                                    <CardDescription>
                                        Select a role to access your demo account
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-4 sm:grid-cols-3">
                                    <Button variant="outline" onClick={handleUserLogin} className="w-full" disabled={isPending}>
                                        {isPending ? <Spinner /> : "User"}
                                    </Button>
                                    <Button variant="outline" onClick={handleAdminLogin} className="w-full" disabled={isPending}>
                                        {isPending ? <Spinner /> : "Admin"}
                                    </Button>
                                    <Button variant="outline" onClick={handleOwnerLogin} className="w-full" disabled={isPending}>
                                        {isPending ? <Spinner /> : "Owner"}
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>

                    </div>
                </div>
            </div>
        </Tabs>
    )
}

export default Login