import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({

    baseUrl: "http://182.252.68.227:8008/api",
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");
      console.log("9 baseApi", token);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Users", "Volunteers", 'Feedback', "Portfolio", "Request", "Question", "faqs", "Settings", "Notifications"],
  endpoints: () => ({}),
});

