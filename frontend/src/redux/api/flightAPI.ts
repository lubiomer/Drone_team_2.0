import { createApi } from '@reduxjs/toolkit/query/react';
import defaultFetchBase from './defaultFetchBase';
import { GenericResponse, LastFlightRequest } from './types';

export const flightAPI = createApi({
  reducerPath: 'flightAPI',
  baseQuery: defaultFetchBase,
  tagTypes: ['Flights'],
  endpoints: (builder) => ({
    createFlight: builder.mutation<GenericResponse, LastFlightRequest>({
      query(data) {
        return {
          url: '/flight/create',
          method: 'POST',
          body: data,
        };
      },
    }),
  }),
});

export const {
  useCreateFlightMutation,
} = flightAPI;
