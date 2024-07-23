import { createApi } from '@reduxjs/toolkit/query/react';
import defaultFetchBase from './defaultFetchBase';

export const commentAPI = createApi({
  reducerPath: 'commentAPI',
  baseQuery: defaultFetchBase,
  tagTypes: ['Comments'],
  endpoints: (builder) => ({
    createComment: builder.mutation<any, any>({
      query(comment) {
        return {
          url: '/comments/create',
          method: 'POST',
          credentials: 'include',
          body: comment,
        };
      },
      invalidatesTags: [{ type: 'Comments', id: 'LIST' }],
      transformResponse: (result) =>
        result,
    }),
    updateComment: builder.mutation<any, any>(
      {
        query({ id, comment }) {
          return {
            url: `/comments/update/${id}`,
            method: 'PUT',
            credentials: 'include',
            body: comment,
          };
        },
        invalidatesTags: (result, _error, { id }) =>
          result
            ? [
              { type: 'Comments', id },
              { type: 'Comments', id: 'LIST' },
            ]
            : [{ type: 'Comments', id: 'LIST' }],
        transformResponse: (response) =>
          response,
      }
    ),

    getComments: builder.query<any, any>({
      query(args) {
        return {
          url: `/comments`,
          params: { ...args },
          credentials: 'include',
        };
      },
      providesTags: (result) =>
        result?.comments
          ? [
            ...result.comments.map(({ id } : { id: string }) => ({
              type: 'Comments' as const,
              id,
            })),
            { type: 'Comments', id: 'LIST' },
          ]
          : [{ type: 'Comments', id: 'LIST' }],
      transformResponse: (results: any) =>
        results,
    }),
    
    deleteComment: builder.mutation<any, string>({
      query(id) {
        return {
          url: `/comments/delete/${id}`,
          method: 'Delete',
          credentials: 'include',
        };
      },
      invalidatesTags: [{ type: 'Comments', id: 'LIST' }],
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
  useGetCommentsQuery,
} = commentAPI;
