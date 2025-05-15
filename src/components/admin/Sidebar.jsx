import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  QrCodeIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import { logoutUser } from "../api/menuApi";

const navItems = [
  { name: "Dashboard", path: "/", icon: HomeIcon },
  { name: "Feedback", path: "/feedback-admin", icon: ChatBubbleLeftRightIcon },
  { name: "Menu", path: "/menu-management", icon: ClipboardDocumentListIcon },
  { name: "Manage QR", path: "/qr", icon: QrCodeIcon },
  { name: "Kitchen Orders", path: "/kitchen-orders", icon: ListBulletIcon },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if the API call fails, we still want to clear local storage and redirect
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-screen bg-white shadow-md p-4 flex flex-col justify-between transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Toggle Button */}
      <div className="flex justify-between items-center mb-6">
        {!collapsed && (
          <h1 className="text-2xl font-bold text-gray-800">Admin</h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-600 hover:text-gray-900"
        >
          {collapsed ? (
            <ChevronRightIcon className="w-6 h-6" />
          ) : (
            <ChevronLeftIcon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {navItems.map(({ name, path, icon: Icon }) => {
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
        {!collapsed && <span className="ml-3">{isLoggingOut ? "Logging out..." : "Logout"}</span>}
      </button>
    </aside>
  );
};

export default Sidebar;
