import { baseApi } from "../api/baseApi";

const putUpdateUserAvatarApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        updateUserAvatar: builder.mutation({
            query: ({ data }) => {
                console.log("Updating avatar:", data);

                return {
                    url: `/user/update-avatar`, 
                    method: 'POST',  // Changed to PUT if updating existing data
                    body: data,
                };
            },
            invalidatesTags: ["Users"], 
        }),
    }),
});



export const {useUpdateUserAvatarMutation} = putUpdateUserAvatarApi;
