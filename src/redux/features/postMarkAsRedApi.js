import { baseApi } from "../api/baseApi";

  
const postMarkAsReadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    MarkAsRead: builder.mutation({
      query: (id) => ({
        url: `/notifications/mark-as-read?notification_id=${id}`,  // Ensure the correct route
        method: 'PUT',
        // body: data,
      }),
      invalidatesTags: ["Notifications"]
    }),
  }),
});


  export const {useMarkAsReadMutation} = postMarkAsReadApi;
