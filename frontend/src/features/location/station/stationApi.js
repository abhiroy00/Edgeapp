import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const stationApi = createApi({
  reducerPath: "stationApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000/api/" }),
  tagTypes: ["Station"], // ✅ Tag for invalidation
  endpoints: (builder) => ({
    getStations: builder.query({
      query: ({ page = 1, pageSize = 5, search = "" } = {}) =>
        `stations/?page=${page}&page_size=${pageSize}&search=${search}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ stationid }) => ({
                type: "Station",
                id: stationid,
              })),
              { type: "Station", id: "LIST" },
            ]
          : [{ type: "Station", id: "LIST" }],
    }),
    createStation: builder.mutation({
      query: (data) => ({
        url: "stations/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Station", id: "LIST" }], // ✅ refetch list
    }),
    updateStation: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `stations/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Station", id }, { type: "Station", id: "LIST" }],
    }),
    deleteStation: builder.mutation({
      query: (id) => ({
        url: `stations/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Station", id }, { type: "Station", id: "LIST" }],
    }),
  }),
});

export const {
  useGetStationsQuery,
  useCreateStationMutation,
  useUpdateStationMutation,
  useDeleteStationMutation,
} = stationApi;
