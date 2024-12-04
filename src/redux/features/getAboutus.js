import { baseApi } from "../api/baseApi";

const getAboutusApi = baseApi.injectEndpoints({
    endpoints:(builder)=>({
        getAboutus:builder.query({
            query:()=>`/abouts`,
            providesTags:["Settings"],
        })
    })
})

export const {useGetAboutusQuery} =getAboutusApi;