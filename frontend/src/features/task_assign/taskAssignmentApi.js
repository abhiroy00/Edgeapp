import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const taskAssignmentApi = createApi({
  reducerPath: "taskAssignmentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Token ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Users", "TaskAssignments"],
  endpoints: (builder) => ({
    // Get all users
    getUsers: builder.query({
      query: () => "users",
      providesTags: ["Users"],
    }),

    // Generate schedule for a task master
    generateSchedule: builder.mutation({
      query: ({ taskmasterId, regenerate = false }) => ({
        url: `task-assignments/generate-schedule/`,
        method: "POST",
        body: {
          taskmaster: taskmasterId,
          regenerate: regenerate,
        },
      }),
      invalidatesTags: ["TaskAssignments"],
    }),

    // Assign tasks to users (bulk assignment)
    assignTasks: builder.mutation({
      query: (data) => ({
        url: "taskassignment/bulk_assign/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["TaskAssignments"],
    }),

    // Assign single task to user
    assignSingleTask: builder.mutation({
      query: ({ taskassignmentid, assigned_user }) => ({
        url: `task-assignments/${taskassignmentid}/`,
        method: "PATCH",
        body: { assigned_user },
      }),
      invalidatesTags: ["TaskAssignments"],
    }),

    // Update task assignment
    updateTaskAssignment: builder.mutation({
      query: ({ taskassignmentid, ...data }) => ({
        url: `task-assignments/${taskassignmentid}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["TaskAssignments"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGenerateScheduleMutation,
  useAssignTasksMutation,
  useAssignSingleTaskMutation,
  useUpdateTaskAssignmentMutation,
} = taskAssignmentApi;