"use client";

import { motion } from "framer-motion";
import { FaQrcode, FaSearch, FaCalendar, FaClock, FaUsers, FaFilter, FaDownload, FaUserCheck, FaExclamationTriangle } from "react-icons/fa";
import { useState, useEffect } from "react";

interface QRAttendanceRecord {
  id: string;
  eventId: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  membershipStatus: string;
  groupAffiliation: string;
  checkInTime: string;
  checkInMethod: 'qr_code';
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
}

const QRAttendancePage = () => {
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [qrAttendanceRecords, setQrAttendanceRecords] = useState<QRAttendanceRecord[]>([]);

  // Dummy events data
  const events: Event[] = [
    {
      id: '1',
      title: 'Sunday Service',
      date: '2024-01-07',
      time: '10:00 AM',
      location: 'Main Sanctuary',
      category: 'service'
    },
    {
      id: '2',
      title: 'Bible Study',
      date: '2024-01-08',
      time: '7:00 PM',
      location: 'Fellowship Hall',
      category: 'bible-study'
    },
    {
      id: '3',
      title: 'Prayer Meeting',
      date: '2024-01-09',
      time: '6:00 AM',
      location: 'Chapel',
      category: 'prayer'
    },
    {
      id: '4',
      title: 'Youth Fellowship',
      date: '2024-01-10',
      time: '5:00 PM',
      location: 'Youth Center',
      category: 'youth'
    }
  ];

  // Dummy QR attendance records - simulating members who checked in via QR code
  const dummyQRRecords: QRAttendanceRecord[] = [
    {
      id: '1',
      eventId: '1',
      memberId: '1',
      memberName: 'John Smith',
      memberEmail: 'john.smith@example.com',
      memberPhone: '+1 (555) 123-4567',
      membershipStatus: 'member',
      groupAffiliation: 'Choir',
      checkInTime: '2024-01-07T09:45:23Z',
      checkInMethod: 'qr_code'
    },
    {
      id: '2',
      eventId: '1',
      memberId: '2',
      memberName: 'Sarah Johnson',
      memberEmail: 'sarah.johnson@example.com',
      memberPhone: '+1 (555) 234-5678',
      membershipStatus: 'church worker',
      groupAffiliation: 'Ushering Team',
      checkInTime: '2024-01-07T09:52:15Z',
      checkInMethod: 'qr_code'
    },
    {
      id: '3',
      eventId: '1',
      memberId: '4',
      memberName: 'Emily Davis',
      memberEmail: 'emily.davis@example.com',
      memberPhone: '+1 (555) 456-7890',
      membershipStatus: 'member',
      groupAffiliation: 'Worship Team',
      checkInTime: '2024-01-07T10:03:45Z',
      checkInMethod: 'qr_code'
    },
    {
      id: '4',
      eventId: '2',
      memberId: '1',
      memberName: 'John Smith',
      memberEmail: 'john.smith@example.com',
      memberPhone: '+1 (555) 123-4567',
      membershipStatus: 'member',
      groupAffiliation: 'Choir',
      checkInTime: '2024-01-08T06:55:12Z',
      checkInMethod: 'qr_code'
    },
    {
      id: '5',
      eventId: '2',
      memberId: '3',
      memberName: 'Michael Brown',
      memberEmail: 'michael.brown@example.com',
      memberPhone: '+1 (555) 345-6789',
      membershipStatus: 'visitor',
      groupAffiliation: '',
      checkInTime: '2024-01-08T07:02:33Z',
      checkInMethod: 'qr_code'
    }
  ];

  useEffect(() => {
    if (selectedEvent) {
      // Filter QR attendance records for the selected event
      const filteredRecords = dummyQRRecords.filter(record => record.eventId === selectedEvent);
      setQrAttendanceRecords(filteredRecords);
    } else {
      setQrAttendanceRecords([]);
    }
  }, [selectedEvent]);

  // Filter records based on search and status
  const filteredRecords = qrAttendanceRecords.filter(record => {
    const matchesSearch = record.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.memberEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.memberPhone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || record.membershipStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'member':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'church worker':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'visitor':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAttendanceStats = () => {
    const total = filteredRecords.length;
    const members = filteredRecords.filter(r => r.membershipStatus === 'member').length;
    const churchWorkers = filteredRecords.filter(r => r.membershipStatus === 'church worker').length;
    const visitors = filteredRecords.filter(r => r.membershipStatus === 'visitor').length;
    
    return { total, members, churchWorkers, visitors };
  };

  const stats = getAttendanceStats();

  const handleExportCSV = () => {
    if (filteredRecords.length === 0) return;

    const headers = ['Name', 'Email', 'Phone', 'Status', 'Group', 'Check-in Time'];
    const csvContent = [
      headers.join(','),
      ...filteredRecords.map(record => [
        record.memberName,
        record.memberEmail,
        record.memberPhone,
        record.membershipStatus,
        record.groupAffiliation || 'N/A',
        formatTime(record.checkInTime)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const selectedEventName = events.find(e => e.id === selectedEvent)?.title || 'event';
    a.download = `${selectedEventName}-qr-attendance.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-burgundy-100 rounded-lg">
            <FaQrcode className="text-2xl text-burgundy-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              QR Attendance Records
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              View all members who checked in via QR code for events
            </p>
          </div>
        </div>

        {/* Event Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <label htmlFor="event" className="block text-sm font-medium text-gray-700 mb-2">
            <FaCalendar className="inline mr-2" />
            Select Event to View QR Check-ins *
          </label>
          <select
            id="event"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors text-gray-700"
          >
            <option value="">Choose an event...</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>
                {event.title} - {formatDate(event.date)} at {event.time} ({event.location})
              </option>
            ))}
          </select>
        </div>

        {selectedEvent && (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-burgundy-50 border border-burgundy-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-burgundy-600">{stats.total}</div>
                <div className="text-sm text-burgundy-700">Total QR Check-ins</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.members}</div>
                <div className="text-sm text-green-700">Members</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.churchWorkers}</div>
                <div className="text-sm text-blue-700">Church Workers</div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.visitors}</div>
                <div className="text-sm text-orange-700">Visitors</div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 outline-none text-gray-700"
                  />
                </div>
                
                <div className="relative">
                  <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 outline-none text-gray-700 appearance-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="member">Members</option>
                    <option value="church worker">Church Workers</option>
                    <option value="visitor">Visitors</option>
                  </select>
                </div>

                <button
                  onClick={handleExportCSV}
                  disabled={filteredRecords.length === 0}
                  className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaDownload className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>

            {/* QR Attendance Records */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <FaUserCheck className="text-burgundy-600" />
                  <h3 className="font-medium text-gray-800">
                    QR Check-in Records ({filteredRecords.length})
                  </h3>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                {filteredRecords.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    <FaQrcode className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      {searchTerm || filterStatus !== 'all' ? 'No Matching Records' : 'No QR Check-ins Yet'}
                    </h3>
                    <p className="text-gray-500">
                      {searchTerm || filterStatus !== 'all' 
                        ? 'Try adjusting your search or filter criteria' 
                        : 'Members have not checked in via QR code for this event yet'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredRecords.map((record, index) => (
                      <motion.div
                        key={record.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="p-6 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-burgundy-500 to-burgundy-700 flex items-center justify-center text-white font-semibold">
                              {record.memberName.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{record.memberName}</h4>
                              <p className="text-sm text-gray-600">{record.memberEmail}</p>
                              <p className="text-sm text-gray-500">{record.memberPhone}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.membershipStatus)}`}>
                              {record.membershipStatus.replace('_', ' ')}
                            </span>
                            {record.groupAffiliation && (
                              <p className="text-sm text-gray-500 mt-1">{record.groupAffiliation}</p>
                            )}
                            <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                              <FaClock className="w-3 h-3" />
                              <span>Checked in at {formatTime(record.checkInTime)}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {!selectedEvent && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FaQrcode className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Select an Event</h3>
            <p className="text-gray-500">
              Choose an event from the dropdown above to view QR check-in records
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default QRAttendancePage;
