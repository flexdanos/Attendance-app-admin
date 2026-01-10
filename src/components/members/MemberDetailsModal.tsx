"use client";

import { motion } from 'framer-motion';
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaBriefcase, FaImage, FaEdit } from 'react-icons/fa';
import { Member } from '@/redux/features/api/membersApi';
import Image from 'next/image';

interface MemberDetailsModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (member: Member) => void;
}

export const MemberDetailsModal = ({ member, isOpen, onClose, onEdit }: MemberDetailsModalProps) => {
  if (!isOpen || !member) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'member':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'visitor':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'church worker':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-800 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {member.profile_picture ? (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white/20">
                    <Image
                      src={member.profile_picture}
                      alt={member.full_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold border-4 border-white/20">
                    {member.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold">{member.full_name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(member.membership_status)}`}>
                      {member.membership_status}
                    </span>
                    <span className="text-white/80 text-sm">ID: {member._id.slice(-8)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FaUser className="text-burgundy-600" />
                  Personal Information
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <FaEnvelope className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900">{member.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FaPhone className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-gray-900">{member.phone_number}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FaCalendarAlt className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="text-gray-900">{formatDate(member.date_of_birth)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-gray-900">{member.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Church Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FaBriefcase className="text-burgundy-600" />
                  Church Information
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <FaUsers className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Group Affiliation</p>
                      <p className="text-gray-900">{member.group_affiliation || 'Not assigned'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FaBriefcase className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Church Roles</p>
                      <p className="text-gray-900">{member.roles || 'No roles assigned'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Membership Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-burgundy-600 rounded-full"></div>
                  <div>
                    <p className="text-sm text-gray-500">Joined</p>
                    <p className="text-gray-900">{formatDate(member.createdAt)}</p>
                  </div>
                </div>
                {member.updatedAt !== member.createdAt && (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="text-gray-900">{formatDate(member.updatedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Member since {formatDate(member.createdAt)}
              </p>
              <button
                onClick={() => {
                  onEdit(member);
                  onClose();
                }}
                className="px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors flex items-center gap-2"
              >
                <FaEdit className="w-4 h-4" />
                Edit Member
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
