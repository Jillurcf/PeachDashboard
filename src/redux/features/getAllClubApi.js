import { baseApi } from "../api/baseApi";

const getAllClubApi = baseApi.injectEndpoints({
    endpoints:(builder)=>({
        getAllClub:builder.query({
            query:()=>`/clubs`,
            providesTags:["Clubs"],
        })
    })
})

export const {useGetAllClubQuery} = getAllClubApi;