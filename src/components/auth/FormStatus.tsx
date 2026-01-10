import { useEffect } from 'react';

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

interface FormStatusProps {
  status: Status;
  successMessage?: string | null;
  error?: string | null;
  onSuccess?: () => void;
}

export const FormStatus = ({ status, successMessage, error, onSuccess }: FormStatusProps) => {
  useEffect(() => {
    if (status === 'succeeded' && onSuccess) {
      onSuccess();
    }
  }, [status, onSuccess]);

  if (status === 'succeeded') {
    return (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong className="font-bold">Success! </strong>
        <span className="block sm:inline">{successMessage || 'Operation completed successfully!'}</span>
      </div>
    );
  }

  if (status === 'failed' && error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return null;
};
