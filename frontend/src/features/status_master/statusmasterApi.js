import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const statusmasterApi = createApi({
  reducerPath: "statusmasterApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api",
  }),

  tagTypes: ["StatusMaster"],

  endpoints: (builder) => ({
    // ✅ Get all status
    getStatus: builder.query({
      query: () => "/statusmaster/",
      providesTags: ["StatusMaster"],
    }),

    // ✅ Add Status
    addStatus: builder.mutation({
      query: (body) => ({
        url: "/statusmaster/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["StatusMaster"],
    }),

    // ✅ Update Status
    updateStatus: builder.mutation({
      query: ({ sid, ...body }) => ({
        url: `/statusmaster/${sid}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["StatusMaster"],
    }),

    // ✅ Delete Status
    deleteStatus: builder.mutation({
      query: (sid) => ({
        url: `/statusmaster/${sid}/`,
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
