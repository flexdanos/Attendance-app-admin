"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaChurch, FaUser, FaLock, FaArrowRight, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAdminLoginMutation } from "@/redux/features/api/authApi";
import { setEncryptedToken, getDecryptedToken } from "@/utils/tokenStorage";

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: searchParams?.get('email') || "",
    password: "",
  });
  const [adminLogin, { isLoading }] = useAdminLoginMutation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authData = localStorage.getItem('authUser');
    const accessToken = getDecryptedToken('access');
    const refreshToken = getDecryptedToken('refresh');

    if (authData && accessToken && refreshToken) {
      router.replace('/dashboard');
      return;
    }

    localStorage.removeItem('pendingVerificationEmail');
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await adminLogin({
        email: formData.email,
        password: formData.password
      }).unwrap();

      const { access, refresh } = result;

      if (!access || !refresh) {
        throw new Error('Login succeeded but tokens are missing');
      }

      localStorage.clear();
      localStorage.setItem('authUser', JSON.stringify(result));
      setEncryptedToken('access', access);
      setEncryptedToken('refresh', refresh);

      toast.success('Admin login successful!');
      router.push('/dashboard');

    } catch (err: any) {
      console.error('Login failed:', err);
      const errorMessage = err?.data?.data || err?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="md:flex">
          {/* Left Side - Decorative */}
          <div className="hidden md:block md:w-1/2 bg-gradient-to-b from-burgundy-700 to-burgundy-900 p-8 text-white">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col items-center justify-center h-full"
            >
              <div className="mb-6 p-4 bg-white/10 rounded-full">
                <FaChurch className="text-4xl" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-center">Welcome Back</h2>
              <p className="text-white/80 text-center mb-8">Sign in to access your account and continue your spiritual journey with us.</p>
              <div className="w-16 h-1 bg-white/30 rounded-full mb-8"></div>
              <p className="text-sm text-white/80 text-center">Don't have an account?</p>
              <a
                href="/signup"
                className="mt-2 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors duration-300 flex items-center gap-2"
              >
                Sign Up <FaArrowRight className="text-xs" />
              </a>
            </motion.div>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 md:w-1/2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="flex items-center mb-2">
                <FaChurch className="text-burgundy-700 mr-2" />
                <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
              </div>
              <p className="text-gray-500 text-sm mb-8">Sign in to your account to continue</p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="relative"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition duration-200 text-gray-800 font-medium disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="relative"
                >
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <a href="/forgot-password" className="text-xs text-burgundy-600 hover:text-burgundy-800 hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition duration-200 text-gray-800 font-medium disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-burgundy-600 to-burgundy-800 text-white rounded-lg font-medium shadow-lg hover:from-burgundy-700 hover:to-burgundy-900 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:ring-offset-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="animate-spin text-sm" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In <FaArrowRight className="text-sm" />
                      </>
                    )}
                  </button>
                </motion.div>
              </form>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-6 text-center"
              >
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <a href="/signup" className="text-burgundy-700 font-medium hover:underline">
                    Create account
                  </a>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;
