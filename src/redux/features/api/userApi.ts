import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getDecryptedToken } from '@/utils/tokenStorage';

export interface User {
  _id: string;
  username: string;
  email: string;
  full_name?: string;
  role?: string;
  profile_picture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  _id: string;
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  membership_status: string;
  group_affiliation?: string;
  roles?: string;
  date_of_birth: string;
  profile_picture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetUserResponse {
  user: User;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  full_name?: string;
  role?: string;
  profile_picture?: File | null;
}

export interface UpdateUserResponse {
  message: string;
  user: User;
}

export const userApi = createApi({
  reducerPath: 'userApi',
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
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUser: builder.query<GetUserResponse, void>({
      query: () => '/user/',
      providesTags: ['User'],
      transformErrorResponse: (response: any) => {
        console.error('Get user error:', response);
        return {
          status: response.status,
          data: response.data?.message || response.data || 'An error occurred while fetching user data',
        };
      },
    }),
    updateUser: builder.mutation<UpdateUserResponse, { id: string; userData: UpdateUserRequest }>({
      query: ({ id, userData }) => {
        // If profile_picture is a File, we need to use FormData
        if (userData.profile_picture instanceof File) {
          const formData = new FormData();
          Object.keys(userData).forEach(key => {
            if (key === 'profile_picture' && userData.profile_picture instanceof File) {
              formData.append(key, userData.profile_picture);
            } else if (userData[key as keyof UpdateUserRequest] !== undefined) {
              formData.append(key, String(userData[key as keyof UpdateUserRequest]));
            }
          });
          
          return {
            url: `/user/${id}/`,
            method: 'PUT',
            body: formData,
          };
        }
        
        return {
          url: `/user/${id}/`,
          method: 'PUT',
          body: userData,
        };
      },
      invalidatesTags: ['User'],
      transformErrorResponse: (response: any) => {
        console.error('Update user error:', response);
        return {
          status: response.status,
          data: response.data?.message || response.data || 'An error occurred while updating the user',
        };
      },
    }),
  }),
});

export const { useGetUserQuery, useUpdateUserMutation } = userApi;