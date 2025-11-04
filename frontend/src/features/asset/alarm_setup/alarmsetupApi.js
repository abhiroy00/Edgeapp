// src/redux/services/alarmsetupApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const alarmSetupApi = createApi({
  reducerPath: "alarmSetupApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api/" }),

  tagTypes: ["AlarmSetup"],

  endpoints: (builder) => ({
    // ✅ Get paginated + search
    getAlarmSetups: builder.query({
      query: ({ page, search }) =>
        `asset-attribute-link/?page=${page}&search=${search}`,
      providesTags: ["AlarmSetup"],
    }),

    // ✅ Create
    addAlarmSetup: builder.mutation({
      query: (body) => ({
        url: "asset-attribute-link/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AlarmSetup"],
    }),

    // ✅ Update
    updateAlarmSetup: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `asset-attribute-link/${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["AlarmSetup"],
    }),

    // ✅ Delete
    deleteAlarmSetup: builder.mutation({
      query: (id) => ({
        url: `asset-attribute-link/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["AlarmSetup"],
    }),

    // ✅ Dropdown – Get asset list
    getAssets: builder.query({
      query: () => `assetinventory/`,
    }),

    // ✅ Dropdown – Get attribute master
    getAttributeMasters: builder.query({
      query: () => `asset-attribute-master/`,
    }),
  }),
});

export const {
  useGetAlarmSetupsQuery,
  useAddAlarmSetupMutation,
  useUpdateAlarmSetupMutation,
  useDeleteAlarmSetupMutation,
  useGetAssetsQuery,
  useGetAttributeMastersQuery,
} = alarmSetupApi;
