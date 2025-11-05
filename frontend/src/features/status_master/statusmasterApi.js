import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const statusmasterApi = createApi({
  reducerPath: "statusmasterApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000/api" }),

  tagTypes: ["StatusMaster"],

  endpoints: (builder) => ({
    // GET ALL
    getStatus: builder.query({
      query: () => "/statusmaster/",
      providesTags: ["StatusMaster"],
    }),

    // CREATE
    addStatus: builder.mutation({
      query: (body) => ({
        url: "/statusmaster/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["StatusMaster"],
    }),

    // UPDATE
    updateStatus: builder.mutation({
      query: ({ rid, ...body }) => ({
        url: `/statusmaster/${rid}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["StatusMaster"],
    }),

    // DELETE
    deleteStatus: builder.mutation({
      query: (rid) => ({
        url: `/statusmaster/${rid}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["StatusMaster"],
    }),
  }),
});

export const {
  useGetStatusQuery,
  useAddStatusMutation,
  useUpdateStatusMutation,
  useDeleteStatusMutation,
} = statusmasterApi;
