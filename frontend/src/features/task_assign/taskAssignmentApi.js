// taskAssignmentApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const taskAssignmentApi = createApi({
  reducerPath: "taskAssignmentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api",
  }),
  tagTypes: ["TaskAssignment"],
  endpoints: (builder) => ({
    // Get all assignments for a specific task master
    getTaskAssignments: builder.query({
      query: (args = {}) => {
        const { taskmaster, status, page = 1 } = args;
        let url = `/taskassignment/?page=${page}`;
        if (taskmaster) url += `&taskmaster=${taskmaster}`;
        if (status) url += `&status=${status}`;
        return url;
      },
      providesTags: ["TaskAssignment"],
    }),

    // Generate schedule for a task master
    generateSchedule: builder.mutation({
      query: ({ taskmasterId, regenerate = false }) => ({
        url: `/taskmaster/${taskmasterId}/generate_schedule/`,
        method: "POST",
        body: { regenerate },
      }),
      invalidatesTags: ["TaskAssignment"],
    }),

    // Mark single task as complete
    markTaskComplete: builder.mutation({
      query: ({ assignmentId, notes = "" }) => ({
        url: `/taskassignment/${assignmentId}/mark_complete/`,
        method: "POST",
        body: { notes },
      }),
      invalidatesTags: ["TaskAssignment"],
    }),

    // Mark single task as pending (undo)
    markTaskPending: builder.mutation({
      query: (assignmentId) => ({
        url: `/taskassignment/${assignmentId}/mark_pending/`,
        method: "POST",
      }),
      invalidatesTags: ["TaskAssignment"],
    }),

    // Bulk mark tasks as complete
    bulkMarkComplete: builder.mutation({
      query: (assignmentIds) => ({
        url: `/taskassignment/bulk_complete/`,
        method: "POST",
        body: { assignment_ids: assignmentIds },
      }),
      invalidatesTags: ["TaskAssignment"],
    }),

    // Create assignment manually
    createAssignment: builder.mutation({
      query: (body) => ({
        url: "/taskassignment/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["TaskAssignment"],
    }),

    // Update assignment
    updateAssignment: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/taskassignment/${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["TaskAssignment"],
    }),

    // Delete assignment
    deleteAssignment: builder.mutation({
      query: (id) => ({
        url: `/taskassignment/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["TaskAssignment"],
    }),
  }),
});

export const {
  useGetTaskAssignmentsQuery,
  useGenerateScheduleMutation,
  useMarkTaskCompleteMutation,
  useMarkTaskPendingMutation,
  useBulkMarkCompleteMutation,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
} = taskAssignmentApi;