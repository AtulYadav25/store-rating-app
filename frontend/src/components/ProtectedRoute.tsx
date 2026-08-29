import {
    Navigate,
    Outlet,
    useLocation,
} from "react-router-dom";
import { useCurrentUser } from "../hooks/useAuth";
import type { UserRole } from "../constants/ROLES";

interface ProtectedRouteProps {
    allowedRoles?: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps = {}) {
    const location = useLocation();
    const { data: user, isLoading, isError } = useCurrentUser();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (isError || !user) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return <Outlet />;
}

export default ProtectedRoute;