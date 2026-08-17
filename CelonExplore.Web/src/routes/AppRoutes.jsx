import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import LandingPage from "../pages/home/LandingPage";

import AdminDashboard from "../pages/dashboard/AdminDashboard";
import HotelOwnerDashboard from "../pages/dashboard/HotelOwnerDashboard";
import RestaurantOwnerDashboard from "../pages/dashboard/RestaurantOwnerDashboard";

import UnauthorizedPage from "../pages/auth/UnauthorizedPage";

import ProtectedRoute from "../components/common/ProtectedRoute";

function AppRoutes() {
    return (
        <BrowserRouter>

            <Routes>

                {/* Public */}
                <Route
                    path="/"
                    element={<LandingPage />}
                />

                {/* Admin */}
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

                {/* Hotel Owner */}
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

                {/* Restaurant Owner */}
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

                {/* Unauthorized */}
                <Route
                    path="/unauthorized"
                    element={<UnauthorizedPage />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default AppRoutes;