import { useAuthStore } from "@/store/auth";
import { Navigate } from "react-router-dom";

export type Role = "Owner" | "Admin" | "User";

interface RequireRoleProps {
    roles: Role[];
    children: React.ReactNode;
}

export function RequireRole({
    roles,
    children,
}: RequireRoleProps) {
    const role = useAuthStore((state) => state?.user?.role);

    if (!role || !roles.includes(role)) {
        return <Navigate to="/not-found" replace />;
    }

    return <>{children} </>;
}