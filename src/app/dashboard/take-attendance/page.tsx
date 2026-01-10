"use client";

import { motion } from "framer-motion";
import { FaClipboardCheck, FaArrowLeft, FaSearch, FaCalendar, FaUsers, FaCheckCircle, FaTimesCircle, FaQuestionCircle, FaSave, FaQrcode } from "react-icons/fa";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Member } from "@/redux/features/api/membersApi";

interface AttendanceRecord {
  memberId: string;
  member: Member;
  status: 'present' | 'absent' | 'excused';
  notes?: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
}

const TakeAttendancePage = () => {
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
    }
  ];

  // Dummy members data
  const members: Member[] = [
    {
      _id: '1',
      full_name: 'John Smith',
      email: 'john.smith@example.com',
      phone_number: '+1 (555) 123-4567',
      address: '123 Church Street, New York, NY 10001',
      membership_status: 'member',
      group_affiliation: 'Choir',
      roles: 'Deacon, Sunday School Teacher',
      date_of_birth: '1985-06-15',
      profile_picture: '',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
    {
      _id: '2',
      full_name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone_number: '+1 (555) 234-5678',
      address: '456 Faith Avenue, Brooklyn, NY 11201',
      membership_status: 'church worker',
      group_affiliation: 'Ushering Team',
      roles: 'Head Usher, Youth Leader',
      date_of_birth: '1990-03-22',
      profile_picture: '',
      createdAt: '2024-01-10T14:20:00Z',
      updatedAt: '2024-01-10T14:20:00Z',
    },
    {
      _id: '3',
      full_name: 'Michael Brown',
      email: 'michael.brown@example.com',
      phone_number: '+1 (555) 345-6789',
      address: '789 Grace Road, Queens, NY 11101',
      membership_status: 'visitor',
      group_affiliation: '',
      roles: '',
      date_of_birth: '1988-11-08',
      profile_picture: '',
      createdAt: '2024-01-20T09:15:00Z',
      updatedAt: '2024-01-20T09:15:00Z',
    },
    {
      _id: '4',
      full_name: 'Emily Davis',
      email: 'emily.davis@example.com',
      phone_number: '+1 (555) 456-7890',
      address: '321 Hope Street, Bronx, NY 10451',
      membership_status: 'member',
      group_affiliation: 'Worship Team',
      roles: 'Lead Singer, Pianist',
      date_of_birth: '1992-07-30',
      profile_picture: '',
      createdAt: '2024-01-05T16:45:00Z',
      updatedAt: '2024-01-05T16:45:00Z',
    }
  ];

  // Initialize attendance records when event is selected
  useEffect(() => {
    if (selectedEvent && members.length > 0) {
      const initialRecords: AttendanceRecord[] = members.map(member => ({
        memberId: member._id,
        member,
        status: 'present' // Default to present
      }));
      setAttendanceRecords(initialRecords);
    }
  }, [selectedEvent]);

  // Filter members based on search
  const filteredMembers = members.filter(member =>
    member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter attendance records based on search
  const filteredAttendanceRecords = attendanceRecords.filter(record =>
    record.member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateAttendanceStatus = (memberId: string, status: 'present' | 'absent' | 'excused') => {
    setAttendanceRecords(prev =>
      prev.map(record =>
        record.memberId === memberId
          ? { ...record, status }
          : record
      )
    );
  };

  const updateAttendanceNotes = (memberId: string, notes: string) => {
    setAttendanceRecords(prev =>
      prev.map(record =>
        record.memberId === memberId
          ? { ...record, notes }
          : record
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) {
      alert('Please select an event');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Attendance submitted:', {
      eventId: selectedEvent,
      attendance: attendanceRecords
    });
    
    setIsSubmitting(false);
    setShowSuccessMessage(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const getStatusIcon = (status: 'present' | 'absent' | 'excused') => {
    switch (status) {
      case 'present':
        return <FaCheckCircle className="w-5 h-5 text-green-600" />;
      case 'absent':
        return <FaTimesCircle className="w-5 h-5 text-red-600" />;
      case 'excused':
        return <FaQuestionCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: 'present' | 'absent' | 'excused') => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'excused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getAttendanceStats = () => {
    const present = attendanceRecords.filter(r => r.status === 'present').length;
    const absent = attendanceRecords.filter(r => r.status === 'absent').length;
    const excused = attendanceRecords.filter(r => r.status === 'excused').length;
    const total = attendanceRecords.length;
    
    return { present, absent, excused, total };
  };

  const stats = getAttendanceStats();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-burgundy-100 rounded-lg">
              <FaClipboardCheck className="text-2xl text-burgundy-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Take Attendance
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Mark member attendance for events manually or view QR code check-ins
              </p>
            </div>
          </div>

          {/* QR Code Check-in Link */}
          <div className="bg-burgundy-50 border border-burgundy-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaQrcode className="text-2xl text-burgundy-600" />
                <div>
                  <h3 className="font-medium text-burgundy-800">QR Code Check-in</h3>
                  <p className="text-sm text-burgundy-700">
                    Members can also check in automatically by scanning QR codes
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/events"
                className="bg-burgundy-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-burgundy-700 transition-colors flex items-center gap-2"
              >
                <FaQrcode className="w-4 h-4" />
                Manage QR Codes
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Selection */}
            <div>
              <label htmlFor="event" className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendar className="inline mr-2" />
                Select Event *
              </label>
              <select
                id="event"
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors text-gray-700"
              >
                <option value="">Choose an event...</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>
                    {event.title} - {event.date} at {event.time} ({event.location})
                  </option>
                ))}
              </select>
            </div>

            {selectedEvent && (
              <>
                {/* Search Bar */}
                <div>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search members..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 outline-none text-gray-700"
                    />
                  </div>
                </div>

                {/* Attendance Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.present}</div>
                    <div className="text-sm text-green-700">Present</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
                    <div className="text-sm text-red-700">Absent</div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{stats.excused}</div>
                    <div className="text-sm text-yellow-700">Excused</div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-600">{stats.total}</div>
                    <div className="text-sm text-gray-700">Total</div>
                  </div>
                </div>

                {/* Attendance List */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="font-medium text-gray-800">Member Attendance</h3>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {filteredAttendanceRecords.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <FaUsers className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                        <p>No members found</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {filteredAttendanceRecords.map((record) => (
                          <motion.div
                            key={record.memberId}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-burgundy-500 to-burgundy-700 flex items-center justify-center text-white font-semibold text-sm">
                                  {record.member.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{record.member.full_name}</p>
                                  <p className="text-sm text-gray-500">{record.member.email}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {/* Status Buttons */}
                                <div className="flex gap-1">
                                  <button
                                    type="button"
                                    onClick={() => updateAttendanceStatus(record.memberId, 'present')}
                                    className={`p-2 rounded-lg transition-colors ${
                                      record.status === 'present'
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-500'
                                    }`}
                                    title="Mark as Present"
                                  >
                                    <FaCheckCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateAttendanceStatus(record.memberId, 'absent')}
                                    className={`p-2 rounded-lg transition-colors ${
                                      record.status === 'absent'
                                        ? 'bg-red-100 text-red-600'
                                        : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500'
                                    }`}
                                    title="Mark as Absent"
                                  >
                                    <FaTimesCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateAttendanceStatus(record.memberId, 'excused')}
                                    className={`p-2 rounded-lg transition-colors ${
                                      record.status === 'excused'
                                        ? 'bg-yellow-100 text-yellow-600'
                                        : 'bg-gray-100 text-gray-400 hover:bg-yellow-50 hover:text-yellow-500'
                                    }`}
                                    title="Mark as Excused"
                                  >
                                    <FaQuestionCircle className="w-4 h-4" />
                                  </button>
                                </div>
                                
                                {/* Status Badge */}
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                                  {record.status}
                                </span>
                              </div>
                            </div>
                            
                            {/* Notes Field */}
                            {record.status !== 'present' && (
                              <div className="mt-3">
                                <input
                                  type="text"
                                  placeholder="Add notes (optional)..."
                                  value={record.notes || ''}
                                  onChange={(e) => updateAttendanceNotes(record.memberId, e.target.value)}
                                  className="w-full px-3 py-1 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-burgundy-500 focus:border-burgundy-500 outline-none"
                                />
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting || attendanceRecords.length === 0}
                    className="flex-1 bg-burgundy-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-burgundy-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <FaSave className="w-4 h-4" />
                    {isSubmitting ? "Saving Attendance..." : "Save Attendance"}
                  </button>
                  <Link
                    href="/dashboard"
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors text-center"
                  >
                    Cancel
                  </Link>
                </div>
              </>
            )}
          </form>

          {/* Success Message */}
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-green-100 border border-green-200 rounded-lg text-green-800 text-center"
            >
              Attendance has been successfully saved!
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TakeAttendancePage;
