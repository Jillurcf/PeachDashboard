import { baseApi } from "../api/baseApi";

const getDashChartDatasApi = baseApi.injectEndpoints({
    endpoints:(builder)=>({
        chartDatas:builder.query({
            query:()=>`/dashboard-graph-data`,
            providesTags:["Users"],
        })
    })
})

export const {useChartDatasQuery} = getDashChartDatasApi;