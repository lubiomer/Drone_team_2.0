import { createApi } from '@reduxjs/toolkit/query/react';
import defaultFetchBase from './defaultFetchBase';

export const purchaseAPI = createApi({
  reducerPath: 'purchaseAPI',
  baseQuery: defaultFetchBase,
  tagTypes: ['Purchases'],
  endpoints: (builder) => ({
    getPurchases: builder.query<any, any>({
      query() {
        return {
          url: `/purchase`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: (result, error, id) => {
        return [{ type: 'Purchases', id }];
      },
      transformResponse: (results: any) =>
        results,
    }),
  }),
});

export const {
  useGetPurchasesQuery,
} = purchaseAPI;
