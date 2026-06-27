import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HiViewGrid,
  HiFolder,
  HiCheckCircle,
  HiChartBar,
  HiClock,
  HiCog,
  HiLogout,
  HiOutlineChevronLeft,
} from 'react-icons/hi';

const menuItems = [
  { label: 'Dashboard', path: '/dashboard', icon: HiViewGrid },
  { label: 'Projects', path: '/projects', icon: HiFolder },
  { label: 'Tasks', path: '/tasks', icon: HiCheckCircle },
  { label: 'Analytics', path: '/analytics', icon: HiChartBar },
  { label: 'Activity', path: '/activity', icon: HiClock },
  { label: 'Settings', path: '/settings', icon: HiCog },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30 lg:h-full
          bg-white dark:bg-dark-card border-r border-border dark:border-dark-border
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${collapsed ? 'w-16' : 'w-sidebar'}
          flex flex-col overflow-hidden
        `}
      >
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-100 dark:bg-primary-900/20 text-[#0284C7] dark:text-[#38BDF8]'
                    : 'text-[#64748B] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                } ${collapsed ? 'justify-center px-0 py-3' : 'px-4 py-2.5'}`
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border dark:border-dark-border">
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center py-3 px-2' : 'px-4 py-3'} mb-1`}>
            <div className="w-8 h-8 rounded-full bg-[#38BDF8] flex items-center justify-center text-white text-xs font-semibold shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0F172A] dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-[#64748B] capitalize">{user?.role}</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <HiLogout className="w-5 h-5 shrink-0" />
              Logout
            </button>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`flex items-center w-full rounded-xl text-sm font-medium text-[#64748B] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${collapsed ? 'justify-center py-3' : 'gap-3 px-4 py-2.5'}`}
          >
            <HiOutlineChevronLeft className={`w-5 h-5 shrink-0 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
            {!collapsed && 'Collapse'}
          </button>
        </div>
      </aside>
    </>
  );
}
