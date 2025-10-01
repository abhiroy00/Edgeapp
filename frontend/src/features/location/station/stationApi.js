// src/features/api/stationApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const stationApi = createApi({
  reducerPath: "stationApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api" }), // adjust backend URL
  tagTypes: ["Station"],

  endpoints: (builder) => ({
    // List with pagination + search
    getStations: builder.query({
      query: ({ page = 1, page_size = 10, search = "" }) =>
        `/stations/?page=${page}&page_size=${page_size}&search=${search}`,
      providesTags: ["Station"],
    }),

    // Get single station
    getStation: builder.query({
      query: (id) => `/stations/${id}/`,
      providesTags: ["Station"],
    }),

    // Create
    createStation: builder.mutation({
      query: (station) => ({
        url: "/stations/",
        method: "POST",
        body: station,
      }),
      invalidatesTags: ["Station"],
    }),

    // Update
    updateStation: builder.mutation({
      query: ({ id, ...station }) => ({
        url: `/stations/${id}/`,
        method: "PUT",
        body: station,
      }),
      invalidatesTags: ["Station"],
    }),

    // Partial update (PATCH)
    patchStation: builder.mutation({
      query: ({ id, ...station }) => ({
        url: `/stations/${id}/`,
        method: "PATCH",
        body: station,
      }),
      invalidatesTags: ["Station"],
    }),

    // Delete
    deleteStation: builder.mutation({
      query: (id) => ({
        url: `/stations/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Station"],
    }),
  }),
});

export const {
  useGetStationsQuery,
  useGetStationQuery,
  useCreateStationMutation,
  useUpdateStationMutation,
  usePatchStationMutation,
  useDeleteStationMutation,
} = stationApi;
