import { baseApi } from "../api/baseApi";

const getAllUsersApi = baseApi.injectEndpoints({
    endpoints:(builder)=>({
        getAllUsers:builder.query({
            query:(search)=>`/admin/users?search=${search}`,
            providesTags:["Users"],
        })
    })
})

export const {useGetAllUsersQuery} = getAllUsersApi;