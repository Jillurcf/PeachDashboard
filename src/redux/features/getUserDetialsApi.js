import { baseApi } from "../api/baseApi";

const getUserDetails = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUserDetails: builder.query({
            query: (id) => `/admin/user/${id}`,
            providesTags: ["User"],
        })
    })
});

export const { useGetUserDetailsQuery } = getUserDetails;
