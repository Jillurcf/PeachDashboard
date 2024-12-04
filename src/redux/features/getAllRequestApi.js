import { baseApi } from "../api/baseApi";


const getAllRequestApi = baseApi.injectEndpoints({
    endpoints:(builder) => ({
        getAllRequest:builder.query({
            query:() => `/request-match`,
            providesTags: ["Request"],
        })
    })
})

export const {useGetAllRequestQuery} = getAllRequestApi;