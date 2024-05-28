import { createApi } from '@reduxjs/toolkit/query/react';
import defaultFetchBase from './defaultFetchBase';
import { ProductImageResult, UploadProductImageRequest } from './types';

export const productAPI = createApi({
  reducerPath: 'productAPI',
  baseQuery: defaultFetchBase,
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    createProduct: builder.mutation<any, any>({
      query(product) {
        return {
          url: '/products/create',
          method: 'POST',
          credentials: 'include',
          body: product,
        };
      },
      invalidatesTags: [{ type: 'Products', id: 'LIST' }],
      transformResponse: (result) =>
        result,
    }),
    updateProduct: builder.mutation<any, any>(
      {
        query({ id, product }) {
          return {
            url: `/products/update/${id}`,
            method: 'PUT',
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
        transformResponse: (response) =>
          response,
      }
    ),
    getProduct: builder.query<any, any>({
      query(id) {
        return {
          url: `/products/getProduct/${id}`,
          credentials: 'include',
        };
      },
      providesTags: (_result, _error, id) => [{ type: 'Products', id }],
    }),
    getProducts: builder.query<any, any>({
      query(args) {
        return {
          url: `/products`,
          params: { ...args },
          credentials: 'include',
        };
      },
      providesTags: (result) =>
        result?.products
          ? [
            ...result.products.map(({ id } : { id: string }) => ({
              type: 'Products' as const,
              id,
            })),
            { type: 'Products', id: 'LIST' },
          ]
          : [{ type: 'Products', id: 'LIST' }],
      transformResponse: (results: any) =>
        results,
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
    uploadProductImg: builder.mutation<ProductImageResult, UploadProductImageRequest>({
      query: (uploadProductImageRequest) => {
        var formData = new FormData();
        formData.append('productImg', uploadProductImageRequest.productFile);
        return {
          url: '/products/upload/productImg',
          method: 'POST',
          credentials: 'include',
          body: formData
        };
      },
      invalidatesTags: [{ type: 'Products', id: 'LIST' }],
      transformResponse(result: ProductImageResult) {
        return result;
      },
    })
  }),
});

export const {
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useGetProductsQuery,
  useGetProductQuery,
  useUploadProductImgMutation,
} = productAPI;
