import { baseApi } from "../api/baseApi";

const deleteTrialMatchQuestionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        deleteTrialMatchQuestion: builder.mutation({
            query: ({ id }) => ({
                url: `/trail-match-question-delete/${id}`, 
                method: 'DELETE',
                body: { _method: "DELETE" },
            }),
            invalidatesTags: ["Question"],
        }),
    }),
});

export const {useDeleteTrialMatchQuestionMutation} = deleteTrialMatchQuestionApi; // 
