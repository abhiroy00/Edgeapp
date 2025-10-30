import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const assetMasterApi = createApi({
  reducerPath: "assetMasterApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000/api/" }),
  tagTypes: ["Asset"],
  endpoints: (builder) => ({

    // ✅ Fetch with pagination + search
    getAssets: builder.query({
      query: ({ page = 1, pageSize = 5, search = "" } = {}) =>
        `asset/?page=${page}&page_size=${pageSize}&search=${search}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ assetid }) => ({
                type: "Asset",
                id: assetid,
              })),
              { type: "Asset", id: "LIST" },
            ]
          : [{ type: "Asset", id: "LIST" }],
    }),

    // ✅ Create
    createAsset: builder.mutation({
      query: (data) => ({
        url: "asset/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Asset", id: "LIST" }],
    }),

    // ✅ Update
    updateAsset: builder.mutation({
      query: ({ assetid, ...data }) => ({
        url: `asset/${assetid}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (res, err, { assetid }) => [
        { type: "Asset", id: assetid },
        { type: "Asset", id: "LIST" },
      ],
    }),

    // ✅ Delete
    deleteAsset: builder.mutation({
      query: (assetid) => ({
        url: `asset/${assetid}/`,
        method: "DELETE",
      }),
      invalidatesTags: (res, err, assetid) => [
        { type: "Asset", id: assetid },
        { type: "Asset", id: "LIST" },
      ],
    }),

  }),
});

export const {
  useGetAssetsQuery,
  useCreateAssetMutation,
  useUpdateAssetMutation,
  useDeleteAssetMutation,
} = assetMasterApi;
