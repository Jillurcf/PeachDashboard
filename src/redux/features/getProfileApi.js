import { baseApi } from "../api/baseApi";

const getProfileApi = baseApi.injectEndpoints({
    endpoints:(builder)=>({
        getProfile:builder.query({
            query:()=>`/user/get-user-info`,
            providesTags:["Users"],
        })
    })
})

export const {useGetProfileQuery} = getProfileApi;