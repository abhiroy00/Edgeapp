import React, { useState } from "react";
import {
  useGetEntitiesQuery,
  useCreateEntityMutation,
  useUpdateEntityMutation,
  useDeleteEntityMutation,
} from "./entityApi";
import { useGetAllStationsQuery } from "../station/stationApi"; // ✅ import station API

export default function Entity() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    entityname: "",
    entitydesc: "",
    station: "",
    prefixcode: "",
    is_active: true,
  });
  const [editingId, setEditingId] = useState(null);

  // Entities
  const { data, isLoading, isError } = useGetEntitiesQuery({
    page,
    page_size: 5,
    search,
  });
  const [createEntity] = useCreateEntityMutation();
  const [updateEntity] = useUpdateEntityMutation();
  const [deleteEntity] = useDeleteEntityMutation();

  // Stations (for dropdown)
const {
  data: stations,
  isLoading: stationLoading,
  isError: stationError,
} = useGetAllStationsQuery();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "is_active" ? value === "true" : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateEntity({ id: editingId, ...formData });
      setEditingId(null);
    } else {
      await createEntity(formData);
    }
    setFormData({
      entityname: "",
      entitydesc: "",
      station: "",
      prefixcode: "",
      is_active: true,
    });
  };

  const handleEdit = (entity) => {
    setFormData(entity);
    setEditingId(entity.entityid);
  };

  const handleDelete = async (id) => {
    await deleteEntity(id);
  };

  if (isLoading)
    return <p className="text-center mt-10 text-lg">Loading...</p>;
  if (isError)
    return (
      <p className="text-center mt-10 text-red-600">
        Error loading entities.
      </p>
    );

  return (
    <div className="w-full mt-30 min-h-screen bg-gray-100 flex justify-center py-10">
      {/* ✅ Wider container */}
      <div className="w-full max-w-7xl bg-white shadow-xl rounded-lg p-8">
           <h1 className="text-3xl font-bold text-[oklch(0.53_0.27_303.85)] mb-5 ">
  🛤️ Entity Management
</h1>

        {/* 🔎 Search */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="🔍 Search entity..."
            className="border p-2 rounded-md w-full focus:ring focus:ring-blue-300"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* 📝 Form */}
        <form
          onSubmit={handleSubmit}
          className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 p-6 rounded-lg shadow-inner"
        >
          <div>
            <label className="block mb-1 text-sm font-semibold">
              Entity Name
            </label>
            <input
              type="text"
              name="entityname"
              value={formData.entityname}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:ring focus:ring-fuchsia-300"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">
              Entity Description
            </label>
            <input
              type="text"
              name="entitydesc"
              value={formData.entitydesc}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:ring focus:ring-fuchsia-300"
            />
          </div>

          {/* ✅ Station Dropdown */}
          <div>
            <label className="block mb-1 text-sm font-semibold">Station</label>
            <select
              name="station"
              value={formData.station}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:ring focus:ring-fuchsia-300"
              required
            >
              <option value="">Select Station</option>
              {stationLoading && (
                <option disabled>Loading stations...</option>
              )}
              {stationError && (
                <option disabled>Error loading stations</option>
              )}
              {stations?.results?.map((s) => (
                <option key={s.stationid} value={s.stationid}>
                  {s.stationname}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">
              Prefix Code
            </label>
            <input
              type="text"
              name="prefixcode"
              value={formData.prefixcode}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:ring focus:ring-fuchsia-300"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">Is Active</label>
            <select
              name="is_active"
              value={formData.is_active}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:ring focus:ring-fuchsia-300"
            >
              <option value="true">✅ Yes</option>
              <option value="false">❌ No</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="bg-[oklch(0.48_0.27_303.85)] hover:bg-[oklch(0.48_0.27_303.85)] text-white px-6 py-2 rounded shadow-md transition"
            >
              {editingId ? "Update Entity" : "Add Entity"}
            </button>
          </div>
        </form>

        {/* 📋 Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg text-sm shadow-md">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-2">Entity Name</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Station</th>
                <th className="px-4 py-2">Prefix Code</th>
                <th className="px-4 py-2">Active</th>
                <th className="px-4 py-2">Edit</th>
                <th className="px-4 py-2">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data?.results?.map((entity) => (
                <tr
                  key={entity.entityid}
                  className="hover:bg-fuchsia-50 transition"
                >
                  <td className="px-4 py-2">{entity.entityname}</td>
                  <td className="px-4 py-2">{entity.entitydesc}</td>
                  <td className="px-4 py-2">
                    {
                      stations?.results?.find(
                        (s) => s.stationid === entity.station
                      )?.stationname || "—"
                    }
                  </td>
                  <td className="px-4 py-2">{entity.prefixcode}</td>
                  <td className="px-4 py-2">
                    {entity.is_active ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-red-600 font-semibold">No</span>
                    )}
                  </td>
                  <td
                    className="px-4 py-2 text-fuchsia-600 cursor-pointer hover:underline"
                    onClick={() => handleEdit(entity)}
                  >
                    ✏️ Edit
                  </td>
                  <td
                    className="px-4 py-2 text-red-600 cursor-pointer hover:underline"
                    onClick={() => handleDelete(entity.entityid)}
                  >
                    🗑️ Delete
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 📌 Pagination */}
        <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
          <p>
            Showing {data?.results?.length || 0} of {data?.count || 0} entries
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={!data?.previous}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50"
            >
              ⬅ Prev
            </button>
            <span className="px-2">Page {page}</span>
            <button
              disabled={!data?.next}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50"
            >
              Next ➡
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
