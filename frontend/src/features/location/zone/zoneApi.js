import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const zoneApi = createApi({
  reducerPath: "zoneApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000/api/" }),
  tagTypes: ["Zone"],
  endpoints: (builder) => ({
    getZones: builder.query({
      query: ({ page = 1, pageSize = 10 } = {}) =>
        `zones/?page=${page}&page_size=${pageSize}`,
      providesTags: ["Zone"],
    }),
    createZone: builder.mutation({
      query: (data) => ({ url: "zones/", method: "POST", body: data }),
      invalidatesTags: ["Zone"],
    }),
    updateZone: builder.mutation({
      query: ({ id, ...data }) => ({ url: `zones/${id}/`, method: "PUT", body: data }),
      invalidatesTags: ["Zone"],
    }),
    deleteZone: builder.mutation({
      query: (id) => ({ url: `zones/${id}/`, method: "DELETE" }),
      invalidatesTags: ["Zone"],
    }),
  }),
});

export const {
  useGetZonesQuery,
  useCreateZoneMutation,
  useUpdateZoneMutation,
  useDeleteZoneMutation,
} = zoneApi;
