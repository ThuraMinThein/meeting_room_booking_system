
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { Outlet } from "react-router-dom"

export default function AppLayout() {
    return (
        <SidebarProvider>
            <AppSidebar />

            <SidebarInset>
                <header className="flex h-14 items-center border-b px-4">
                    <SidebarTrigger />
                </header>

                <main className="flex-1">
                    <Toaster />
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}