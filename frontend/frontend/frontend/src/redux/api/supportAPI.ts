import { createApi } from '@reduxjs/toolkit/query/react';
import { ContactRequest, GenericResponse } from './types';
import defaultFetchBase from './defaultFetchBase';

export const supportAPI = createApi({
    reducerPath: 'supportAPI',
    baseQuery: defaultFetchBase,
    endpoints: (builder) => ({
        supportSend: builder.mutation<GenericResponse, ContactRequest>({
            query(data) {
                return {
                    url: '/support',
                    method: 'POST',
                    body: data,
                };
            },
        }),
    }),
});

export const {
    useSupportSendMutation,
} = supportAPI;
