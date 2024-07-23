import { createApi } from '@reduxjs/toolkit/query/react';
import defaultFetchBase from './defaultFetchBase';

export const statsAPI = createApi({
  reducerPath: 'statsAPI',
  baseQuery: defaultFetchBase,
  tagTypes: ['Stats'],
  endpoints: (builder) => ({
    getAdminDashboard: builder.query<any, any>({
      query(args) {
        return {
          url: `/dashboard`,
          params: { ...args },
          credentials: 'include',
        };
      },
      transformResponse: (results: any) =>
        results,
    }),
  }),
});

export const {
  useGetAdminDashboardQuery,
} = statsAPI;
