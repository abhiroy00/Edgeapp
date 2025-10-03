// src/services/userRoleApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userRoleApi = createApi({
  reducerPath: "userRoleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api/", // adjust Django API base
  }),
  tagTypes: ["UserRole"],
  endpoints: (builder) => ({
    // ✅ Get roles (list with pagination + search)
    getUserRoles: builder.query({
      query: ({ page = 1, pageSize = 5, search = "" }) =>
        `roles/?page=${page}&page_size=${pageSize}&search=${search}`,
      providesTags: ["UserRole"],
    }),

    // ✅ Get single role
    getUserRole: builder.query({
      query: (id) => `roles/${id}/`,
      providesTags: ["UserRole"],
    }),

    // ✅ Create role
    createUserRole: builder.mutation({
      query: (newRole) => ({
        url: "roles/",
        method: "POST",
        body: newRole,
      }),
      invalidatesTags: ["UserRole"],
    }),

    // ✅ Update role
    updateUserRole: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `roles/${id}/`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: ["UserRole"],
    }),

    // ✅ Delete role
    deleteUserRole: builder.mutation({
      query: (id) => ({
        url: `roles/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserRole"],
    }),

    
  }),
});

export const {
  useGetUserRolesQuery,
  useGetUserRoleQuery,
  useCreateUserRoleMutation,
  useUpdateUserRoleMutation,
  useDeleteUserRoleMutation,
} = userRoleApi;
