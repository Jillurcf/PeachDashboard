import { baseApi } from "../api/baseApi";

const getReportDetails = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getReportDetails: builder.query({
            query: (id) => `/admin/report-details/${id}`,
            providesTags: ["User"],
        })
    })
});

export const { useGetReportDetailsQuery } = getReportDetails;
