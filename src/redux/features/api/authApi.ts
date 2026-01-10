import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getDecryptedToken } from '@/utils/tokenStorage';


interface LoginRequest {
  email: string;
  password: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: (process.env.NEXT_PUBLIC_API_URL || 'https://church-ig2a.onrender.com').replace(/\/+$/, ''),
    prepareHeaders: (headers) => {
      const token = getDecryptedToken('access');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    adminLogin: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/admin-login/',
        method: 'POST',
        body: credentials,
      }),
      transformErrorResponse: (response: any) => {
        console.error('Admin login error:', response);
        return {
          status: response.status,
          data: response.data?.message || response.data || 'An error occurred during admin login',
        };
      },
    }),
  }),
});

export const { useAdminLoginMutation } = authApi;
