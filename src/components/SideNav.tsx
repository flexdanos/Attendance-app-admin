"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FaHome, 
  FaUserPlus, 
  FaCalendarPlus, 
  FaClipboardCheck, 
  FaCog,
  FaBars,
  FaTimes,
  FaChartLine,
  FaUsers,
  FaChurch,
  FaQrcode
} from "react-icons/fa";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: FaHome, description: "Overview" },
  { name: "Members", href: "/dashboard/add-member", icon: FaUsers, description: "Manage members" },
  { name: "Events", href: "/dashboard/events", icon: FaCalendarPlus, description: "Manage events" },
  { name: "Attendance", href: "/dashboard/take-attendance", icon: FaClipboardCheck, description: "Take attendance" },
  { name: "QR Records", href: "/dashboard/qr-attendance", icon: FaQrcode, description: "QR check-ins" },
  { name: "Reports", href: "/dashboard/reports", icon: FaChartLine, description: "View reports" },
  { name: "Settings", href: "/dashboard/settings", icon: FaCog, description: "System settings" },
];

export const SideNav = () => {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);
  const toggleCollapsed = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    localStorage.setItem('sidebarCollapsed', newCollapsedState.toString());
    window.dispatchEvent(new CustomEvent('sidebarChange', { detail: { collapsed: newCollapsedState } }));
  };

  // Initialize collapse state from localStorage
  useEffect(() => {
    const savedCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (savedCollapsed !== isCollapsed) {
      setIsCollapsed(savedCollapsed);
    }
  }, []);

  return (
    <>
      {/* Desktop Collapse Button */}
      <button
        onClick={toggleCollapsed}
        className="hidden lg:flex fixed top-36 left-64 z-30 p-2 bg-burgundy-600 text-white rounded-r-lg shadow-lg hover:bg-burgundy-700 transition-all duration-200 transform -translate-x-16 hover:-translate-x-20"
        style={{ left: isCollapsed ? '4rem' : '16rem' }}
        aria-label="Toggle sidebar"
      >
        <FaBars className={`text-sm transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} />
      </button>

      {/* Mobile Toggle Button */}
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed bottom-4 right-4 z-50 p-3 bg-burgundy-600 text-white rounded-full shadow-lg hover:bg-burgundy-700 transition-all duration-200 hover:scale-110"
        aria-label="Toggle navigation"
      >
        {isMobileOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:fixed top-16 left-0 h-screen
          bg-white border-r border-gray-200 shadow-xl
          transition-all duration-300 ease-in-out z-40
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-64
        `}
      >

        <nav className="h-full overflow-y-auto py-4 lg:py-6 px-3 lg:px-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                    group relative flex items-center gap-3 px-3 lg:px-4 py-3 rounded-xl
                    transition-all duration-200 font-medium
                    ${isActive
                      ? 'bg-burgundy-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-700 hover:bg-burgundy-50 hover:text-burgundy-700 hover:shadow-md'
                    }
                  `}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className={`text-lg flex-shrink-0 transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-burgundy-600 group-hover:text-burgundy-700'
                  }`} />
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium block truncate">{item.name}</span>
                      <span className="text-xs opacity-70 truncate block">{item.description}</span>
                    </div>
                  )}
                  {isActive && !isCollapsed && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Bottom Section */}
          <div className="mt-8 pt-4 border-t border-gray-100">
            <div className={`px-3 lg:px-4 ${isCollapsed ? 'text-center' : ''}`}>
              <div className={`text-xs text-gray-500 ${isCollapsed ? 'hidden' : 'block'}`}>
                Version 1.0.0
              </div>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};
