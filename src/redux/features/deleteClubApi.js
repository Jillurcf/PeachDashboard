import { baseApi } from "../api/baseApi";

const deleteClubApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        deleteClub: builder.mutation({
            query: ({ id }) => ({
                url: `/club/${id}`, 
                method: 'DELETE',
                body: { _method: "DELETE" },
            }),
            invalidatesTags: ["Clubs"],
        }),
    }),
});

export const { useDeleteClubMutation } = deleteClubApi; // Corrected export
