import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const rackApi = createApi({
  reducerPath: "rackApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["JunctionBox"],
  endpoints: (builder) => ({

    // ✅ Get all Junction Boxes (pagination + search)
    getJunctionBoxes: builder.query({
      // Provide default empty object to avoid destructuring errors
      query: ({ page = 1, search = "" } = {}) =>
        `junctionboxes/?page=${page}&search=${search}`,
      providesTags: ["JunctionBox"],
    }),

    // ✅ Create
    createJunctionBox: builder.mutation({
      query: (body) => ({
        url: "junctionboxes/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["JunctionBox"],
    }),

    // ✅ Update
    updateJunctionBox: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `junctionboxes/${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["JunctionBox"],
    }),

    // ✅ Delete
    deleteJunctionBox: builder.mutation({
      query: (id) => ({
        url: `junctionboxes/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["JunctionBox"],
    }),

    // ✅ Fetch Station Names (Dropdown)
    getStations: builder.query({
      query: () => `stations/`,
    }),
  }),
});

export const {
  useGetJunctionBoxesQuery,
  useCreateJunctionBoxMutation,
  useUpdateJunctionBoxMutation,
  useDeleteJunctionBoxMutation,
  useGetStationsQuery,
} = rackApi;
