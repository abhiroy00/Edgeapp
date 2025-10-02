import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const entityApi = createApi({
  reducerPath: "entityApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000/api/" }),
  tagTypes: ["Entity"],
  endpoints: (builder) => ({
    getEntities: builder.query({
      query: ({ page = 1, page_size = 5, search = "" }) =>
        `entities/?page=${page}&page_size=${page_size}&search=${search}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ entityid }) => ({
                type: "Entity",
                id: entityid,
              })),
              { type: "Entity", id: "LIST" },
            ]
          : [{ type: "Entity", id: "LIST" }],
    }),
    createEntity: builder.mutation({
      query: (newEntity) => ({
        url: "entities/",
        method: "POST",
        body: newEntity,
      }),
      invalidatesTags: [{ type: "Entity", id: "LIST" }],
    }),
    updateEntity: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `entities/${id}/`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Entity", id },
        { type: "Entity", id: "LIST" },
      ],
    }),
    deleteEntity: builder.mutation({
      query: (id) => ({
        url: `entities/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Entity", id },
        { type: "Entity", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetEntitiesQuery,
  useCreateEntityMutation,
  useUpdateEntityMutation,
  useDeleteEntityMutation,
} = entityApi;
