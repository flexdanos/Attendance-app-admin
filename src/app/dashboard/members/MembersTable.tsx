"use client";

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaFilter, FaEye, FaEdit, FaTrash, FaUsers, FaCalendar, FaEnvelope, FaPhone, FaMapMarkerAlt, FaChevronLeft, FaChevronRight, FaEllipsisV, FaUserTimes, FaUserCheck, FaDownload } from 'react-icons/fa';
import { Member } from '@/redux/features/api/userApi';
import { useGetUserQuery } from '@/redux/features/api/userApi';
import Image from 'next/image';
import { MemberDetailsModal } from './MemberDetailsModal';
import { EditMemberModal } from './EditMemberModal';

interface MembersTableProps {
  members: Member[];
  isLoading?: boolean;
  onEdit?: (member: Member) => void;
  onDelete?: (memberId: string) => void;
  onView?: (member: Member) => void;
}

export const MembersTable = ({ 
  members,
  isLoading = false,
  onEdit, 
  onDelete, 
  onView 
}: MembersTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Get current user data
  const { data: userData, isLoading: isUserLoading, error: userError } = useGetUserQuery();

  // Check if user has admin privileges
  const isAdmin = userData?.user?.role === 'admin' || userData?.user?.role === 'superadmin';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActionMenuOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, itemsPerPage]);

  // Use members data from props
  const displayMembers = members || [];

  // Filter members based on search and status
  const filteredMembers = displayMembers.filter((member: Member) => {
    const matchesSearch = member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.phone_number.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || member.membership_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage);

  // Handle user data loading and error states
  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading user data...</span>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-red-400 text-xl">⚠️</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading user data</h3>
            <div className="mt-2 text-sm text-red-700">
              {typeof userError === 'object' && 'data' in userError 
                ? userError.data as string 
                : 'Failed to load user information. Please try again.'}
            </div>
          </div>
        </div>
      </div>
    );
  }

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleAction = (action: string, member: Member) => {
    console.log('Action triggered:', action, member); // Debug log
    setActionMenuOpen(null);
    
    switch (action) {
      case 'view':
        console.log('Opening view modal for:', member.full_name); // Debug log
        setSelectedMember(member);
        setIsViewModalOpen(true);
        break;
      case 'edit':
        console.log('Opening edit modal for:', member.full_name); // Debug log
        setSelectedMember(member);
        setIsEditModalOpen(true);
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete ${member.full_name}? This action cannot be undone.`)) {
          onDelete?.(member._id);
        }
        break;
      case 'suspend':
        if (confirm(`Are you sure you want to suspend ${member.full_name}?`)) {
          // TODO: Implement suspend functionality
          console.log('Suspend member:', member);
        }
        break;
      case 'activate':
        if (confirm(`Are you sure you want to activate ${member.full_name}?`)) {
          // TODO: Implement activate functionality
          console.log('Activate member:', member);
        }
        break;
      case 'export':
        // TODO: Implement export functionality
        console.log('Export member:', member);
        break;
      default:
        break;
    }
  };

  const handleSaveMember = async (updatedMember: Partial<Member>) => {
    if (!selectedMember) return;
    
    try {
      // TODO: Implement actual API call to update member
      console.log('Updating member:', selectedMember._id, updatedMember);
      // For now, just call the onEdit callback
      onEdit?.({ ...selectedMember, ...updatedMember } as Member);
    } catch (error) {
      console.error('Error updating member:', error);
    }
  };

  // Handle loading states
  if (isUserLoading || isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600"></div>
        <span className="ml-2 text-gray-600">Loading data...</span>
      </div>
    );
  }

  // Handle error states
  if (userError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-red-400 text-xl">⚠️</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
            <div className="mt-2 text-sm text-red-700">
              Failed to load user information. Please try again.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle empty state when no members are loaded
  if (!isLoading && displayMembers.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden p-12">
        <div className="text-center">
          <FaUsers className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Members Found</h3>
          <p className="text-gray-500">
            No members exist in the system yet.
          </p>
        </div>
      </div>
    );
  }

  // User info section
  const UserInfoSection = () => {
    if (!userData?.user) return null;
    
    return (
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              {userData.user.profile_picture ? (
                <Image
                  src={userData.user.profile_picture}
                  alt={userData.user.full_name || userData.user.username}
                  width={48}
                  height={48}
                  className="rounded-full object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {(userData.user.full_name || userData.user.username).charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {userData.user.full_name || userData.user.username}
              </h3>
              <p className="text-sm text-gray-600">{userData.user.email}</p>
              {userData.user.role && (
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mt-1">
                  {userData.user.role}
                </span>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Logged in as: {userData.user.username}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden">
      {/* User Info Section */}
      <UserInfoSection />
      
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-burgundy-500 to-burgundy-700 rounded-xl text-white shadow-lg">
              <FaUsers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">All Members</h3>
              <p className="text-sm text-gray-600">{filteredMembers.length} total members</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-burgundy-500/20 focus:border-burgundy-500 outline-none text-sm text-gray-700"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-burgundy-500/20 focus:border-burgundy-500 outline-none text-sm appearance-none bg-white text-gray-700"
              >
                <option value="all">All Status</option>
                <option value="member">Member</option>
                <option value="visitor">Visitor</option>
                <option value="church worker">Church Worker</option>
              </select>
            </div>

            {/* Items per page */}
            <div className="relative">
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-burgundy-500/20 focus:border-burgundy-500 outline-none text-sm appearance-none bg-white text-gray-700"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedMembers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <FaUsers className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-lg font-medium">No members found</p>
                  <p className="text-sm">Try adjusting your search or filter criteria</p>
                </td>
              </tr>
            ) : (
              paginatedMembers.map((member: Member, index: number) => (
                <motion.tr
                  key={member._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {member.profile_picture ? (
                          <Image
                            src={member.profile_picture}
                            alt={member.full_name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-burgundy-500 to-burgundy-700 flex items-center justify-center text-white font-semibold text-sm">
                            {member.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{member.full_name}</p>
                        <p className="text-xs text-gray-500">ID: {member._id.slice(-8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaEnvelope className="w-3 h-3 text-gray-400" />
                        <span className="truncate max-w-[150px]">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaPhone className="w-3 h-3 text-gray-400" />
                        <span>{member.phone_number}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(member.membership_status)}`}>
                      {member.membership_status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {member.roles ? (
                        <span className="truncate max-w-[120px] block">{member.roles}</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaCalendar className="w-3 h-3 text-gray-400" />
                      <span>{formatDate(member.createdAt)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {/* Quick Actions */}
                      <button
                        onClick={() => handleAction('view', member)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View details"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleAction('edit', member)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit member"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                      )}
                      
                      {/* More Actions Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => setActionMenuOpen(actionMenuOpen === member._id ? null : member._id)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="More actions"
                        >
                          <FaEllipsisV className="w-4 h-4" />
                        </button>
                        
                        {actionMenuOpen === member._id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                          >
                            {/* Export - available to all authenticated users */}
                            <button
                              onClick={() => handleAction('export', member)}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                            >
                              <FaDownload className="w-4 h-4 text-blue-500" />
                              Export Data
                            </button>
                            
                            {/* Admin-only actions */}
                            {isAdmin && (
                              <>
                                <div className="border-t border-gray-100 my-1"></div>
                                <button
                                  onClick={() => handleAction('suspend', member)}
                                  className="w-full px-4 py-2 text-left text-sm text-yellow-600 hover:bg-yellow-50 flex items-center gap-2 transition-colors"
                                >
                                  <FaUserTimes className="w-4 h-4" />
                                  Suspend Member
                                </button>
                                <button
                                  onClick={() => handleAction('activate', member)}
                                  className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2 transition-colors"
                                >
                                  <FaUserCheck className="w-4 h-4" />
                                  Activate Member
                                </button>
                                <div className="border-t border-gray-100 my-1"></div>
                                <button
                                  onClick={() => handleAction('delete', member)}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                >
                                  <FaTrash className="w-4 h-4" />
                                  Delete Member
                                </button>
                              </>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredMembers.length)} of {filteredMembers.length} members
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Previous page"
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>
              
              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {(() => {
                  const pages = [];
                  const maxVisiblePages = 5;
                  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                  
                  if (endPage - startPage + 1 < maxVisiblePages) {
                    startPage = Math.max(1, endPage - maxVisiblePages + 1);
                  }
                  
                  if (startPage > 1) {
                    pages.push(
                      <button
                        key={1}
                        onClick={() => setCurrentPage(1)}
                        className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        1
                      </button>
                    );
                    if (startPage > 2) {
                      pages.push(<span key="start-ellipsis" className="px-2 text-gray-400">...</span>);
                    }
                  }
                  
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                          currentPage === i
                            ? 'bg-burgundy-600 text-white font-medium'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }
                  
                  if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                      pages.push(<span key="end-ellipsis" className="px-2 text-gray-400">...</span>);
                    }
                    pages.push(
                      <button
                        key={totalPages}
                        onClick={() => setCurrentPage(totalPages)}
                        className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        {totalPages}
                      </button>
                    );
                  }
                  
                  return pages;
                })()}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Next page"
              >
                <FaChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
