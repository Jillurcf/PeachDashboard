import { baseApi } from "../api/baseApi";

const getAllVolunteerApi = baseApi.injectEndpoints({
    endpoints:(builder)=>({
        getAllVolunteer:builder.query({
            query:()=>`/volunteers`,
            providesTags:["Volunteers"],
            extraOptions: { refetchOnMountOrArgChange: true },
        })
        
    })
})

export const {useGetAllVolunteerQuery} = getAllVolunteerApi;