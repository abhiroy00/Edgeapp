import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/* =======================================================
   Helpers
======================================================= */

// Build query string dynamically using an allowlist
const buildQueryParams = (params = {}, allowedKeys = []) => {
  const queryParams = new URLSearchParams();

  allowedKeys.forEach((key) => {
    const value = params[key];

    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });

  return queryParams.toString();
};

// Normalize any response into:  { results: [...] }
const normalizeResponse = (res) => {
  if (!res) return { results: [] };

  if (res?.results) return res;

  if (Array.isArray(res)) return { results: res };

  if (res?.data) return { results: res.data };

  return { results: [] };
};

/* =======================================================
   Main API
======================================================= */

export const taskCompletionApi = createApi({
  reducerPath: 'taskCompletionApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:8000/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),

  tagTypes: ['TaskCompletion'],

  endpoints: (builder) => ({

    /* =======================================================
       GET ALL COMPLETED TASKS
       FIXED: Removed completed_date from allowed keys
       Frontend will handle date filtering
    ======================================================= */
    getCompletedTasks: builder.query({
      query: (params = {}) => {
        const allowedKeys = [
          'taskmaster',
          // 'completed_date', // REMOVED - Filter on frontend instead
          'task_assignment_id',
          'assigned_user',
          'is_successful',
          'task_number',
          'asset_id',
          'page',
          'page_size',
          'ordering',
        ];

        const queryString = buildQueryParams(params, allowedKeys);

        return {
          url: `task-completions/${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },

      transformResponse: normalizeResponse,

      providesTags: (result) =>
        result?.results?.length
          ? [
              ...result.results.map(({ id }) => ({
                type: 'TaskCompletion',
                id,
              })),
              { type: 'TaskCompletion', id: 'LIST' },
            ]
          : [{ type: 'TaskCompletion', id: 'LIST' }],
    }),

    /* =======================================================
       GET SINGLE COMPLETED TASK
    ======================================================= */
    getCompletedTaskById: builder.query({
      query: (id) => `task-completions/${id}/`,

      transformResponse: (res) => res?.data || res,

      providesTags: (res, err, id) => [{ type: 'TaskCompletion', id }],
    }),

    /* =======================================================
       CREATE COMPLETION ENTRY
    ======================================================= */
    createTaskCompletion: builder.mutation({
      query: (body) => ({
        url: 'task-completions/',
        method: 'POST',
        body,
      }),

      transformResponse: (res) => res?.data || res,

      invalidatesTags: [{ type: 'TaskCompletion', id: 'LIST' }],
      
      // Log the response for debugging
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('[Task Completion Created]', data);
        } catch (err) {
          console.error('[Task Completion Error]', err);
        }
      },
    }),

    /* =======================================================
       FULL UPDATE (PUT)
    ======================================================= */
    updateTaskCompletion: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `task-completions/${id}/`,
        method: 'PUT',
        body,
      }),

      transformResponse: (res) => res?.data || res,

      invalidatesTags: (res, err, { id }) => [
        { type: 'TaskCompletion', id },
        { type: 'TaskCompletion', id: 'LIST' },
      ],
    }),

    /* =======================================================
       PARTIAL UPDATE (PATCH)
    ======================================================= */
    patchTaskCompletion: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `task-completions/${id}/`,
        method: 'PATCH',
        body,
      }),

      transformResponse: (res) => res?.data || res,

      invalidatesTags: (res, err, { id }) => [
        { type: 'TaskCompletion', id },
        { type: 'TaskCompletion', id: 'LIST' },
      ],
    }),

    /* =======================================================
       DELETE COMPLETION ENTRY
    ======================================================= */
    deleteTaskCompletion: builder.mutation({
      query: (id) => ({
        url: `task-completions/${id}/`,
        method: 'DELETE',
      }),

      invalidatesTags: (res, err, id) => [
        { type: 'TaskCompletion', id },
        { type: 'TaskCompletion', id: 'LIST' },
      ],
    }),

    /* =======================================================
       BULK CREATE COMPLETIONS
    ======================================================= */
    createBulkTaskCompletions: builder.mutation({
      query: (body) => ({
        url: 'task-completions/bulk/',
        method: 'POST',
        body,
      }),

      invalidatesTags: [{ type: 'TaskCompletion', id: 'LIST' }],
    }),

    /* =======================================================
       GET COMPLETIONS BY ASSIGNMENT ID
    ======================================================= */
    getCompletionsByAssignmentId: builder.query({
      query: (taskAssignmentId) =>
        `task-completions/?task_assignment_id=${taskAssignmentId}`,

      transformResponse: (res) => {
        if (res?.results) return res.results;
        if (Array.isArray(res)) return res;
        if (res?.data) return res.data;
        return [];
      },

      providesTags: (result) =>
        result?.length
          ? result.map(({ id }) => ({ type: 'TaskCompletion', id }))
          : [],
    }),

    /* =======================================================
       COMPLETION STATS
    ======================================================= */
    getCompletionStats: builder.query({
      query: (params = {}) => {
        const allowedKeys = [
          'start_date',
          'end_date',
          'taskmaster',
          'assigned_user',
        ];

        const queryString = buildQueryParams(params, allowedKeys);

        return {
          url: `task-completions/stats/${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
    }),
  }),
});

/* =======================================================
   AUTO-GENERATED HOOKS
======================================================= */

export const {
  useGetCompletedTasksQuery,
  useGetCompletedTaskByIdQuery,
  useCreateTaskCompletionMutation,
  useUpdateTaskCompletionMutation,
  usePatchTaskCompletionMutation,
  useDeleteTaskCompletionMutation,
  useCreateBulkTaskCompletionsMutation,
  useGetCompletionsByAssignmentIdQuery,
  useGetCompletionStatsQuery,
} = taskCompletionApi;