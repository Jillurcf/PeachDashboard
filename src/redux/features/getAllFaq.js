import { baseApi } from "../api/baseApi";


const getAllFaqApi = baseApi.injectEndpoints({
    endpoints:(builder) => ({
        getAllFaq:builder.query({
            query:(page) => `/admin/faqs/?per_page=${page}`,
            providesTags: ["Faqs"],
        })
    })
})

export const {useGetAllFaqQuery} = getAllFaqApi;