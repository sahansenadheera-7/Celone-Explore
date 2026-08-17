import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({
    children,
    allowedRoles,
}) => {
    const {
        user,
        isAuthenticated,
    } = useAuth();

    const location = useLocation();

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/"
                replace
                state={{
                    from: location.pathname,
                }}
            />
        );
    }

    if (
        allowedRoles &&
        !allowedRoles.includes(user?.role)
    ) {
        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        );
    }

    return children;
};

export default ProtectedRoute;