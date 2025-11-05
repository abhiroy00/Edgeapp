import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const typemasterApi = createApi({
  reducerPath: "typemasterApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000/api/" }),
  tagTypes: ["Typemaster"],
  endpoints: (builder) => ({
    getTypes: builder.query({
      query: ({ page = 1, page_size = 10, search = "" }) =>
        `typemaster/?page=${page}&page_size=${page_size}&search=${search}`,
      providesTags: ["Typemaster"],
    }),

    createType: builder.mutation({
      query: (body) => ({
        url: "typemaster/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Typemaster"],
    }),

    updateType: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `typemaster/${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Typemaster"],
    }),

    deleteType: builder.mutation({
      query: (id) => ({
        url: `typemaster/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Typemaster"],
    }),
  }),
});

export const {
  useGetTypesQuery,
  useCreateTypeMutation,
  useUpdateTypeMutation,
  useDeleteTypeMutation,
} = typemasterApi;
