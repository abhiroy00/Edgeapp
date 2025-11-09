import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000/api" }),
  tagTypes: ["Users"],

  endpoints: (builder) => ({
    // 🔹 Get Users with pagination + search
    getUsers: builder.query({
      query: ({ page = 1, pageSize = 10, search = "" } = {}) =>
        `users/?page=${page}&page_size=${pageSize}&search=${search}`,
      providesTags: ["Users"],
    }),

    // 🔹 Get All Users for Dropdown (no pagination limit)
    getUsersDropdown: builder.query({
      query: () => `users/?page_size=1000`,
      providesTags: ["Users"],
      transformResponse: (response) => {
        // Handle both paginated and non-paginated responses
        if (Array.isArray(response)) return response;
        if (response.results) return response.results;
        return [];
      },
    }),

    // 🔹 Create User
    createUser: builder.mutation({
      query: (newUser) => ({
        url: "users/",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["Users"],
    }),

    // 🔹 Update User
    updateUser: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `users/${id}/`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Users"],
    }),

    // 🔹 Delete User
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `users/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUsersDropdownQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;