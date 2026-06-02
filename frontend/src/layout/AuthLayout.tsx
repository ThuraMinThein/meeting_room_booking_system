import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

export default function AuthLayout() {
    return (
        <main>
            <Toaster />
            <Outlet />
        </main>
    )
}