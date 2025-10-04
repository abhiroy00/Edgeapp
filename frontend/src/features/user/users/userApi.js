import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000/api" }), // change if needed
  tagTypes: ["Users"],

  endpoints: (builder) => ({
    // 🔹 Get Users with pagination + search
    getUsers: builder.query({
      query: ({ page = 1, pageSize = 10, search = "" }) =>
        `users/?page=${page}&page_size=${pageSize}&search=${search}`,
      providesTags: ["Users"],
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

    // ✅ Dropdown APIs (fetch data from related tables)
  
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
