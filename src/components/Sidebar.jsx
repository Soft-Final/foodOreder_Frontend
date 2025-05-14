import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Dashboard', path: '/', icon: HomeIcon },
  { name: 'Feedback', path: '/feedback', icon: ChatBubbleLeftRightIcon },
  { name: 'Menu', path: '/menu', icon: ClipboardDocumentListIcon },
];

const Sidebar = () => {
  const location = useLocation();

  const handleLogout = () => {
    // 🔒 Replace this with actual logout logic i hope this changes
    alert('Logging out...');
  };

  return (
    <aside className="w-64 min-h-screen bg-white shadow-md p-4 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Panel</h1>
        <nav className="space-y-2">
          {navItems.map(({ name, path, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {name}
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 flex items-center px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 font-medium transition-colors"
      >
        <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
