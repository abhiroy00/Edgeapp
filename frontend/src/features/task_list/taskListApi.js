import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const taskListApi = createApi({
  reducerPath: "taskListApi",   // ← updated
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api",
  }),
  tagTypes: ["TaskList"],      // ← updated
  endpoints: (builder) => ({
    getTaskList: builder.query({     // ← renamed
      query: (args = {}) => {
        const { taskmaster, status, page = 1 } = args;
        let url = `/taskassignment/?page=${page}`;
        if (taskmaster) url += `&taskmaster=${taskmaster}`;
        if (status) url += `&status=${status}`;
        return url;
      },
      providesTags: ["TaskList"],
    }),

    generateSchedule: builder.mutation({
      query: ({ taskmasterId, regenerate = false }) => ({
        url: `/taskmaster/${taskmasterId}/generate_schedule/`,
        method: "POST",
        body: { regenerate },
      }),
      invalidatesTags: ["TaskList"],
    }),

    markTaskComplete: builder.mutation({
      query: ({ assignmentId, notes = "" }) => ({
        url: `/taskassignment/${assignmentId}/mark_complete/`,
        method: "POST",
        body: { notes },
      }),
      invalidatesTags: ["TaskList"],
    }),

    markTaskPending: builder.mutation({
      query: (assignmentId) => ({
        url: `/taskassignment/${assignmentId}/mark_pending/`,
        method: "POST",
      }),
      invalidatesTags: ["TaskList"],
    }),

    bulkMarkComplete: builder.mutation({
      query: (assignmentIds) => ({
        url: `/taskassignment/bulk_complete/`,
        method: "POST",
        body: { assignment_ids: assignmentIds },
      }),
      invalidatesTags: ["TaskList"],
    }),

    createAssignment: builder.mutation({
      query: (body) => ({
        url: "/taskassignment/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["TaskList"],
    }),

    updateAssignment: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/taskassignment/${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["TaskList"],
    }),

    deleteAssignment: builder.mutation({
      query: (id) => ({
        url: `/taskassignment/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["TaskList"],
    }),
  }),
});

export const {
  useGetTaskListQuery,
  useGenerateScheduleMutation,
  useMarkTaskCompleteMutation,
  useMarkTaskPendingMutation,
  useBulkMarkCompleteMutation,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
} = taskListApi;
