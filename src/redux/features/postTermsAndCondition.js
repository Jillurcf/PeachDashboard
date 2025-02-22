import { baseApi } from "../api/baseApi";

const postTermsAndConditionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      postTermsAndCondition: builder.mutation({
        query: (data) => ({
          url: `/admin/terms-and-conditions/store`,
          method: 'POST',
          body: data,
         
        }),
        invalidatesTags: ["Settings"]
      }),
    }),
  });
  
  export const { usePostTermsAndConditionMutation} = postTermsAndConditionApi;
  