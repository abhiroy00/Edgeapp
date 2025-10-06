import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userRoleApi = createApi({
  reducerPath: "userRoleApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000/api/" }),
  tagTypes: ["UserRole"], // ✅ Add tag for invalidation
  endpoints: (builder) => ({
    getUserRoles: builder.query({
      query: ({ page = 1, pageSize = 10, search = "" } = {}) =>
        `roles/?page=${page}&page_size=${pageSize}&search=${search}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: "UserRole", id })),
              { type: "UserRole", id: "LIST" },
            ]
          : [{ type: "UserRole", id: "LIST" }],
    }),
    createUserRole: builder.mutation({
      query: (data) => ({ url: "roles/", method: "POST", body: data }),
      invalidatesTags: [{ type: "UserRole", id: "LIST" }], // ✅ refresh list after add
    }),
    updateUserRole: builder.mutation({
      query: ({ id, ...data }) => ({ url: `roles/${id}/`, method: "PUT", body: data }),
      invalidatesTags: (result, error, { id }) => [
        { type: "UserRole", id },
        { type: "UserRole", id: "LIST" },
      ],
    }),
    deleteUserRole: builder.mutation({
      query: (id) => ({ url: `roles/${id}/`, method: "DELETE" }),
      invalidatesTags: (result, error, id) => [
        { type: "UserRole", id },
        { type: "UserRole", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetUserRolesQuery,
  useCreateUserRoleMutation,
  useUpdateUserRoleMutation,
  useDeleteUserRoleMutation,
} = userRoleApi;
