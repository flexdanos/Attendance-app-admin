import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaImage, FaCalendarAlt } from 'react-icons/fa';

interface FormInputProps {
  type: string;
  name: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  icon?: React.ReactNode;
  label: string;
  accept?: string;
  fileName?: string;
}

export const FormInput = ({
  type,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  icon,
  label,
  accept,
  fileName,
  onFileChange
}: FormInputProps) => {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        {type === 'file' ? (
          <div className="relative">
            <input
              type="file"
              name={name}
              placeholder={placeholder}
              onChange={onFileChange}
              accept={accept}
              required={required}
              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
            />
            <div className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
              <span className="text-gray-500 truncate">{fileName || placeholder}</span>
              <span className="ml-2 px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded">Choose File</span>
            </div>
          </div>
        ) : (
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition duration-200 text-gray-800 font-medium`}
          />
        )}
      </div>
    </div>
  );
};
