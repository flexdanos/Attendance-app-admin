"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaArrowLeft, FaUserPlus, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaBriefcase, FaImage, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import Link from "next/link";
import { AddMemberForm } from "@/app/dashboard/members/AddMemberForm";
import { MembersTable } from "@/app/dashboard/members/MembersTable";
import { useAddMemberMutation, useGetMembersQuery } from "@/redux/features/api/membersApi";
import { Member } from "@/redux/features/api/membersApi";
import { useGetUserQuery } from "@/redux/features/api/userApi";

const AddMemberPage = () => {
  const router = useRouter();
  const [addMember, { isLoading }] = useAddMemberMutation();
  const { data: membersData, isLoading: membersLoading, refetch } = useGetMembersQuery();
  const { data: userData, isLoading: userLoading } = useGetUserQuery();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'form' | 'table'>('form');

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
    membership_status: "",
    group_affiliation: "",
    roles: "",
    date_of_birth: "",
    profile_picture: null as {
      name: string;
      type: string;
      size: number;
      lastModified: number;
      base64?: string;
    } | null,
  });

  console.log(membersData, "zzzzzzzzzzzzz")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profile_picture: {
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified,
            base64: reader.result as string,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("full_name", formData.full_name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone_number", formData.phone_number);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("membership_status", formData.membership_status);
      formDataToSend.append("date_of_birth", formData.date_of_birth);

      if (formData.group_affiliation) {
        formDataToSend.append("group_affiliation", formData.group_affiliation);
      }

      if (formData.roles) {
        formDataToSend.append("roles", formData.roles);
      }

      if (formData.profile_picture?.base64) {
        const blob = await fetch(formData.profile_picture.base64).then((r) => r.blob());
        formDataToSend.append("profile_picture", blob, formData.profile_picture.name);
      }

      const result = await addMember(formDataToSend).unwrap();

      toast.success("Member added successfully!");
      setSuccessMessage("Member has been added successfully!");
      
      // Refetch members to update the table
      refetch();

      setFormData({
        full_name: "",
        email: "",
        phone_number: "",
        address: "",
        membership_status: "",
        group_affiliation: "",
        roles: "",
        date_of_birth: "",
        profile_picture: null,
      });

      // Switch to table view after successful addition
      setTimeout(() => {
        setActiveTab('table');
      }, 1500);

    } catch (err: any) {
      console.error("Add member failed:", err);
      const errorMessage = err?.data?.message || err?.data || "Failed to add member. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleViewMember = (member: Member) => {
    // TODO: Implement view member modal or navigate to member details page
    console.log('View member:', member);
    toast.info(`Viewing ${member.full_name}'s details`);
  };

  const handleEditMember = (member: Member) => {
    // TODO: Implement edit member functionality
    console.log('Edit member:', member);
    toast.info(`Editing ${member.full_name}'s information`);
  };

  const handleDeleteMember = (memberId: string) => {
    // TODO: Implement delete member functionality
    console.log('Delete member:', memberId);
    if (confirm('Are you sure you want to delete this member?')) {
      toast.info('Delete functionality coming soon');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-burgundy-50/30">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B1538' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">

              <div className="flex items-center gap-3">
                {/* Tab Navigation */}
                <div className="hidden sm:flex items-center bg-white/60 backdrop-blur-sm rounded-lg p-1 border border-white/20">
                  <button
                    onClick={() => setActiveTab('form')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === 'form'
                        ? 'bg-burgundy-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <FaUserPlus className="inline mr-2 w-4 h-4" />
                    Add Member
                  </button>
                  <button
                    onClick={() => setActiveTab('table')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === 'table'
                        ? 'bg-burgundy-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <FaUsers className="inline mr-2 w-4 h-4" />
                    All Members
                    {membersData?.members && (

                      <span className="ml-2 px-2 py-0.5 bg-burgundy-100 text-burgundy-700 rounded-full text-xs">
                        {membersData.members.length}

                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Mobile Tab Navigation */}
          <div className="sm:hidden mb-6">
            <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-lg p-1 border border-white/20">
              <button
                onClick={() => setActiveTab('form')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'form'
                    ? 'bg-burgundy-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <FaUserPlus className="inline mr-2 w-4 h-4" />
                Add Member
              </button>
              <button
                onClick={() => setActiveTab('table')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'table'
                    ? 'bg-burgundy-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <FaUsers className="inline mr-2 w-4 h-4" />
                All Members
              </button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {activeTab === 'form' ? (
              <>
                {/* Left Sidebar - Progress & Info */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Welcome Card */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-gradient-to-br from-burgundy-500 to-burgundy-700 rounded-xl text-white">
                        <FaUserPlus className="w-6 h-6" />
                      </div>
                      <div>
                        <h1 className="text-xl font-bold text-gray-900">Add New Member</h1>
                        <p className="text-sm text-gray-600">Registration Form</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Create a new member profile by filling in their personal information and church-related details. All required fields are marked with an asterisk (*).
                    </p>
                  </motion.div>

                  {/* Progress Steps */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Guide</h3>
                    <div className="space-y-3">
                      {[
                        { icon: FaUser, label: "Personal Info", desc: "Basic details" },
                        { icon: FaCalendarAlt, label: "Additional Info", desc: "Date of birth" },
                        { icon: FaUsers, label: "Church Details", desc: "Roles & groups" },
                        { icon: FaImage, label: "Profile Picture", desc: "Upload photo" },
                      ].map((step, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg transition-colors ${
                            index + 1 <= currentStep 
                              ? 'bg-burgundy-100 text-burgundy-600' 
                              : 'bg-gray-100 text-gray-400'
                          }`}>
                            <step.icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium text-sm ${
                              index + 1 <= currentStep ? 'text-gray-900' : 'text-gray-500'
                            }`}>{step.label}</p>
                            <p className="text-xs text-gray-500">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Stats Card */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-burgundy-600 to-burgundy-800 rounded-2xl shadow-xl p-6 text-white"
                  >
                    <h3 className="text-lg font-semibold mb-4">Registration Tips</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <FaCheckCircle className="w-4 h-4 mt-0.5 text-burgundy-200" />
                        <span className="text-burgundy-100">Use a clear profile photo</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FaCheckCircle className="w-4 h-4 mt-0.5 text-burgundy-200" />
                        <span className="text-burgundy-100">Double-check email accuracy</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FaCheckCircle className="w-4 h-4 mt-0.5 text-burgundy-200" />
                        <span className="text-burgundy-100">Include phone number for contact</span>
                      </li>
                    </ul>
                  </motion.div>
                </div>

                {/* Right Side - Form */}
                <div className="lg:col-span-2">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <AddMemberForm
                      formData={formData}
                      handleChange={handleChange}
                      handleFileChange={handleFileChange}
                      handleSubmit={handleSubmit}
                      isLoading={isLoading}
                      error={error}
                      successMessage={successMessage}
                    />
                  </motion.div>
                </div>
              </>
            ) : (
              /* Table View - Full Width */
              <div className="lg:col-span-3">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <MembersTable
                    members={membersData?.members || []}
                    isLoading={membersLoading}
                    onView={handleViewMember}
                    onEdit={handleEditMember}
                    onDelete={handleDeleteMember}
                  />
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AddMemberPage;
