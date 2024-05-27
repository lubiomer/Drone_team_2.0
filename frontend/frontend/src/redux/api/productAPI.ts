import { createApi } from '@reduxjs/toolkit/query/react';
import defaultFetchBase from './defaultFetchBase';
import { IProductResponse } from './types';

export const productAPI = createApi({
  reducerPath: 'productAPI',
  baseQuery: defaultFetchBase,
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    createProduct: builder.mutation<any, FormData>({
      query(product) {
        return {
          url: '/products',
          method: 'POST',
          credentials: 'include',
          body: product,
        };
      },
      invalidatesTags: [{ type: 'Products', id: 'LIST' }],
      transformResponse: (result: { data: { product: any } }) =>
        result.data.product,
    }),
    updateProduct: builder.mutation<any, { id: string; product: FormData }>(
      {
        query({ id, product }) {
          return {
            url: `/products/${id}`,
            method: 'PATCH',
            credentials: 'include',
            body: product,
          };
        },
        invalidatesTags: (result, _error, { id }) =>
          result
            ? [
                { type: 'Products', id },
                { type: 'Products', id: 'LIST' },
              ]
            : [{ type: 'Products', id: 'LIST' }],
        transformResponse: (response: { data: { post: any } }) =>
          response.data.post,
      }
    ),
    getProduct: builder.query<any, string>({
      query(id) {
        return {
          url: `/products/${id}`,
          credentials: 'include',
        };
      },
      providesTags: (_result, _error, id) => [{ type: 'Products', id }],
    }),
    getProducts: builder.query<any[], void>({
      query() {
        return {
          url: `/products`,
          credentials: 'include',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: 'Products' as const,
                id,
              })),
              { type: 'Products', id: 'LIST' },
            ]
          : [{ type: 'Products', id: 'LIST' }],
      transformResponse: (results: { products: IProductResponse[] } ) =>
        results.products,
    }),
    deleteProduct: builder.mutation<any, string>({
      query(id) {
        return {
          url: `/products/${id}`,
          method: 'Delete',
          credentials: 'include',
        };
      },
      invalidatesTags: [{ type: 'Products', id: 'LIST' }],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useGetProductsQuery,
} = productAPI;
