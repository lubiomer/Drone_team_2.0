import { createApi } from '@reduxjs/toolkit/query/react';
import defaultFetchBase from './defaultFetchBase';

export const cartAPI = createApi({
  reducerPath: 'cartAPI',
  baseQuery: defaultFetchBase,
  tagTypes: ['Carts'],
  endpoints: (builder) => ({
    createCart: builder.mutation<any, any>({
      query(cart) {
        return {
          url: '/carts/create',
          method: 'POST',
          credentials: 'include',
          body: cart,
        };
      },
      invalidatesTags: [{ type: 'Carts', id: 'LIST' }],
      transformResponse: (result) =>
        result,
    }),

    getMyCarts: builder.query<any, any>({
      query() {
        return {
          url: `/carts/mycart`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: (result, error, id) => {
        return [{ type: 'Carts', id }];
      },
      transformResponse: (results: any) =>
        results,
    }),
    deleteCart: builder.mutation<any, string>({
      query(id) {
        return {
          url: `/carts/delete/${id}`,
          method: 'Delete',
          credentials: 'include',
        };
      },
      invalidatesTags: [{ type: 'Carts', id: 'LIST' }],
    }),
    checkoutCart: builder.mutation<any, any>({
        query(checkoutData) {
          return {
            url: '/carts/checkout',
            method: 'POST',
            credentials: 'include',
            body: checkoutData,
          };
        },
        invalidatesTags: [{ type: 'Carts', id: 'LIST' }],
        transformResponse: (result) =>
          result,
      }),
  }),
});

export const {
  useCreateCartMutation,
  useDeleteCartMutation,
  useGetMyCartsQuery,
  useCheckoutCartMutation,
} = cartAPI;
