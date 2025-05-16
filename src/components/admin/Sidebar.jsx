// src/components/admin/Sidebar.jsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  QrCodeIcon,
  ListBulletIcon,
  ClipboardDocumentListIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { logoutUser } from "../api/menuApi";

const navItems = [
  { name: "Dashboard",      path: "/",                icon: HomeIcon },
  { name: "Feedback",       path: "/feedback-admin",  icon: ChatBubbleLeftRightIcon },
  { name: "Manage QR",      path: "/qr",              icon: QrCodeIcon },
  { name: "Kitchen Orders", path: "/kitchen-orders",  icon: ListBulletIcon },
  { name: "Menu",           path: "/menu-management", icon: ClipboardDocumentListIcon },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const userType = localStorage.getItem("user_type");
  const allowedPathsByRole = {
    ADMIN:   ["/", "/qr", "/feedback-admin"],
    KITCHEN: ["/qr", "/feedback-admin", "/kitchen-orders", "/menu-management"],
  };
  const allowedPaths = allowedPathsByRole[userType] || [];
  const filteredNav = navItems.filter(item => allowedPaths.includes(item.path));

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-screen bg-white shadow-md p-4 flex flex-col justify-between transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header / Toggle */}
      <div className="flex justify-between items-center mb-6">
        {!collapsed && <h1 className="text-2xl font-bold">Admin</h1>}
        <button onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? (
            <ChevronRightIcon className="w-6 h-6" />
          ) : (
            <ChevronLeftIcon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Links */}
      <nav className="flex-1 space-y-2">
        {filteredNav.map(({ name, path, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center px-3 py-2 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              }`}
            >
              <Icon className="w-6 h-6" />
              {!collapsed && <span className="ml-3">{name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className={`flex items-center px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 font-medium transition-colors ${
          isLoggingOut ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <ArrowRightOnRectangleIcon className="w-6 h-6" />
        {!collapsed && (
          <span className="ml-3">{isLoggingOut ? "Logging out..." : "Logout"}</span>
        )}
      </button>
    </aside>
  );
};

export default Sidebar;
