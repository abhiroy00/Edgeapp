import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userRoleApi = createApi({
  reducerPath: "userRoleApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000/api/" }),
  endpoints: (builder) => ({
    getUserRoles: builder.query({
      query: ({ page = 1, pageSize = 10, search = "" } = {}) =>
        `roles/?page=${page}&page_size=${pageSize}&search=${search}`,
    }),
    createUserRole: builder.mutation({
      query: (data) => ({ url: "roles/", method: "POST", body: data }),
    }),
    updateUserRole: builder.mutation({
      query: ({ id, ...data }) => ({ url: `roles/${id}/`, method: "PUT", body: data }),
    }),
    deleteUserRole: builder.mutation({
      query: (id) => ({ url: `roles/${id}/`, method: "DELETE" }),
    }),
  }),
});

export const {
  useGetUserRolesQuery,
  useCreateUserRoleMutation,
  useUpdateUserRoleMutation,
  useDeleteUserRoleMutation,
} = userRoleApi;
