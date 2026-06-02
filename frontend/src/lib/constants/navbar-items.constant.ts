import { Calendar, LayoutDashboard, Users } from "lucide-react";

export const NAV_ITEMS = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        roles: ["Admin", "Owner"],
    },
    {
        title: "Bookings",
        url: "/bookings",
        icon: Calendar,
        roles: ["Admin", "Owner", "Staff"],
    },
    {
        title: "Users",
        url: "/users",
        icon: Users,
        roles: ["Admin"],
    },
]