import { baseApi } from "../api/baseApi";

const getDashboardApi = baseApi.injectEndpoints({
    endpoints:(builder)=>({
        getDashboard:builder.query({
            query:()=>`/admin/dashboard`,
            providesTags:["Users"],
        })
    })
})


export const {useGetDashboardQuery} = getDashboardApi;