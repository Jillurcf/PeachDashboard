import { baseApi } from "../api/baseApi";

  
const postAddFaqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addFaq: builder.mutation({
      query: (data) => ({
        url: `/admin/faqs/store`,  // Ensure the correct route
        method: 'POST',
        body: data,
      }),
    }),
  }),
});


  export const {useAddFaqMutation} = postAddFaqApi;
