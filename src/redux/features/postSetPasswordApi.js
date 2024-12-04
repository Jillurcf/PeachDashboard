import { baseApi } from "../api/baseApi";

const postSetPasswordApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        postSetPassword: builder.mutation({
        query: (data) => {
            // console.log("aimannnnnnnnnnnnnnnnnn",data);
            return {
              url: `/update-password`,
              method: 'POST',
              body: data,
          } 
        },
        // invalidatesTags: ["TermsAndConditions"],
      }),
    }),
   
  });
  
  export const { usePostSetPasswordMutation } = postSetPasswordApi;