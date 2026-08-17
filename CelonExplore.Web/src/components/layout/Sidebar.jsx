import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Compass,
  Building2,
  UtensilsCrossed,
  UserCheck,
  Users,
  MessageSquare,
  BarChart3,
  Bot,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    name: "Attractions",
    icon: Compass,
    path: "/admin/attractions",
  },
  {
    name: "Hotels",
    icon: Building2,
    path: "/admin/hotels",
  },
  {
    name: "Restaurants",
    icon: UtensilsCrossed,
    path: "/admin/restaurants",
  },
  {
    name: "Tour Guides",
    icon: UserCheck,
    path: "/admin/guides",
  },
  {
    name: "Users",
    icon: Users,
    path: "/admin/users",
  },
  {
    name: "Reviews",
    icon: MessageSquare,
    path: "/admin/reviews",
  },
  {
    name: "Analytics",
    icon: BarChart3,
    path: "/admin/analytics",
  },
  {
    name: "AI Agents",
    icon: Bot,
    path: "/admin/ai-agents",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/admin/settings",
  },
];

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-[#0d1821] text-gray-300 p-4 flex flex-col font-sans">
      
      {/* Brand */}
      <div className="flex items-center gap-2 px-3 py-4 mb-4">
        <div className="w-7 h-7 rounded-full border-2 border-[#168575] flex items-center justify-center text-[#168575] font-bold text-xs">
          C
        </div>

        <span className="text-xl font-bold text-[#168575] tracking-wide">
          CelonExplore
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-[#11685c] to-[#1a8b7c] text-white shadow-lg"
                    : "hover:bg-gray-800/50 hover:text-white text-gray-400"
                }`
              }
            >
              <Icon className="w-5 h-5 stroke-[1.75]" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
      >
        <LogOut className="w-5 h-5 stroke-[1.75]" />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;