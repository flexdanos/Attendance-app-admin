"use client";

import { motion } from "framer-motion";
import { FaCalendarPlus, FaQrcode, FaEye, FaEdit, FaTrash, FaPlus, FaSearch, FaFilter } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description?: string;
  attendeeCount?: number;
}

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Dummy events data - same as take-attendance page
  const events: Event[] = [
    {
      id: '1',
      title: 'Sunday Service',
      date: '2024-01-07',
      time: '10:00 AM',
      location: 'Main Sanctuary',
      category: 'service',
      description: 'Weekly Sunday worship service',
      attendeeCount: 150
    },
    {
      id: '2',
      title: 'Bible Study',
      date: '2024-01-08',
      time: '7:00 PM',
      location: 'Fellowship Hall',
      category: 'bible-study',
      description: 'Weekly Bible study session',
      attendeeCount: 25
    },
    {
      id: '3',
      title: 'Prayer Meeting',
      date: '2024-01-09',
      time: '6:00 AM',
      location: 'Chapel',
      category: 'prayer',
      description: 'Early morning prayer meeting',
      attendeeCount: 30
    },
    {
      id: '4',
      title: 'Youth Fellowship',
      date: '2024-01-10',
      time: '5:00 PM',
      location: 'Youth Center',
      category: 'youth',
      description: 'Youth fellowship and activities',
      attendeeCount: 45
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'service', label: 'Service' },
    { value: 'bible-study', label: 'Bible Study' },
    { value: 'prayer', label: 'Prayer' },
    { value: 'youth', label: 'Youth' }
  ];

  // Filter events based on search and category
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'service':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'bible-study':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'prayer':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'youth':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <div className="p-3 bg-burgundy-100 rounded-lg">
              <FaCalendarPlus className="text-2xl text-burgundy-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Events
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Manage church events and generate QR codes
              </p>
            </div>
          </div>
          
          <Link
            href="/dashboard/create-event"
            className="inline-flex items-center gap-2 bg-burgundy-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-burgundy-700 transition-colors"
          >
            <FaPlus className="w-4 h-4" />
            Create New Event
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 outline-none text-gray-700"
            />
          </div>
          
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 outline-none text-gray-700 appearance-none"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FaCalendarPlus className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Events Found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Get started by creating your first event'
              }
            </p>
            <Link
              href="/dashboard/create-event"
              className="inline-flex items-center gap-2 bg-burgundy-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-burgundy-700 transition-colors"
            >
              <FaPlus className="w-4 h-4" />
              Create New Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: events.indexOf(event) * 0.1 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  {/* Event Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">
                        {event.title}
                      </h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(event.category)}`}>
                        {event.category.replace('-', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">Date:</span>
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">Time:</span>
                      {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">Location:</span>
                      {event.location}
                    </div>
                    {event.attendeeCount && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium mr-2">Attendees:</span>
                        {event.attendeeCount}
                      </div>
                    )}
                  </div>

                  {event.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/events/${event.id}`}
                      className="flex-1 bg-burgundy-600 text-white py-2 px-3 rounded-lg font-medium hover:bg-burgundy-700 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <FaQrcode className="w-3 h-3" />
                      View QR
                    </Link>
                    <button
                      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      title="Edit Event"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      title="Delete Event"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default EventsPage;
