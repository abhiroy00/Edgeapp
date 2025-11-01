// src/redux/api/assetAttributeApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const assetAttributeApi = createApi({
  reducerPath: 'assetAttributeApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api/' }),
  tagTypes: ['AssetAttributes'],

  endpoints: (builder) => ({
    fetchAssetAttributes: builder.query({
      query: ({ page = 1, search = '' }) =>
        `asset-attributes/?page=${page}&search=${search}`,
      providesTags: ['AssetAttributes'],
    }),

    fetchAssets: builder.query({
      query: () => `assets/`,
    }),

    fetchUnits: builder.query({
      query: () => `units/`,
    }),

    addAssetAttribute: builder.mutation({
      query: (body) => ({
        url: 'asset-attributes/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AssetAttributes'],
    }),

    updateAssetAttribute: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `asset-attributes/${id}/`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['AssetAttributes'],
    }),

    deleteAssetAttribute: builder.mutation({
      query: (id) => ({
        url: `asset-attributes/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AssetAttributes'],
    }),
  }),
});

export const {
  useFetchAssetAttributesQuery,
  useFetchAssetsQuery,
  useFetchUnitsQuery,
  useAddAssetAttributeMutation,
  useUpdateAssetAttributeMutation,
  useDeleteAssetAttributeMutation,
} = assetAttributeApi;
