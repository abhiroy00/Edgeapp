import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const typemasterApi = createApi({
  reducerPath: "typemasterApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api",
  }),

  tagTypes: ["TypeMaster"],

  endpoints: (builder) => ({
    // 🔹 Get Types with pagination
    getTypes: builder.query({
      query: ({ page = 1, pageSize = 10, search = "" } = {}) =>
        `/typemaster/?page=${page}&page_size=${pageSize}&search=${search}`,
      providesTags: ["TypeMaster"],
    }),

    // 🔹 Get All Types for Dropdown (no pagination limit)
    getTypesDropdown: builder.query({
      query: () => `/typemaster/?page_size=1000`,
      providesTags: ["TypeMaster"],
      transformResponse: (response) => {
        // Handle both paginated and non-paginated responses
        if (Array.isArray(response)) return response;
        if (response.results) return response.results;
        return [];
      },
    }),

    createType: builder.mutation({
      query: (body) => ({
        url: "/typemaster/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["TypeMaster"],
    }),

    updateType: builder.mutation({
      query: ({ rid, maintenancetypename }) => ({
        url: `/typemaster/${rid}/`,
        method: "PATCH",
        body: { maintenancetypename },
      }),
      invalidatesTags: ["TypeMaster"],
    }),

    deleteType: builder.mutation({
      query: (rid) => ({
        url: `/typemaster/${rid}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["TypeMaster"],
    }),
  }),
});

export const {
  useGetTypesQuery,
  useGetTypesDropdownQuery,
  useCreateTypeMutation,
  useUpdateTypeMutation,
  useDeleteTypeMutation,
} = typemasterApi;