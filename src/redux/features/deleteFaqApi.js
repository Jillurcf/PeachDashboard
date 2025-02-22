import { baseApi } from "../api/baseApi";

const deleteFaqApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        deleteFaq: builder.mutation({
            query: ({ id }) => ({
                url: `/admin/faqs/delete/${id}`, 
                method: 'DELETE',
                body: { _method: "DELETE" },
            }),
            invalidatesTags: ["Faqs"],
        }),
    }),
});

export const {useDeleteFaqMutation} = deleteFaqApi; // 
