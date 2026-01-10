import { FaChurch } from 'react-icons/fa';
import Link from 'next/link';
import { motion } from 'framer-motion';

export const AuthSidebar = () => (
  <div className="hidden md:block md:w-1/3 bg-gradient-to-b from-burgundy-700 to-burgundy-900 p-8 text-white">
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full"
    >
      <div className="mb-6 p-4 bg-white/10 rounded-full">
        <FaChurch className="text-4xl" />
      </div>
      <h2 className="text-2xl font-bold mb-4 text-center">Welcome to Our Church Family</h2>
      <p className="text-blue-100 text-center mb-8">
        Join our community and stay connected with all church activities and events.
      </p>
      <div className="w-16 h-1 bg-white/30 rounded-full mb-8"></div>
      <p className="text-sm text-white/80 text-center">Already have an account?</p>
      <Link 
        href="/login" 
        className="mt-2 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors duration-300"
      >
        Sign In
      </Link>
    </motion.div>
  </div>
);
