import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const taskmasterApi = createApi({
  reducerPath: "taskmasterApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api",
  }),

  tagTypes: ["TaskMaster"],

  endpoints: (builder) => ({
    // Get All Tasks
    getTasks: builder.query({
      query: () => "/taskmaster/",
      providesTags: ["TaskMaster"],
    }),

    // Create Task
    createTask: builder.mutation({
      query: (body) => ({
        url: "/taskmaster/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["TaskMaster"],
    }),

    // Update Task
    updateTask: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/taskmaster/${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["TaskMaster"],
    }),

    // Delete Task
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/taskmaster/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["TaskMaster"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskmasterApi;
