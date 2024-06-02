import { createApi } from '@reduxjs/toolkit/query/react';
import defaultFetchBase from './defaultFetchBase';
import { IUser } from './types';

export const userAPI = createApi({
  reducerPath: 'userAPI',
  baseQuery: defaultFetchBase,
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    createUser: builder.mutation<any, FormData>({
      query(user) {
        return {
          url: '/users',
          method: 'POST',
          credentials: 'include',
          body: user,
        };
      },
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
      transformResponse: (result: { data: { user: any } }) =>
        result.data.user,
    }),
    updateUser: builder.mutation<any, { id: string; user: FormData }>(
      {
        query({ id, user }) {
          return {
            url: `/users/${id}`,
            method: 'PATCH',
            credentials: 'include',
            body: user,
          };
        },
        invalidatesTags: (result, _error, { id }) =>
          result
            ? [
                { type: 'Users', id },
                { type: 'Users', id: 'LIST' },
              ]
            : [{ type: 'Users', id: 'LIST' }],
        transformResponse: (response: { data: { post: any } }) =>
          response.data.post,
      }
    ),
    getUser: builder.query<any, string>({
      query(id) {
        return {
          url: `/users/${id}`,
          credentials: 'include',
        };
      },
      providesTags: (_result, _error, id) => [{ type: 'Users', id }],
    }),
    getUsers: builder.query<any[], void>({
      query() {
        return {
          url: `/users`,
          credentials: 'include',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: 'Users' as const,
                id,
              })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
      transformResponse: (results: { users: IUser[] } ) =>
        results.users,
    }),
    deleteUser: builder.mutation<any, string>({
      query(id) {
        return {
          url: `/users/${id}`,
          method: 'Delete',
          credentials: 'include',
        };
      },
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUsersQuery,
} = userAPI;
