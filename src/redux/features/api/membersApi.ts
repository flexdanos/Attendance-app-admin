import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getDecryptedToken } from '@/utils/tokenStorage';

export interface AddMemberRequest {
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  membership_status: string;
  group_affiliation?: string;
  roles?: string;
  date_of_birth: string;
  profile_picture?: File | null;
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

export interface AddMemberResponse {
  message: string;
  member: Member;
}

export const membersApi = createApi({
  reducerPath: 'membersApi',
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
  tagTypes: ['Members'],
  endpoints: (builder) => ({
    addMember: builder.mutation<AddMemberResponse, FormData>({
      query: (formData) => ({
        url: '/members/',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Members'],
      transformErrorResponse: (response: any) => {
        console.error('Add member error:', response);
        return {
          status: response.status,
          data: response.data?.message || response.data || 'An error occurred while adding the member',
        };
      },
    }),
    getMembers: builder.query<{ members: Member[] }, void>({
      query: () => '/members/',
      providesTags: ['Members'],
    }),
  }),
});

export const { useAddMemberMutation, useGetMembersQuery } = membersApi;
