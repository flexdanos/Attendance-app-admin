import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaChevronDown, FaImage, FaCalendarAlt } from 'react-icons/fa';
import { FormInput } from './FormInput';

interface SignUpFormProps {
  formData: {
    full_name: string;
    email: string;
    password1: string;
    password2: string;
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
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string | null;
  successMessage?: string | null;
}

export const SignUpForm = ({
  formData,
  handleChange,
  handleFileChange,
  handleSubmit,
  status,
  error,
  successMessage
}: SignUpFormProps) => {
  const inputFields = [
    {
      name: 'full_name',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter your full name',
      icon: <FaUser className="h-4 w-4 text-gray-400" />,
      required: true
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'Enter your email',
      icon: <FaEnvelope className="h-4 w-4 text-gray-400" />,
      required: true
    },
    {
      name: 'password1',
      label: 'Password',
      type: 'password',
      placeholder: 'Create a password',
      icon: <FaLock className="h-4 w-4 text-gray-400" />,
      required: true
    },
    {
      name: 'password2',
      label: 'Confirm Password',
      type: 'password',
      placeholder: 'Confirm your password',
      icon: <FaLock className="h-4 w-4 text-gray-400" />,
      required: true
    },
    {
      name: 'phone_number',
      label: 'Phone Number',
      type: 'tel',
      placeholder: 'Enter your phone number',
      icon: <FaPhone className="h-4 w-4 text-gray-400" />,
      required: true
    },
    {
      name: 'address',
      label: 'Address',
      type: 'text',
      placeholder: 'Enter your address',
      icon: <FaMapMarkerAlt className="h-4 w-4 text-gray-400" />,
      required: true
    },
    {
      name: 'membership_status',
      label: 'Membership Status',
      type: 'select',
      placeholder: 'Select your membership status',
      required: true
    },
    {
      name: 'group_affiliation',
      label: 'Group Affiliation',
      type: 'text',
      placeholder: 'E.g., Choir, Ushering, Bible Study',
      required: false
    },
    {
      name: 'roles',
      label: 'Church Roles',
      type: 'text',
      placeholder: 'E.g., Pastor, Sunday School Teacher',
      required: false
    },
    {
      name: 'profile_picture',
      label: 'Profile Picture',
      type: 'file',
      placeholder: '',
      icon: <FaImage className="h-4 w-4 text-gray-400" />,
      accept: 'image/*',
      required: false
    },
    {
      name: 'date_of_birth',
      label: 'Date of Birth',
      type: 'date',
      placeholder: '',
      icon: <FaCalendarAlt className="h-4 w-4 text-gray-400" />,
      required: true
    }
  ];

  return (
    <div className="p-8">
      <div className="flex items-center mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Create an Account</h1>
      </div>
      <p className="text-gray-500 text-sm mb-8">Please fill in your details to join our community</p>
      
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-4" noValidate>
        {inputFields.map((field, index) => {
          if (field.name === 'membership_status') {
            return (
              <motion.div
                key={field.name}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="relative"
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <div className="relative">
                  {/* <select
                    name={field.name}
                    value={formData.membership_status}
                    onChange={handleChange}
                    className="w-full pl-4 pr-10 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 appearance-none bg-white text-gray-800 font-medium transition-all duration-200 hover:border-gray-300"
                    required={field.required}
                  >
                    <option value="" disabled className="text-gray-400">
                      Select your membership status
                    </option>
                    <option value="member" className="py-2 hover:bg-blue-50">
                      Member
                    </option>
                    <option value="visitor" className="py-2 hover:bg-blue-50">
                      Visitor
                    </option>
                    <option value="church worker" className="py-2 hover:bg-blue-50">
                      Church Worker
                    </option>
                  </select> */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FaChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={field.name}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <FormInput
                key={field.name}
                type={field.type}
                name={field.name}
                value={field.name === 'profilePicture' ? '' : formData[field.name as keyof typeof formData] as string}
                onChange={field.name === 'profilePicture' ? undefined : handleChange}
                onFileChange={field.name === 'profile_picture' ? handleFileChange : undefined}
                fileName={field.name === 'profile_picture' ? formData.profile_picture?.name : undefined}
                placeholder={field.placeholder}
                required={field.required}
                icon={field.icon}
                label={field.label}
                accept={field.accept}
              />
            </motion.div>
          );
        })}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-6"
        >
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-3 bg-gradient-to-r from-burgundy-600 to-burgundy-800 text-white rounded-lg font-medium shadow-lg hover:from-burgundy-700 hover:to-burgundy-900 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:ring-offset-2 disabled:opacity-70"
          >
            {status === 'loading' ? 'Creating Account...' : 'Create Account'}
          </button>
        </motion.div>
      </form>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="text-center mt-6 text-sm text-gray-600"
      >
        Already have an account?{' '}
        <Link 
          href="/login" 
          className="text-burgundy-600 font-medium hover:text-burgundy-700 hover:underline transition-colors duration-200"
        >
          Sign in
        </Link>
      </motion.p>
    </div>
  );
};
