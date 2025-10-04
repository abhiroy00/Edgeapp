import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userLevelApi = createApi({
  reducerPath: "userLevelApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000/api/" }),
  endpoints: (builder) => ({
    getUserLevels: builder.query({
      query: ({ page = 1, pageSize = 10 } = {}) =>
        `userlevels/?page=${page}&page_size=${pageSize}`,
    }),
    createUserLevel: builder.mutation({
      query: (data) => ({
        url: "userlevels/",
        method: "POST",
        body: data,
      }),
    }),
    updateUserLevel: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `userlevels/${id}/`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteUserLevel: builder.mutation({
      query: (id) => ({
        url: `userlevels/${id}/`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetUserLevelsQuery,
  useCreateUserLevelMutation,
  useUpdateUserLevelMutation,
  useDeleteUserLevelMutation,
} = userLevelApi;
