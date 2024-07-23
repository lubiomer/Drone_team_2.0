import { createApi } from '@reduxjs/toolkit/query/react';
import defaultFetchBase from './defaultFetchBase';
import { ReviewImageResult, UploadReviewImageRequest } from './types';

export const reviewAPI = createApi({
  reducerPath: 'reviewAPI',
  baseQuery: defaultFetchBase,
  tagTypes: ['Reviews'],
  endpoints: (builder) => ({
    createReview: builder.mutation<any, any>({
      query(review) {
        return {
          url: '/reviews/create',
          method: 'POST',
          credentials: 'include',
          body: review,
        };
      },
      invalidatesTags: [{ type: 'Reviews', id: 'LIST' }],
      transformResponse: (result) =>
        result,
    }),
    updateReview: builder.mutation<any, any>(
      {
        query({ id, review }) {
          return {
            url: `/reviews/update/${id}`,
            method: 'PUT',
            credentials: 'include',
            body: review,
          };
        },
        invalidatesTags: (result, _error, { id }) =>
          result
            ? [
              { type: 'Reviews', id },
              { type: 'Reviews', id: 'LIST' },
            ]
            : [{ type: 'Reviews', id: 'LIST' }],
        transformResponse: (response) =>
          response,
      }
    ),
    getProductReview: builder.query<any, any>({
      query(id) {
        return {
          url: `/reviews/productReviews/${id}`,
          credentials: 'include',
        };
      },
      providesTags: (_result, _error, id) => [{ type: 'Reviews', id }],
    }),
    getMyReviews: builder.query<any, any>({
      query(args) {
        return {
          url: `/reviews/myReviews`,
          params: { ...args },
          credentials: 'include',
        };
      },
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id } : { id: string }) => ({
              type: 'Reviews' as const,
              id,
            })),
            { type: 'Reviews', id: 'LIST' },
          ]
          : [{ type: 'Reviews', id: 'LIST' }],
      transformResponse: (results: any) =>
        results,
    }),
    
    deleteReview: builder.mutation<any, string>({
      query(id) {
        return {
          url: `/reviews/delete/${id}`,
          method: 'Delete',
          credentials: 'include',
        };
      },
      invalidatesTags: [{ type: 'Reviews', id: 'LIST' }],
    }),
    uploadReviewImg: builder.mutation<ReviewImageResult, UploadReviewImageRequest>({
      query: (uploadReviewImageRequest) => {
        var formData = new FormData();
        formData.append('reviewImg', uploadReviewImageRequest.reviewFile);
        return {
          url: '/reviews/upload/reviewImg',
          method: 'POST',
          credentials: 'include',
          body: formData
        };
      },
      invalidatesTags: [{ type: 'Reviews', id: 'LIST' }],
      transformResponse(result: ReviewImageResult) {
        return result;
      },
    })
  }),
});

export const {
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useUpdateReviewMutation,
  useGetMyReviewsQuery,
  useGetProductReviewQuery,
  useUploadReviewImgMutation,
} = reviewAPI;
