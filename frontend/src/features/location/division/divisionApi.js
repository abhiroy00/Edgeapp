// src/features/division/divisionApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const divisionApi = createApi({
  reducerPath: "divisionApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000/api/" }),
  tagTypes: ["Division", "Zone"],
  endpoints: (builder) => ({
    // GET all divisions
    getDivisions: builder.query({
      query: () => "divisions/",
      providesTags: ["Division"],
    }),

    // GET all zones
    getZones: builder.query({
      query: () => "zones/",
      providesTags: ["Zone"],
    }),

    // CREATE division
    createDivision: builder.mutation({
      query: (newDivision) => ({
        url: "divisions/",
        method: "POST",
        body: {
          divisionname: newDivision.name,
          divisiondesc: newDivision.description,
          prefixcode: newDivision.prefix,
          zone: Number(newDivision.zoneId),
          is_active: newDivision.isActive === "true",
        },
      }),
      invalidatesTags: ["Division"],
    }),

   // DELETE division
deleteDivision: builder.mutation({
  query: (divisionid) => ({
    url: `divisions/${divisionid}/`,
    method: "DELETE",
  }),
  invalidatesTags: ["Division"],
}),


  }),
});

export const {
  useGetDivisionsQuery,
  useGetZonesQuery,
  useCreateDivisionMutation,
  useDeleteDivisionMutation,
} = divisionApi;
