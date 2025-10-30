import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const severityApi = createApi({
  reducerPath: "severityApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api",
  }),
  tagTypes: ["Severity"],
  endpoints: (builder) => ({
    getSeverities: builder.query({
      query: ({ page = 1, search = "" }) =>
        `/severities/?page=${page}&search=${search}`,
      providesTags: ["Severity"],
    }),

    createSeverity: builder.mutation({
      query: (body) => ({
        url: "/severities/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Severity"],
    }),

    updateSeverity: builder.mutation({
      query: ({ rid, ...body }) => ({
        url: `/severities/${rid}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Severity"],
    }),

    deleteSeverity: builder.mutation({
      query: (rid) => ({
        url: `/severities/${rid}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Severity"],
    }),
  }),
});

export const {
  useGetSeveritiesQuery,
  useCreateSeverityMutation,
  useUpdateSeverityMutation,
  useDeleteSeverityMutation,
} = severityApi;
