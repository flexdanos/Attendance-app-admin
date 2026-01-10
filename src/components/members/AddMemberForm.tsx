import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaChevronDown, FaImage, FaCalendarAlt, FaUsers, FaBriefcase, FaUpload, FaTimes, FaCheckCircle, FaExclamationTriangle, FaUserPlus } from 'react-icons/fa';
import { FormInput } from '../auth/FormInput';
import Image from 'next/image';

interface AddMemberFormProps {
  formData: {
    full_name: string;
    email: string;
    phone_number: string;
    address: string;
    membership_status: string;
    group_affiliation: string;
    roles: string;
    date_of_birth: string;
    profile_picture: {
      name: string;
      type: string;
      size: number;
      lastModified: number;
      base64?: string;
    } | null;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error?: string | null;
  successMessage?: string | null;
}

export const AddMemberForm = ({
  formData,
  handleChange,
  handleFileChange,
  handleSubmit,
  isLoading,
  error,
  successMessage
}: AddMemberFormProps) => {

  const clearFile = () => {
    // We need to implement a way to clear the file in the parent or pass a clearer function
    // For now, we can simulate resetting the file input by calling handleFileChange with a null event if possible, 
    // but the props don't support it directly without changing the interface significantly.
    // Instead, we will simulate an empty event or just rely on the user selecting a new file.
    // Ideally, we should add a 'clearFile' prop. For now, let's keep it simple.
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8">

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50/80 backdrop-blur border border-red-200 text-red-700 rounded-xl flex items-center gap-3 shadow-sm"
        >
          <FaExclamationTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </motion.div>
      )}

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-50/80 backdrop-blur border border-green-200 text-green-700 rounded-xl flex items-center gap-3 shadow-sm"
        >
          <FaCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <p className="text-sm font-medium">{successMessage}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8" noValidate>

        {/* Section 1: Personal Information */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-burgundy-500 to-burgundy-700 rounded-xl text-white shadow-lg">
              <FaUser className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Personal Information</h3>
              <p className="text-sm text-gray-600">Basic member details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              name="full_name"
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={formData.full_name}
              onChange={handleChange}
              icon={<FaUser className="h-4 w-4 text-gray-400" />}
              required
            />

            <FormInput
              name="email"
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              icon={<FaEnvelope className="h-4 w-4 text-gray-400" />}
              required
            />

            <FormInput
              name="phone_number"
              label="Phone Number"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.phone_number}
              onChange={handleChange}
              icon={<FaPhone className="h-4 w-4 text-gray-400" />}
              required
            />

            <FormInput
              name="date_of_birth"
              label="Date of Birth"
              type="date"
              placeholder=""
              value={formData.date_of_birth}
              onChange={handleChange}
              icon={<FaCalendarAlt className="h-4 w-4 text-gray-400" />}
              required
            />

            <div className="md:col-span-2">
              <FormInput
                name="address"
                label="Address"
                type="text"
                placeholder="123 Church St, City, Country"
                value={formData.address}
                onChange={handleChange}
                icon={<FaMapMarkerAlt className="h-4 w-4 text-gray-400" />}
                required
              />
            </div>
          </div>
        </section>

        <div className="border-t border-gray-100" />

        {/* Section 2: Church Details */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-burgundy-500 to-burgundy-700 rounded-xl text-white shadow-lg">
              <FaBriefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Church Details</h3>
              <p className="text-sm text-gray-600">Roles and membership information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Custom Select for Membership Status */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Membership Status <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="membership_status"
                  value={formData.membership_status}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-burgundy-500/20 focus:border-burgundy-500 appearance-none text-gray-800 font-medium transition-all outline-none"
                  required
                >
                  <option value="" disabled className="text-gray-400">Select status</option>
                  <option value="member">Member</option>
                  <option value="visitor">Visitor</option>
                  <option value="church worker">Church Worker</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUsers className="h-4 w-4 text-gray-400" />
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FaChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            <FormInput
              name="group_affiliation"
              label="Group Affiliation"
              type="text"
              placeholder="e.g. Choir, Ushering"
              value={formData.group_affiliation}
              onChange={handleChange}
              icon={<FaUsers className="h-4 w-4 text-gray-400" />}
            />

            <div className="md:col-span-2">
              <FormInput
                name="roles"
                label="Church Roles"
                type="text"
                placeholder="e.g. Deacon, Sunday School Teacher"
                value={formData.roles}
                onChange={handleChange}
                icon={<FaBriefcase className="h-4 w-4 text-gray-400" />}
              />
            </div>

            {/* Enhanced File Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-burgundy-400 hover:bg-burgundy-50/30 transition-all cursor-pointer relative group">

                {formData.profile_picture?.base64 ? (
                  <div className="relative">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto">
                      <Image
                        src={formData.profile_picture.base64}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        // Hacky way to reset, user can just upload again for now or we add a reset handler later
                        const dt = new DataTransfer();
                        const event = { target: { files: dt.files } } as unknown as React.ChangeEvent<HTMLInputElement>;
                        handleFileChange(event);
                      }}
                    >
                      {/* Unfortunately we can't easily clear without the prop, so we'll just overlay the input */}
                    </button>
                    <p className="text-sm text-gray-500 text-center mt-2">{formData.profile_picture.name}</p>
                  </div>
                ) : (
                  <div className="space-y-1 text-center pointer-events-none">
                    <div className="mx-auto h-12 w-12 text-gray-400 group-hover:text-burgundy-500 transition-colors">
                      <FaImage className="w-full h-full" />
                    </div>
                    <div className="flex text-sm text-gray-600 justify-center">
                      <span className="relative cursor-pointer rounded-md font-medium text-burgundy-600 hover:text-burgundy-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-burgundy-500">
                        Upload a file
                      </span>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}

                <input
                  id="profile_picture"
                  name="profile_picture"
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
        </section>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="pt-6 border-t border-gray-100"
        >
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-burgundy-600 via-burgundy-700 to-burgundy-800 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-burgundy-500/30 hover:from-burgundy-700 hover:via-burgundy-800 hover:to-burgundy-900 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-burgundy-500/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing Registration...</span>
              </>
            ) : (
              <>
                <FaUserPlus className="w-5 h-5" />
                <span className="font-bold">Add Member</span>
                <FaChevronDown className="transform -rotate-90" />
              </>
            )}
          </button>
        </motion.div>
      </form>
    </div>
  );
};

