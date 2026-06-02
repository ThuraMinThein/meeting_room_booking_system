
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { Outlet } from "react-router-dom"

export default function AppLayout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main>
                <Toaster />
                <SidebarTrigger />
                <Outlet />
            </main>
        </SidebarProvider>
    )
}