import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const typemasterApi = createApi({
  reducerPath: "typemasterApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api",
  }),

  tagTypes: ["TypeMaster"],

  endpoints: (builder) => ({
    getTypes: builder.query({
      query: () => "/typemaster/",
      providesTags: ["TypeMaster"],
    }),

    createType: builder.mutation({
      query: (body) => ({
        url: "/typemaster/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["TypeMaster"],
    }),

    updateType: builder.mutation({
      query: ({ rid, maintenancetypename }) => ({
        url: `/typemaster/${rid}/`,
        method: "PATCH", // ✅ fixed
        body: { maintenancetypename },
      }),
      invalidatesTags: ["TypeMaster"],
    }),

    deleteType: builder.mutation({
      query: (rid) => ({
        url: `/typemaster/${rid}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["TypeMaster"],
    }),
  }),
});

export const {
  useGetTypesQuery,
  useCreateTypeMutation,
  useUpdateTypeMutation,
  useDeleteTypeMutation,
} = typemasterApi;
