import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const stationApi = createApi({
  reducerPath: "stationApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000/api/" }),
  tagTypes: ["Station"],
  endpoints: (builder) => ({
    // ✅ Paginated stations (for tables)
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

    // ✅ NEW: Fetch all stations (for dropdowns)
    getAllStations: builder.query({
      query: () => `stations/?page_size=9999`,
      providesTags: [{ type: "Station", id: "ALL" }],
    }),

    // ✅ Create
    createStation: builder.mutation({
      query: (data) => ({
        url: "stations/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Station", id: "LIST" }, { type: "Station", id: "ALL" }],
    }),

    // ✅ Update
    updateStation: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `stations/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Station", id },
        { type: "Station", id: "LIST" },
        { type: "Station", id: "ALL" },
      ],
    }),

    // ✅ Delete
    deleteStation: builder.mutation({
      query: (id) => ({
        url: `stations/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Station", id },
        { type: "Station", id: "LIST" },
        { type: "Station", id: "ALL" },
      ],
    }),
  }),
});

export const {
  useGetStationsQuery,
  useGetAllStationsQuery, // ✅ new hook
  useCreateStationMutation,
  useUpdateStationMutation,
  useDeleteStationMutation,
} = stationApi;
