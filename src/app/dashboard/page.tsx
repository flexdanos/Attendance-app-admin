"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

import { 
  FaUsers, 
  FaCalendarAlt, 
  FaChartLine, 
  FaClipboardList,
  FaCheckCircle,
  FaCog
} from "react-icons/fa";
import Link from "next/link";

const DashboardPage = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const authData = localStorage.getItem('authUser');
    if (authData) {
      try {
        const parsedData = JSON.parse(authData);
        setUser(parsedData.user || parsedData);
      } catch (error) {
        console.error('Failed to parse auth data:', error);
      }
    }
  }, []);

  const stats = useMemo(() => [
    { 
      title: "Total Members", 
      value: "1,234", 
      icon: FaUsers, 
      color: "from-blue-500 to-blue-600",
      change: "+12%"
    },
    { 
      title: "Events This Month", 
      value: "24", 
      icon: FaCalendarAlt, 
      color: "from-green-500 to-green-600",
      change: "+8%"
    },
    { 
      title: "Attendance Rate", 
      value: "87%", 
      icon: FaChartLine, 
      color: "from-purple-500 to-purple-600",
      change: "+5%"
    },
    { 
      title: "Active Groups", 
      value: "18", 
      icon: FaClipboardList, 
      color: "from-orange-500 to-orange-600",
      change: "+3"
    },
  ], []);

  const recentActivities = useMemo(() => [
    { id: 1, action: "New member registered", user: "John Doe", time: "2 hours ago" },
    { id: 2, action: "Event created", user: "Jane Smith", time: "4 hours ago" },
    { id: 3, action: "Attendance marked", user: "Mike Johnson", time: "6 hours ago" },
    { id: 4, action: "Group updated", user: "Sarah Williams", time: "1 day ago" },
  ], []);

  const upcomingEvents = useMemo(() => [
    { id: 1, title: "Sunday Service", date: "Oct 15, 2025", time: "10:00 AM" },
    { id: 2, title: "Bible Study", date: "Oct 16, 2025", time: "6:00 PM" },
    { id: 3, title: "Youth Meeting", date: "Oct 18, 2025", time: "5:00 PM" },
  ], []);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 sm:mb-8"
      >
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
          Welcome back, {user?.fullName || user?.name}! 👋
        </h2>
        <p className="text-sm sm:text-base text-gray-600">Here's what's happening with your church today.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="text-lg sm:text-xl lg:text-2xl text-white" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-green-600">{stat.change}</span>
            </div>
            <h3 className="text-gray-600 text-xs sm:text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="xl:col-span-2 bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Recent Activities</h3>
            <Link href="/activities" className="text-xs sm:text-sm text-burgundy-600 hover:text-burgundy-700 font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-1.5 sm:p-2 bg-burgundy-100 rounded-full flex-shrink-0">
                  <FaCheckCircle className="text-burgundy-600 text-sm sm:text-base" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 font-medium text-sm sm:text-base truncate">{activity.action}</p>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">by {activity.user}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{activity.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Upcoming Events</h3>
            <FaCalendarAlt className="text-burgundy-600 text-sm sm:text-base" />
          </div>
          <div className="space-y-3 sm:space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-burgundy-300 transition-colors">
                <h4 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">{event.title}</h4>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <FaCalendarAlt className="text-xs" />
                  <span>{event.date}</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">{event.time}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 sm:mt-4 py-2 sm:py-2.5 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors font-medium text-sm sm:text-base">
            View All Events
          </button>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-6 sm:mt-8 bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6"
      >
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Link href="/dashboard/add-member" className="p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-burgundy-500 hover:bg-burgundy-50 transition-all group">
            <FaUsers className="text-2xl sm:text-3xl text-gray-400 group-hover:text-burgundy-600 mx-auto mb-1 sm:mb-2" />
            <p className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-burgundy-700">Add Member</p>
          </Link>
          <Link href="/dashboard/create-event" className="p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-burgundy-500 hover:bg-burgundy-50 transition-all group">
            <FaCalendarAlt className="text-2xl sm:text-3xl text-gray-400 group-hover:text-burgundy-600 mx-auto mb-1 sm:mb-2" />
            <p className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-burgundy-700">Create Event</p>
          </Link>
          <Link href="/dashboard/take-attendance" className="p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-burgundy-500 hover:bg-burgundy-50 transition-all group">
            <FaClipboardList className="text-2xl sm:text-3xl text-gray-400 group-hover:text-burgundy-600 mx-auto mb-1 sm:mb-2" />
            <p className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-burgundy-700">Take Attendance</p>
          </Link>
          <Link href="/dashboard/settings" className="p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-burgundy-500 hover:bg-burgundy-50 transition-all group">
            <FaCog className="text-2xl sm:text-3xl text-gray-400 group-hover:text-burgundy-600 mx-auto mb-1 sm:mb-2" />
            <p className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-burgundy-700">Settings</p>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;