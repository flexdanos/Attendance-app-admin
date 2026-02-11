import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getDecryptedToken } from '@/utils/tokenStorage';

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddEventRequest {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
}

export interface AddEventResponse {
  message: string;
  event: Event;
}

export interface GetEventsResponse {
  events: Event[];
}

export const eventsApi = createApi({
  reducerPath: 'eventsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: (process.env.NEXT_PUBLIC_API_URL || 'https://church-ig2a.onrender.com').replace(/\/+$/, ''),
    prepareHeaders: (headers) => {
      const token = getDecryptedToken('access');
      console.log('API URL:', (process.env.NEXT_PUBLIC_API_URL || 'https://church-ig2a.onrender.com').replace(/\/+$/, ''));
      console.log('Token:', token ? 'exists' : 'missing');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Events'],
  endpoints: (builder) => ({
    addEvent: builder.mutation<AddEventResponse, AddEventRequest>({
      query: (eventData) => ({
        url: '/events/',
        method: 'POST',
        body: eventData,
      }),
      invalidatesTags: ['Events'],
      transformErrorResponse: (response: any) => {
        console.error('Add event error:', response);
        return {
          status: response.status,
          data: response.data?.message || response.data || 'An error occurred while adding the event',
        };
      },
    }),
    getEvents: builder.query<GetEventsResponse, void>({
      query: () => '/events/',
      providesTags: ['Events'],
      transformErrorResponse: (response: any) => {
        console.error('Get events error:', response);
        return {
          status: response.status,
          data: response.data?.message || response.data || 'An error occurred while fetching events',
        };
      },
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        console.log('Get events query started');
        try {
          const result = await queryFulfilled;
          console.log('Get events query fulfilled:', result);
        } catch (error) {
          console.error('Get events query failed:', error);
        }
      },
    }),
    updateEvent: builder.mutation<AddEventResponse, { id: string; eventData: Partial<AddEventRequest> }>({
      query: ({ id, eventData }) => ({
        url: `/events/${id}/`,
        method: 'PUT',
        body: eventData,
      }),
      invalidatesTags: ['Events'],
      transformErrorResponse: (response: any) => {
        console.error('Update event error:', response);
        return {
          status: response.status,
          data: response.data?.message || response.data || 'An error occurred while updating the event',
        };
      },
    }),
    deleteEvent: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/events/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Events'],
      transformErrorResponse: (response: any) => {
        console.error('Delete event error:', response);
        return {
          status: response.status,
          data: response.data?.message || response.data || 'An error occurred while deleting the event',
        };
      },
    }),
  }),
});

export const { useAddEventMutation, useGetEventsQuery, useUpdateEventMutation, useDeleteEventMutation } = eventsApi;