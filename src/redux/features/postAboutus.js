import { baseApi } from "../api/baseApi";

const postAboutusApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      postAboutus: builder.mutation({
        query: (data) => ({
          url: `/about-us`,
          method: 'POST',
          body: data,
         
        }),
        invalidatesTags: ["Settings"]
      }),
    }),
  });
  
  export const {usePostAboutusMutation} = postAboutusApi;
  