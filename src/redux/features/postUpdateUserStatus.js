import { baseApi } from "../api/baseApi";

const putUpdateUserStatusApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        updateUserStatus: builder.mutation({
            query: ({ data, id }) => {
                console.log("Updating user status with data:", data);

                return {
                    url: `/admin/update-user-status/${id}`, 
                    method: 'POST',  // Changed to PUT if updating existing data
                    body: data,
                };
            },
            invalidatesTags: ["Users"], 
        }),
    }),
});



export const {useUpdateUserStatusMutation} = putUpdateUserStatusApi;
