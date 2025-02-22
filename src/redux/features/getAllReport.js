import { baseApi } from "../api/baseApi";


const getAllReportApi = baseApi.injectEndpoints({
    endpoints:(builder) => ({
        getAllReport:builder.query({
            query:() => `/admin/get-reports`,
            providesTags: ["Faqs"],
        })
    })
})

export const {useGetAllReportQuery} = getAllReportApi;