"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  FaChartLine, 
  FaUsers, 
  FaCalendarAlt, 
  FaDownload,
  FaFilter,
  FaFileExcel,
  FaFilePdf,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaUserCheck,
  FaUserTimes,
  FaCalendarCheck,
  FaCalendarTimes
} from "react-icons/fa";
import { AttendanceRecord, ReportData } from '@/types/attendance';
import { exportToExcel, exportToPDF } from '@/utils/exportUtils';

const ReportsPage = () => {
  const [user, setUser] = useState<any>(null);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedReport, setSelectedReport] = useState('overview');

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
    
    // Set default date range to last 30 days
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
    setDateRange({
      start: thirtyDaysAgo.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0]
    });
  }, []);

  const reportData: ReportData = useMemo(() => ({
    totalMembers: 1234,
    totalEvents: 24,
    averageAttendance: 1075,
    attendanceRate: 87.1,
    presentToday: 892,
    absentToday: 342,
    weeklyTrend: 5.2,
    monthlyTrend: -2.1
  }), []);

  const attendanceRecords: AttendanceRecord[] = useMemo(() => [
    { id: '1', memberName: 'John Doe', eventName: 'Sunday Service', date: '2025-01-07', status: 'present', checkInTime: '09:45 AM', group: 'Adults' },
    { id: '2', memberName: 'Jane Smith', eventName: 'Sunday Service', date: '2025-01-07', status: 'late', checkInTime: '10:15 AM', group: 'Adults' },
    { id: '3', memberName: 'Mike Johnson', eventName: 'Sunday Service', date: '2025-01-07', status: 'absent', group: 'Youth' },
    { id: '4', memberName: 'Sarah Williams', eventName: 'Bible Study', date: '2025-01-06', status: 'present', checkInTime: '06:00 PM', group: 'Adults' },
    { id: '5', memberName: 'David Brown', eventName: 'Bible Study', date: '2025-01-06', status: 'present', checkInTime: '05:55 PM', group: 'Adults' },
    { id: '6', memberName: 'Emily Davis', eventName: 'Youth Meeting', date: '2025-01-05', status: 'present', checkInTime: '04:45 PM', group: 'Youth' },
    { id: '7', memberName: 'Chris Wilson', eventName: 'Youth Meeting', date: '2025-01-05', status: 'absent', group: 'Youth' },
    { id: '8', memberName: 'Lisa Anderson', eventName: 'Sunday Service', date: '2025-01-07', status: 'present', checkInTime: '09:30 AM', group: 'Adults' },
  ], []);

  const statsCards = [
    {
      title: "Total Members",
      value: reportData.totalMembers.toLocaleString(),
      icon: FaUsers,
      color: "from-blue-500 to-blue-600",
      trend: reportData.weeklyTrend > 0 ? `+${reportData.weeklyTrend}%` : `${reportData.weeklyTrend}%`,
      trendUp: reportData.weeklyTrend > 0
    },
    {
      title: "Attendance Rate",
      value: `${reportData.attendanceRate}%`,
      icon: FaChartLine,
      color: "from-green-500 to-green-600",
      trend: reportData.monthlyTrend > 0 ? `+${reportData.monthlyTrend}%` : `${reportData.monthlyTrend}%`,
      trendUp: reportData.monthlyTrend > 0
    },
    {
      title: "Present Today",
      value: reportData.presentToday.toLocaleString(),
      icon: FaUserCheck,
      color: "from-purple-500 to-purple-600",
      trend: "+12%",
      trendUp: true
    },
    {
      title: "Absent Today",
      value: reportData.absentToday.toLocaleString(),
      icon: FaUserTimes,
      color: "from-red-500 to-red-600",
      trend: "-8%",
      trendUp: false
    }
  ];

  const handleExport = (format: 'excel' | 'pdf') => {
    const filename = `attendance-report-${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'excel') {
      exportToExcel(filteredRecords, filename);
    } else if (format === 'pdf') {
      exportToPDF(filteredRecords, filename);
    }
  };

  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter(record => {
      const matchesDate = !dateRange.start || !dateRange.end || 
        (record.date >= dateRange.start && record.date <= dateRange.end);
      const matchesGroup = selectedGroup === 'all' || record.group === selectedGroup;
      return matchesDate && matchesGroup;
    });
  }, [attendanceRecords, dateRange, selectedGroup]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
              Reports & Analytics
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Comprehensive attendance insights and trends
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => handleExport('excel')}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
            >
              <FaFileExcel />
              <span className="hidden sm:inline">Export Excel</span>
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
            >
              <FaFilePdf />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="text-burgundy-600" />
          <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group
            </label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
            >
              <option value="all">All Groups</option>
              <option value="Adults">Adults</option>
              <option value="Youth">Youth</option>
              <option value="Children">Children</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="text-lg sm:text-xl lg:text-2xl text-white" />
              </div>
              <div className="flex items-center gap-1">
                {stat.trendUp ? (
                  <FaArrowUp className="text-green-500 text-xs sm:text-sm" />
                ) : (
                  <FaArrowDown className="text-red-500 text-xs sm:text-sm" />
                )}
                <span className={`text-xs sm:text-sm font-semibold ${
                  stat.trendUp ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend}
                </span>
              </div>
            </div>
            <h3 className="text-gray-600 text-xs sm:text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Report Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden"
      >
        <div className="border-b border-gray-200">
          <div className="flex flex-wrap">
            {['overview', 'attendance', 'trends'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedReport(tab)}
                className={`px-4 sm:px-6 py-3 text-sm sm:text-base font-medium capitalize transition-colors ${
                  selectedReport === tab
                    ? 'text-burgundy-600 border-b-2 border-burgundy-600 bg-burgundy-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {selectedReport === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Overview</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3">Recent Events Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Sunday Service</span>
                      <span className="text-sm font-medium">892/1234 (72%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bible Study</span>
                      <span className="text-sm font-medium">156/200 (78%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Youth Meeting</span>
                      <span className="text-sm font-medium">89/120 (74%)</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3">Group Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Adults</span>
                      <span className="text-sm font-medium">85% attendance</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Youth</span>
                      <span className="text-sm font-medium">78% attendance</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Children</span>
                      <span className="text-sm font-medium">92% attendance</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'attendance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Records</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-4 py-3">Member Name</th>
                      <th className="px-4 py-3">Event</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Check-in Time</th>
                      <th className="px-4 py-3">Group</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((record) => (
                      <tr key={record.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {record.memberName}
                        </td>
                        <td className="px-4 py-3">{record.eventName}</td>
                        <td className="px-4 py-3">{record.date}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            record.status === 'present' 
                              ? 'bg-green-100 text-green-800'
                              : record.status === 'late'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">{record.checkInTime || '-'}</td>
                        <td className="px-4 py-3">{record.group}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedReport === 'trends' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Trends</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3">Weekly Comparison</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">This Week</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                        </div>
                        <span className="text-sm font-medium">87%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Week</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                        </div>
                        <span className="text-sm font-medium">82%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3">Monthly Comparison</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">This Month</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Month</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                        </div>
                        <span className="text-sm font-medium">87%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ReportsPage;
