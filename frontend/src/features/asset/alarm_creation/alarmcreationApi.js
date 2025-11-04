import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const alarmCreationApi = createApi({
  reducerPath: "alarmCreationApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000/api/" }),
  tagTypes: ["Alarm", "Operator", "Attribute"],

  endpoints: (builder) => ({

    // ✅ Fetch alarms
    getAlarms: builder.query({
      query: ({ page = 1, pageSize = 10, search = "" } = {}) =>
        `alarmcreation/?page=${page}&page_size=${pageSize}&search=${search}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ alarmsetup }) => ({
                type: "Alarm",
                id: alarmsetup,
              })),
              { type: "Alarm", id: "LIST" },
            ]
          : [{ type: "Alarm", id: "LIST" }],
    }),

    // ✅ Create Alarm
    createAlarm: builder.mutation({
      query: (data) => ({
        url: "alarmcreation/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Alarm", id: "LIST" }],
    }),

    // ✅ Update Alarm
    updateAlarm: builder.mutation({
      query: ({ alarmsetup, ...data }) => ({
        url: `alarmcreation/${alarmsetup}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (res, err, { alarmsetup }) => [
        { type: "Alarm", id: alarmsetup },
        { type: "Alarm", id: "LIST" },
      ],
    }),

    // ✅ Delete Alarm
    deleteAlarm: builder.mutation({
      query: (alarmsetup) => ({
        url: `alarmcreation/${alarmsetup}/`,
        method: "DELETE",
      }),
      invalidatesTags: (res, err, alarmsetup) => [
        { type: "Alarm", id: alarmsetup },
        { type: "Alarm", id: "LIST" },
      ],
    }),

    // ✅ Fetch Operators
    getOperators: builder.query({
      query: () => "operator/",
      providesTags: [{ type: "Operator", id: "LIST" }],
    }),

    // ✅ Fetch Asset Attribute Link list
    getAssetAttributes: builder.query({
      query: () => "assetattributelink/",
      providesTags: [{ type: "Attribute", id: "LIST" }],
    }),
  }),
});

// ✅ Export hooks
export const {
  useGetAlarmsQuery,
  useCreateAlarmMutation,
  useDeleteAlarmMutation,
  useUpdateAlarmMutation,
  useGetOperatorsQuery,
  useGetAssetAttributesQuery, // ✅ Added export
} = alarmCreationApi;
