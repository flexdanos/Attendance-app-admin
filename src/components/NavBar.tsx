"use client";

import { useState, useEffect, useRef } from "react";
import { FaChurch, FaBell, FaUserCircle, FaSignOutAlt, FaBars, FaTimes, FaChevronDown, FaCog, FaQuestionCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface User {
  fullName?: string;
  name?: string;
  roles?: string[];
  role?: string;
}

interface NavBarProps {
  user: User | null;
  onLogout?: () => void;
}

export const NavBar = ({ user, onLogout }: NavBarProps) => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    if (isMobileMenuOpen || isUserMenuOpen || isNotificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen, isUserMenuOpen, isNotificationsOpen]);

  // Close dropdowns on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
        setIsNotificationsOpen(false);
      }
    };

    if (isMobileMenuOpen || isUserMenuOpen || isNotificationsOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMobileMenuOpen, isUserMenuOpen, isNotificationsOpen]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authUser');
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      sessionStorage.clear();
    }
    toast.success('Logged out successfully');

    // Close mobile menu
    setIsMobileMenuOpen(false);

    // Call custom logout handler if provided
    if (onLogout) {
      onLogout();
    } else {
      // Default behavior - redirect to login
      router.push('/login');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsUserMenuOpen(false);
    setIsNotificationsOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsUserMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-50 backdrop-blur-lg bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full py-2 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <FaChurch className="text-xl sm:text-2xl lg:text-3xl text-burgundy-700 animate-pulse" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <div>
              <h1 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold bg-gradient-to-r from-burgundy-700 to-burgundy-600 bg-clip-text text-transparent truncate">
                FlexiBene
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">Attendance Management</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={toggleNotifications}
                className="relative p-2 text-gray-600 hover:text-burgundy-700 transition-all duration-200 hover:bg-burgundy-50 rounded-lg"
                title="Notifications"
              >
                <FaBell className="text-lg lg:text-xl" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-ping"></span>
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">New member added</p>
                          <p className="text-xs text-gray-500">2 minutes ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">Event created successfully</p>
                          <p className="text-xs text-gray-500">1 hour ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border-t border-gray-100">
                    <button className="text-sm text-burgundy-600 hover:text-burgundy-700 font-medium">View all notifications</button>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={toggleUserMenu}
                className="flex items-center gap-2 lg:gap-3 p-2 hover:bg-burgundy-50 rounded-lg transition-all duration-200"
              >
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-medium text-gray-800 truncate max-w-32">
                    {user?.fullName || user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-32">
                    {user?.roles?.[0] || user?.role || 'User'}
                  </p>
                </div>
                <div className="relative">
                  <FaUserCircle className="text-2xl lg:text-3xl text-gray-400 hover:text-burgundy-600 transition-colors" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <FaChevronDown className={`text-xs text-gray-500 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800 truncate">{user?.fullName || user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.roles?.[0] || user?.role || 'User'}</p>
                  </div>
                  <div className="py-2">
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-burgundy-50 hover:text-burgundy-700 transition-colors flex items-center gap-3">
                      <FaCog className="text-gray-400" />
                      Settings
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-burgundy-50 hover:text-burgundy-700 transition-colors flex items-center gap-3">
                      <FaQuestionCircle className="text-gray-400" />
                      Help & Support
                    </button>
                  </div>
                  <div className="border-t border-gray-100 p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full px-3 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <FaSignOutAlt className="text-sm" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-1 sm:gap-2">
            <button
              onClick={toggleNotifications}
              className="relative p-1.5 sm:p-2 text-gray-600 hover:text-burgundy-700 hover:bg-burgundy-50 rounded-lg transition-all duration-200"
              title="Notifications"
            >
              <FaBell className="text-base sm:text-lg" />
              <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 sm:h-2 sm:w-2 bg-red-500 rounded-full animate-ping"></span>
              <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 sm:h-2 sm:w-2 bg-red-500 rounded-full"></span>
            </button>

            <button
              onClick={toggleMobileMenu}
              className="p-1.5 sm:p-2 text-gray-600 hover:text-burgundy-700 hover:bg-burgundy-50 rounded-lg transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FaTimes className="text-lg sm:text-xl" /> : <FaBars className="text-lg sm:text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          ref={mobileMenuRef}
          className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen
              ? 'max-h-96 opacity-100 mt-4 pb-4 border-t border-gray-200'
              : 'max-h-0 opacity-0 overflow-hidden'
            }`}
        >
          <div className="pt-4 space-y-3 sm:space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-burgundy-50 to-rose-50 rounded-lg border border-burgundy-100">
              <div className="relative">
                <FaUserCircle className="text-xl sm:text-2xl text-burgundy-600 flex-shrink-0" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {user?.fullName || user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.roles?.[0] || user?.role || 'User'}
                </p>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="space-y-2">
              <button className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-burgundy-50 hover:text-burgundy-700 transition-colors flex items-center gap-3 rounded-lg">
                <FaCog className="text-gray-400" />
                Settings
              </button>
              <button className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-burgundy-50 hover:text-burgundy-700 transition-colors flex items-center gap-3 rounded-lg">
                <FaQuestionCircle className="text-gray-400" />
                Help & Support
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
