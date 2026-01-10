"use client";

import { motion } from "framer-motion";
import { FaCog, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

const SettingsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-burgundy-600 hover:text-burgundy-700 font-medium mb-6 transition-colors"
        >
          <FaArrowLeft className="text-sm" />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-burgundy-100 rounded-lg">
              <FaCog className="text-2xl text-burgundy-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Settings
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Configure your application preferences
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-gray-500 text-center py-12">
              Settings page coming soon...
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
