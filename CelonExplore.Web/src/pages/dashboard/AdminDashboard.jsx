import React from "react";
import Sidebar from "../../components/layout/Sidebar";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-64 min-h-screen p-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Welcome back, {user?.email}
          </p>
        </div>

        {/* User Information */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Account Information
          </h2>

          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-medium">Email:</span>{" "}
              {user?.email}
            </p>

            <p className="text-gray-600">
              <span className="font-medium">Role:</span>{" "}
              {user?.role}
            </p>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">
              Attractions
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              0
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">
              Hotels
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              0
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">
              Restaurants
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              0
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">
              Users
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              0
            </h2>
          </div>

        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;