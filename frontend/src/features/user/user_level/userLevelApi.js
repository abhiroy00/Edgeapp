import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userLevelApi = createApi({
  reducerPath: "userLevelApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000/api/" }),
  tagTypes: ["UserLevel"], // ✅ Add tag for invalidation
  endpoints: (builder) => ({
    getUserLevels: builder.query({
      query: ({ page = 1, pageSize = 10 } = {}) =>
        `userlevels/?page=${page}&page_size=${pageSize}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: "UserLevel", id })),
              { type: "UserLevel", id: "LIST" },
            ]
          : [{ type: "UserLevel", id: "LIST" }],
    }),
    createUserLevel: builder.mutation({
      query: (data) => ({
        url: "userlevels/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "UserLevel", id: "LIST" }], // ✅ refetch list after add
    }),
    updateUserLevel: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `userlevels/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "UserLevel", id },
        { type: "UserLevel", id: "LIST" },
      ],
    }),
    deleteUserLevel: builder.mutation({
      query: (id) => ({
        url: `userlevels/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "UserLevel", id },
        { type: "UserLevel", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetUserLevelsQuery,
  useCreateUserLevelMutation,
  useUpdateUserLevelMutation,
  useDeleteUserLevelMutation,
} = userLevelApi;
