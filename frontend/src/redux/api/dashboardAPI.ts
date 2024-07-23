import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = `${process.env.REACT_APP_SERVER_ENDPOINT}/api`;

export const dashboardAPI = createApi({
  reducerPath: 'dashboardAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl
  }),
  endpoints: (builder) => ({
    getDashboardProducts: builder.query<any, any>({
      query(args) {
        return {
          url: `/products/getDashboard`,
          params: { ...args },
          credentials: 'include',
        };
      },
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }: { id: string }) => ({
              type: 'Dashboard' as const,
              id,
            })),
            { type: 'Dashboard', id: 'LIST' },
          ]
          : [{ type: 'Dashboard', id: 'LIST' }],
      transformResponse: (results: any) =>
        results,
    }),
    
  }),
});

export const {
  useGetDashboardProductsQuery,
} = dashboardAPI;
