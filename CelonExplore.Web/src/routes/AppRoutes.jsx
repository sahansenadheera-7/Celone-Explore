import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import LandingPage
    from "../pages/home/LandingPage";

import AdminDashboard
    from "../pages/dashboard/AdminDashboard";

import HotelOwnerDashboard
    from "../pages/dashboard/HotelOwnerDashboard";

import RestaurantOwnerDashboard
    from "../pages/dashboard/RestaurantOwnerDashboard";

import UnauthorizedPage
    from "../pages/auth/UnauthorizedPage";

import AttractionsManagement
    from "../pages/attractions/AttractionsManagement";

import ProtectedRoute
    from "../components/common/ProtectedRoute";


function AppRoutes() {
    return (
        <BrowserRouter>

            <Routes>

                {/* PUBLIC */}
                <Route
                    path="/"
                    element={<LandingPage />}
                />


                {/* ADMIN DASHBOARD */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute
                            allowedRoles={["Admin"]}
                        >
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* ADMIN ATTRACTIONS */}
                <Route
                    path="/admin/attractions"
                    element={
                        <ProtectedRoute
                            allowedRoles={["Admin"]}
                        >
                            <AttractionsManagement />
                        </ProtectedRoute>
                    }
                />


                {/* HOTEL OWNER */}
                <Route
                    path="/hotel-owner/dashboard"
                    element={
                        <ProtectedRoute
                            allowedRoles={["HotelOwner"]}
                        >
                            <HotelOwnerDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* RESTAURANT OWNER */}
                <Route
                    path="/restaurant-owner/dashboard"
                    element={
                        <ProtectedRoute
                            allowedRoles={["RestaurantOwner"]}
                        >
                            <RestaurantOwnerDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* UNAUTHORIZED */}
                <Route
                    path="/unauthorized"
                    element={<UnauthorizedPage />}
                />


                {/* FALLBACK */}
                <Route
                    path="*"
                    element={<LandingPage />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default AppRoutes;