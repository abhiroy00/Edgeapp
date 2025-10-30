import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const unitOfMeasurementApi = createApi({
  reducerPath: "unitOfMeasurementApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000/api/" }),
  tagTypes: ["Unit"],

  endpoints: (builder) => ({

    // ✅ GET list with pagination + search
    getUnits: builder.query({
      query: ({ page = 1, page_size = 5, search = "" }) =>
        `units/?page=${page}&page_size=${page_size}&search=${search}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ unitid }) => ({
                type: "Unit",
                id: unitid,
              })),
              { type: "Unit", id: "LIST" },
            ]
          : [{ type: "Unit", id: "LIST" }],
    }),

    // ✅ Create unit
    createUnit: builder.mutation({
      query: (newUnit) => ({
        url: "units/",
        method: "POST",
        body: newUnit,
      }),
      invalidatesTags: [{ type: "Unit", id: "LIST" }],
    }),

    // ✅ Update unit
    updateUnit: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `units/${id}/`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Unit", id },
        { type: "Unit", id: "LIST" },
      ],
    }),

    // ✅ Delete unit
    deleteUnit: builder.mutation({
      query: (id) => ({
        url: `units/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Unit", id },
        { type: "Unit", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetUnitsQuery,
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
} = unitOfMeasurementApi;
