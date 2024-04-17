import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { GenericResponse, LoginUserRequest, RegisterUserRequest } from './types';
import { getMeAPI } from './getMeAPI';

const baseUrl = `${process.env.REACT_APP_SERVER_ENDPOINT}/api`;

export const authAPI = createApi({
  reducerPath: 'authAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation<GenericResponse, RegisterUserRequest>({
      query(data) {
        return {
          url: '/auth/register',
          method: 'POST',
          body: data,
        };
      },
    }),
    loginUser: builder.mutation<{ access_token: string; status: string }, LoginUserRequest>({
      query(data) {
        return {
          url: '/auth/login',
          method: 'POST',
          body: data,
          credentials: 'include',
        };
      },
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          await dispatch(getMeAPI.endpoints.getMe.initiate(null));
        } catch (error) {
          // Handle error
        }
      },
    }),
    logoutUser: builder.mutation<void, void>({
      query() {
        return {
          url: '/auth/logout',
          credentials: 'include',
        };
      },
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useLogoutUserMutation,
} = authAPI;
