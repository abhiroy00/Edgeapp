import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const schedulecreationApi = createApi({
  reducerPath: "schedulecreationApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000/api/" }),
  tagTypes: ["Schedule"],

  endpoints: (builder) => ({
    getSchedules: builder.query({
      query: ({ page = 1, page_size = 10 }) =>
        `schedule/?page=${page}&page_size=${page_size}`,
      providesTags: ["Schedule"],
    }),

    createSchedule: builder.mutation({
      query: (body) => ({
        url: "schedule/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Schedule"],
    }),

    updateSchedule: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `schedule/${id}/`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["Schedule"],
    }),

    deleteSchedule: builder.mutation({
      query: (id) => ({
        url: `schedule/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Schedule"],
    }),

    // ✅ Fetch Dropdown Data
    getTasks: builder.query({
      query: () => "taskmaster/",
    }),
    getTypes: builder.query({
      query: () => "typemaster/",
    }),
    getStatus: builder.query({
      query: () => "statusmaster/",
    }),
    getUsers: builder.query({
      query: () => "usermaster/",
    }),
  }),
});

export const {
  useGetSchedulesQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
  useGetTasksQuery,
  useGetTypesQuery,
  useGetStatusQuery,
  useGetUsersQuery,
} = schedulecreationApi;
