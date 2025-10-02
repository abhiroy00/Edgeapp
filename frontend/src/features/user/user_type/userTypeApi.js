// features/usertype/userTypeApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userTypeApi = createApi({
  reducerPath: "userTypeApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api/" }), // update base URL
  tagTypes: ["UserType"],
  endpoints: (builder) => ({
    getUserTypes: builder.query({
      query: ({ page = 1, page_size = 5, search = "" } = {}) =>
        `usertypes/?page=${page}&page_size=${page_size}&search=${search}`,
      providesTags: ["UserType"],
    }),
    createUserType: builder.mutation({
      query: (data) => ({
        url: "usertypes/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UserType"],
    }),
    updateUserType: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `usertypes/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["UserType"],
    }),
    deleteUserType: builder.mutation({
      query: (id) => ({
        url: `usertypes/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserType"],
    }),
  }),
});

export const {
  useGetUserTypesQuery,
  useCreateUserTypeMutation,
  useUpdateUserTypeMutation,
  useDeleteUserTypeMutation,
} = userTypeApi;
