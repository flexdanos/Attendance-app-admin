"use client";

import { motion } from "framer-motion";
import { FaCalendarPlus, FaArrowLeft, FaClock, FaMapMarkerAlt, FaUsers, FaTag } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";
import { useAddEventMutation } from "@/redux/features/api/eventsApi";
import { useRouter } from "next/navigation";

const CreateEventPage = () => {
  const router = useRouter();
  const [addEvent, { isLoading, error }] = useAddEventMutation();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    max_attendees: "",
    is_recurring: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Combine date and time into ISO string for start_time
      const startDateTime = new Date(`${formData.date}T${formData.time}`);
      const eventData = {
        title: formData.title,
        description: formData.description,
        start_time: startDateTime.toISOString(),
        location: formData.location,
        category: formData.category || "service",
        max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : undefined,
        is_recurring: formData.is_recurring
      };
      
      await addEvent(eventData).unwrap();
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        category: "",
        max_attendees: "",
        is_recurring: false
      });
      
      // Redirect to events page
      router.push("/dashboard/events");
    } catch (err) {
      console.error("Failed to create event:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/dashboard/events"
          className="inline-flex items-center gap-2 text-burgundy-600 hover:text-burgundy-700 font-medium mb-6 transition-colors"
        >
          <FaArrowLeft className="text-sm" />
          Back to Events
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-burgundy-100 rounded-lg">
              <FaCalendarPlus className="text-2xl text-burgundy-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Create Event
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Set up a new church event
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {'data' in error ? (error as any).data : "Failed to create event. Please try again."}
              </div>
            )}

            {/* Event Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors"
                placeholder="Enter event title"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors resize-none"
                placeholder="Describe the event..."
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  <FaClock className="inline mr-2" />
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                <FaMapMarkerAlt className="inline mr-2" />
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors"
                placeholder="Event location"
              />
            </div>

            {/* Category and Max Attendees */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  <FaTag className="inline mr-2" />
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors"
                >
                  <option value="">Select category</option>
                  <option value="service">Service</option>
                  <option value="bible-study">Bible Study</option>
                  <option value="prayer">Prayer Meeting</option>
                  <option value="fellowship">Fellowship</option>
                  <option value="outreach">Outreach</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="max_attendees" className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUsers className="inline mr-2" />
                  Max Attendees
                </label>
                <input
                  type="number"
                  id="max_attendees"
                  name="max_attendees"
                  value={formData.max_attendees}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors"
                  placeholder="Optional"
                />
              </div>
            </div>

            {/* Recurring Event */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="is_recurring"
                  name="is_recurring"
                  checked={formData.is_recurring}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-burgundy-600 focus:ring-burgundy-500 border-gray-300 rounded"
                />
                <label htmlFor="is_recurring" className="ml-2 block text-sm text-gray-700">
                  Is Recurring
                </label>
              </div>
            </div>

            {/* QR Code */}
            {/* <div>
              <label htmlFor="qr_code_base64" className="block text-sm font-medium text-gray-700 mb-2">
                QR Code (Auto-generated)
              </label>
              <div className="space-y-3">
                {formData.qr_code_base64 && (
                  <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                    <img 
                      src={`data:image/png;base64,${formData.qr_code_base64}`}
                      alt="Event QR Code"
                      className="w-32 h-32 object-contain"
                    />
                  </div>
                )}
                <textarea
                  id="qr_code_base64"
                  name="qr_code_base64"
                  value={formData.qr_code_base64}
                  onChange={handleInputChange}
                  rows={3}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors resize-none bg-gray-50"
                  placeholder="QR code will be automatically generated when you fill in event details"
                />
                <p className="text-sm text-gray-500">
                  QR code is automatically generated with event details (title, date, time, location)
                </p>
              </div>
            </div> */}

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-burgundy-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-burgundy-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating Event..." : "Create Event"}
              </button>
              <Link
                href="/dashboard"
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateEventPage;
