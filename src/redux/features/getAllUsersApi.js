import { baseApi } from "../api/baseApi";

const getAllUsersApi = baseApi.injectEndpoints({
    endpoints:(builder)=>({
        getAllUsers:builder.query({
            query:()=>`/get-users`,
            providesTags:["Users"],
        })
    })
})

export const {useGetAllUsersQuery} = getAllUsersApi;