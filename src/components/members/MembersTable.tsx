"use client";

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaFilter, FaEye, FaEdit, FaTrash, FaUsers, FaCalendar, FaEnvelope, FaPhone, FaMapMarkerAlt, FaChevronLeft, FaChevronRight, FaEllipsisV, FaUserTimes, FaUserCheck, FaDownload } from 'react-icons/fa';
import { Member } from '@/redux/features/api/membersApi';
import Image from 'next/image';
import { MemberDetailsModal } from './MemberDetailsModal';
import { EditMemberModal } from './EditMemberModal';

interface MembersTableProps {
  members: Member[];
  isLoading: boolean;
  onEdit?: (member: Member) => void;
  onDelete?: (memberId: string) => void;
  onView?: (member: Member) => void;
}

// Dummy data for demonstration
const dummyMembers: Member[] = [
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
  },
  {
    _id: '5',
    full_name: 'Robert Wilson',
    email: 'robert.wilson@example.com',
    phone_number: '+1 (555) 567-8901',
    address: '654 Trinity Lane, Manhattan, NY 10002',
    membership_status: 'member',
    group_affiliation: 'Men\'s Fellowship',
    roles: 'Treasurer, Bible Study Leader',
    date_of_birth: '1980-09-12',
    profile_picture: '',
    createdAt: '2023-12-28T11:30:00Z',
    updatedAt: '2023-12-28T11:30:00Z',
  },
  {
    _id: '6',
    full_name: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    phone_number: '+1 (555) 678-9012',
    address: '987 Peace Boulevard, Staten Island, NY 10301',
    membership_status: 'church worker',
    group_affiliation: 'Children\'s Ministry',
    roles: 'Sunday School Coordinator',
    date_of_birth: '1987-04-18',
    profile_picture: '',
    createdAt: '2023-12-15T13:20:00Z',
    updatedAt: '2023-12-15T13:20:00Z',
  },
  {
    _id: '7',
    full_name: 'David Martinez',
    email: 'david.martinez@example.com',
    phone_number: '+1 (555) 789-0123',
    address: '147 Redemption Way, New York, NY 10003',
    membership_status: 'visitor',
    group_affiliation: '',
    roles: '',
    date_of_birth: '1995-01-25',
    profile_picture: '',
    createdAt: '2024-01-22T10:00:00Z',
    updatedAt: '2024-01-22T10:00:00Z',
  },
  {
    _id: '8',
    full_name: 'Lisa Anderson',
    email: 'lisa.anderson@example.com',
    phone_number: '+1 (555) 890-1234',
    address: '258 Blessing Court, Brooklyn, NY 11202',
    membership_status: 'member',
    group_affiliation: 'Prayer Team',
    roles: 'Prayer Warrior, Counselor',
    date_of_birth: '1983-12-05',
    profile_picture: '',
    createdAt: '2023-11-30T15:10:00Z',
    updatedAt: '2023-11-30T15:10:00Z',
  },
];

export const MembersTable = ({ 
  members, 
  isLoading, 
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

  // Use dummy data if no real members are provided
  const displayMembers = members && members.length > 0 ? members : dummyMembers;

  // Filter members based on search and status
  const filteredMembers = displayMembers.filter(member => {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden">
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
              paginatedMembers.map((member, index) => (
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
                            {member.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
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
                      <button
                        onClick={() => handleAction('edit', member)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit member"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      
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
                            <button
                              onClick={() => handleAction('export', member)}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                            >
                              <FaDownload className="w-4 h-4 text-blue-500" />
                              Export Data
                            </button>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button
                              onClick={() => handleAction('delete', member)}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                            >
                              <FaTrash className="w-4 h-4" />
                              Delete Member
                            </button>
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
