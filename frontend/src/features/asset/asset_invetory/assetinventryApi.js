import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const assetInventoryApi = createApi({
  reducerPath: "assetInventoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api/",
  }),
  tagTypes: ["AssetInventory"],
  endpoints: (builder) => ({
    getInventories: builder.query({
      query: (args = {}) => {
        const { search = "", page = 1 } = args;
        return `assetinventory/?search=${search}&page=${page}`;
      },
      providesTags: ["AssetInventory"],
    }),
    
    createInventory: builder.mutation({
      query: (body) => ({
        url: "assetinventory/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AssetInventory"],
    }),
    
    updateInventory: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `assetinventory/${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["AssetInventory"],
    }),
    
    deleteInventory: builder.mutation({
      query: (id) => ({
        url: `assetinventory/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["AssetInventory"],
    }),
  }),
});

export const {
  useGetInventoriesQuery,
  useCreateInventoryMutation,
  useUpdateInventoryMutation,
  useDeleteInventoryMutation,
} = assetInventoryApi;
