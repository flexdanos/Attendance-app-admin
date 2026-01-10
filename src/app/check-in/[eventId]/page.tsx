"use client";

import { motion } from "framer-motion";
import { FaChurch, FaUserCheck, FaPhone, FaEnvelope, FaCheckCircle, FaExclamationTriangle, FaSpinner, FaCalendar, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
}

interface Member {
  _id: string;
  full_name: string;
  email: string;
  phone_number: string;
  membership_status: string;
  group_affiliation: string;
}

const CheckInPage = () => {
  const params = useParams();
  const eventId = params.id as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [identifier, setIdentifier] = useState('');
  const [identifierType, setIdentifierType] = useState<'phone' | 'email'>('phone');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState<'idle' | 'success' | 'error' | 'not_found'>('idle');
  const [foundMember, setFoundMember] = useState<Member | null>(null);
  const [error, setError] = useState('');

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

  // Dummy members data
  const members: Member[] = [
    {
      _id: '1',
      full_name: 'John Smith',
      email: 'john.smith@example.com',
      phone_number: '+1 (555) 123-4567',
      membership_status: 'member',
      group_affiliation: 'Choir'
    },
    {
      _id: '2',
      full_name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone_number: '+1 (555) 234-5678',
      membership_status: 'church worker',
      group_affiliation: 'Ushering Team'
    },
    {
      _id: '3',
      full_name: 'Michael Brown',
      email: 'michael.brown@example.com',
      phone_number: '+1 (555) 345-6789',
      membership_status: 'visitor',
      group_affiliation: ''
    },
    {
      _id: '4',
      full_name: 'Emily Davis',
      email: 'emily.davis@example.com',
      phone_number: '+1 (555) 456-7890',
      membership_status: 'member',
      group_affiliation: 'Worship Team'
    }
  ];

  useEffect(() => {
    // Find the event by ID
    const foundEvent = events.find(e => e.id === eventId);
    setEvent(foundEvent || null);
  }, [eventId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const normalizePhoneNumber = (phone: string) => {
    // Remove all non-digit characters
    return phone.replace(/\D/g, '');
  };

  const findMember = (identifier: string, type: 'phone' | 'email'): Member | null => {
    if (type === 'phone') {
      const normalizedPhone = normalizePhoneNumber(identifier);
      return members.find(member => 
        normalizePhoneNumber(member.phone_number).includes(normalizedPhone)
      ) || null;
    } else {
      return members.find(member => 
        member.email.toLowerCase() === identifier.toLowerCase()
      ) || null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!identifier.trim()) {
      setError('Please enter your phone number or email');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setCheckInStatus('idle');
    setFoundMember(null);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const member = findMember(identifier, identifierType);
      
      if (member) {
        setFoundMember(member);
        setCheckInStatus('success');
        
        // Simulate saving attendance record
        console.log('Attendance recorded:', {
          eventId,
          memberId: member._id,
          memberName: member.full_name,
          checkInTime: new Date().toISOString(),
          method: 'qr_code'
        });
      } else {
        setCheckInStatus('not_found');
        setError(`No member found with this ${identifierType === 'phone' ? 'phone number' : 'email address'}. Please check your information or contact church administration.`);
      }
    } catch (err) {
      setCheckInStatus('error');
      setError('An error occurred during check-in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIdentifier('');
    setCheckInStatus('idle');
    setFoundMember(null);
    setError('');
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-burgundy-50 to-burgundy-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <FaExclamationTriangle className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
          <p className="text-gray-600 mb-6">
            The event for this check-in doesn't exist or has been removed.
          </p>
          <p className="text-sm text-gray-500">
            Please contact church administration for assistance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-burgundy-50 to-burgundy-100">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-burgundy-600 rounded-full mb-4"
            >
              <FaChurch className="text-3xl text-white" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
              Event Check-in
            </h1>
            <p className="text-gray-600">
              Welcome! Please enter your information to mark your attendance.
            </p>
          </div>

          {/* Event Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">{event.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <FaCalendar className="w-4 h-4 text-burgundy-600" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaClock className="w-4 h-4 text-burgundy-600" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaMapMarkerAlt className="w-4 h-4 text-burgundy-600" />
                <span>{event.location}</span>
              </div>
            </div>
          </motion.div>

          {/* Check-in Form */}
          {checkInStatus === 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Identifier Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How would you like to identify yourself?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setIdentifierType('phone')}
                      className={`p-3 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
                        identifierType === 'phone'
                          ? 'border-burgundy-600 bg-burgundy-50 text-burgundy-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <FaPhone className="w-4 h-4" />
                      Phone Number
                    </button>
                    <button
                      type="button"
                      onClick={() => setIdentifierType('email')}
                      className={`p-3 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
                        identifierType === 'email'
                          ? 'border-burgundy-600 bg-burgundy-50 text-burgundy-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <FaEnvelope className="w-4 h-4" />
                      Email Address
                    </button>
                  </div>
                </div>

                {/* Identifier Input */}
                <div>
                  <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
                    {identifierType === 'phone' ? 'Phone Number' : 'Email Address'}
                  </label>
                  <div className="relative">
                    {identifierType === 'phone' ? (
                      <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    ) : (
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    )}
                    <input
                      type={identifierType === 'phone' ? 'tel' : 'email'}
                      id="identifier"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={identifierType === 'phone' ? 'Enter your phone number' : 'Enter your email address'}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 outline-none text-gray-700"
                      required
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-burgundy-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-burgundy-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      Checking in...
                    </>
                  ) : (
                    <>
                      <FaUserCheck className="w-4 h-4" />
                      Check In
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* Success State */}
          {checkInStatus === 'success' && foundMember && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4"
              >
                <FaCheckCircle className="text-4xl text-green-600" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome, {foundMember.full_name}!
              </h2>
              <p className="text-gray-600 mb-6">
                Your attendance has been successfully recorded for {event.title}.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-medium text-gray-800 mb-2">Check-in Details:</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Name:</strong> {foundMember.full_name}</p>
                  <p><strong>Email:</strong> {foundMember.email}</p>
                  <p><strong>Phone:</strong> {foundMember.phone_number}</p>
                  <p><strong>Membership:</strong> {foundMember.membership_status}</p>
                  {foundMember.group_affiliation && (
                    <p><strong>Group:</strong> {foundMember.group_affiliation}</p>
                  )}
                  <p><strong>Time:</strong> {new Date().toLocaleTimeString()}</p>
                </div>
              </div>

              <button
                onClick={resetForm}
                className="bg-burgundy-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-burgundy-700 transition-colors"
              >
                Check In Another Person
              </button>
            </motion.div>
          )}

          {/* Not Found State */}
          {checkInStatus === 'not_found' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-4"
              >
                <FaExclamationTriangle className="text-4xl text-yellow-600" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Member Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                We couldn't find a member with the provided {identifierType === 'phone' ? 'phone number' : 'email address'}.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={resetForm}
                  className="w-full bg-burgundy-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-burgundy-700 transition-colors"
                >
                  Try Again
                </button>
                <p className="text-sm text-gray-500">
                  If you believe this is an error, please contact church administration.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CheckInPage;
