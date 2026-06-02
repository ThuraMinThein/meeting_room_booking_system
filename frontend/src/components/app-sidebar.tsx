import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/store/auth";
import { Bell, Building2, ChevronsUpDown, LogOut, Settings, User } from "lucide-react"
import { Link, useLocation } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { NAV_ITEMS } from "@/lib/constants/navbar-items.constant";

export function AppSidebar() {

    const location = useLocation();
    const [logoutOpen, setLogoutOpen] = useState(false);

    const { user, logout } = useAuthStore(state => state);
    const role = user?.role;

    const navItems = NAV_ITEMS.filter((item) => role && item.roles.includes(role));

    return (
        <Sidebar>
            <SidebarHeader className="border-b">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                <Building2 className="h-4 w-4" />
                            </div>

                            <div className="flex flex-col text-left">
                                <span className="font-medium">
                                    {user?.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    Role: {role}
                                </span>
                            </div>

                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>

                    <SidebarMenu>
                        {navItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <SidebarMenuItem key={item.url}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={
                                            location.pathname === item.url
                                        }
                                    >
                                        <Link to={item.url}>
                                            <Icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t">
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton size="lg" className="hover:cursor-pointer">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>
                                        {user?.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex flex-col text-left">
                                    <span className="font-medium">
                                        {user?.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {user?.userName}
                                    </span>
                                </div>

                                <ChevronsUpDown className="ml-auto" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            className="w-56"
                            side="right"
                            align="end"
                        >
                            <DropdownMenuLabel>
                                <div className="flex flex-col">
                                    <span>{user?.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {user?.userName}
                                    </span>
                                </div>
                            </DropdownMenuLabel>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem className="cursor-not-allowed">
                                <User />
                                Profile
                            </DropdownMenuItem>

                            <DropdownMenuItem className="cursor-not-allowed">
                                <Settings />
                                Settings
                            </DropdownMenuItem>

                            <DropdownMenuItem className="cursor-not-allowed">
                                <Bell />
                                Notifications
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                onSelect={(e) => {
                                    e.preventDefault();
                                    setLogoutOpen(true);
                                }}
                                className="text-red-500"
                            >
                                <LogOut />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Logout
                                </AlertDialogTitle>

                                <AlertDialogDescription>
                                    Are you sure you want to logout?
                                    You will need to sign in again to access the system.
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                                <AlertDialogCancel>
                                    Cancel
                                </AlertDialogCancel>

                                <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-800"
                                    onClick={() => {
                                        logout();
                                    }}
                                >
                                    Logout
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            </SidebarFooter>
        </Sidebar>
    )
}