import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getInitials } from '../../utils/helpers';
import {
  HiOutlineBell,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineMenu,
  HiOutlineLogout,
  HiOutlineUser,
} from 'react-icons/hi';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="h-navbar bg-white dark:bg-dark-card border-b border-border dark:border-dark-border flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <HiOutlineMenu className="w-6 h-6 text-[#1E293B] dark:text-white" />
        </button>
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="text-xl">🚀</span>
          <div className="hidden sm:block">
            <span className="font-bold text-base text-[#1E293B] dark:text-white">
              ProjectPilot
            </span>
            <span className="text-[10px] text-[#38BDF8] font-medium ml-1.5">
              Beta v1.0
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-[#64748B] dark:text-gray-300"
        >
          {darkMode ? (
            <HiOutlineSun className="w-5 h-5" />
          ) : (
            <HiOutlineMoon className="w-5 h-5" />
          )}
        </button>

        <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-[#64748B] dark:text-gray-300 relative">
          <HiOutlineBell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-[#38BDF8] flex items-center justify-center text-white font-semibold text-sm">
              {getInitials(user?.name)}
            </div>
            <span className="text-sm font-medium text-[#0F172A] dark:text-white hidden sm:block">
              {user?.name}
            </span>
          </button>

          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-card rounded-2xl shadow-lg border border-border dark:border-dark-border py-2 z-20">
                <div className="px-4 py-3 border-b border-border dark:border-dark-border">
                  <p className="text-sm font-medium text-[#0F172A] dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-xs text-[#64748B]">{user?.email}</p>
                </div>
                <Link
                  to="/settings"
                  onClick={() => setShowDropdown(false)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#64748B] hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <HiOutlineUser className="w-4 h-4" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <HiOutlineLogout className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
