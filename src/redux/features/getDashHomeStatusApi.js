import { baseApi } from "../api/baseApi";

const getDashHomeStatusApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDashHomeStatusApi: builder.query({
            query: () => `/dashboard`,
        })
    })
})

export const {useGetDashHomeStatusApiQuery} = getDashHomeStatusApi;