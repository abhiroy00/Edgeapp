import React, { useState } from "react";
import {
  useGetStationsQuery,
  useCreateStationMutation,
  useUpdateStationMutation,
  useDeleteStationMutation,
} from "./stationApi";
import { useGetDivisionsQuery } from "../division/divisionApi";

export default function Station() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    stationname: "",
    stationdesc: "",
    division: "",
    prefixcode: "",
    is_active: true,
  });
  const [editingId, setEditingId] = useState(null);

  const { data, isLoading, isError } = useGetStationsQuery({
    page,
    page_size: 5,
    search,
  });
  const { data: divisions } = useGetDivisionsQuery();

  const [createStation] = useCreateStationMutation();
  const [updateStation] = useUpdateStationMutation();
  const [deleteStation] = useDeleteStationMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateStation({ id: editingId, ...formData }).unwrap();
        setEditingId(null);
      } else {
        await createStation(formData).unwrap();
      }

      setFormData({
        stationname: "",
        stationdesc: "",
        division: "",
        prefixcode: "",
        is_active: true,
      });
    } catch (error) {
      console.error("Error saving station:", error);
    }
  };

  const handleEdit = (station) => {
    setFormData(station);
    setEditingId(station.stationid);
  };

  const handleDelete = async (id) => {
    try {
      await deleteStation(id).unwrap();
    } catch (error) {
      console.error("Error deleting station:", error);
    }
  };

  if (isLoading)
    return <p className="text-center mt-10 text-lg">Loading...</p>;
  if (isError)
    return (
      <p className="text-center mt-10 text-red-600">Error loading stations.</p>
    );

  return (
    <div className="w-full mt-30 bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-7xl bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-3xl font-bold text-[oklch(0.53_0.27_303.85)] mb-5">
          🚉 Stations Management
        </h1>

        {/* Search */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="🔍 Search station..."
            className="border p-2 rounded-md w-full focus:ring focus:ring-blue-200"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 p-6 rounded-lg shadow-inner"
        >
          <div>
            <label className="block mb-1 text-sm font-semibold">
              Station Name
            </label>
            <input
              type="text"
              value={formData.stationname}
              onChange={(e) =>
                setFormData({ ...formData, stationname: e.target.value })
              }
              className="border p-2 w-full rounded focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">
              Station Description
            </label>
            <input
              type="text"
              value={formData.stationdesc}
              onChange={(e) =>
                setFormData({ ...formData, stationdesc: e.target.value })
              }
              className="border p-2 w-full rounded focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">Division</label>
            <select
              value={formData.division}
              onChange={(e) =>
                setFormData({ ...formData, division: e.target.value })
              }
              className="border p-2 w-full rounded focus:ring focus:ring-blue-300"
              required
            >
              <option value="">-- Select Division --</option>
              {divisions?.map((div) => (
                <option key={div.divisionid} value={div.divisionid}>
                  {div.divisionname}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">Prefix Code</label>
            <input
              type="text"
              value={formData.prefixcode}
              onChange={(e) =>
                setFormData({ ...formData, prefixcode: e.target.value })
              }
              className="border p-2 w-full rounded focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">Is Active</label>
            <select
              value={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.value === "true" })
              }
              className="border p-2 w-full rounded focus:ring focus:ring-blue-300"
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
              {editingId ? "Update Station" : "Add Station"}
            </button>
          </div>
        </form>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg text-sm shadow-md">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-2">Station Name</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Division</th>
                <th className="px-4 py-2">Prefix Code</th>
                <th className="px-4 py-2">Active</th>
                <th className="px-4 py-2">Edit</th>
                <th className="px-4 py-2">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data?.results?.map((station) => {
                const divisionName =
                  divisions?.find((d) => d.divisionid === station.division)
                    ?.divisionname || "N/A";
                return (
                  <tr
                    key={station.stationid}
                    className="hover:bg-blue-50 transition"
                  >
                    <td className="px-4 py-2">{station.stationname}</td>
                    <td className="px-4 py-2">{station.stationdesc}</td>
                    <td className="px-4 py-2">{divisionName}</td>
                    <td className="px-4 py-2">{station.prefixcode}</td>
                    <td className="px-4 py-2">
                      {station.is_active ? (
                        <span className="text-green-600 font-semibold">Yes</span>
                      ) : (
                        <span className="text-red-600 font-semibold">No</span>
                      )}
                    </td>
                    <td
                      className="px-4 py-2 text-blue-600 cursor-pointer hover:underline"
                      onClick={() => handleEdit(station)}
                    >
                      ✏️ Edit
                    </td>
                    <td
                      className="px-4 py-2 text-red-600 cursor-pointer hover:underline"
                      onClick={() => handleDelete(station.stationid)}
                    >
                      🗑️ Delete
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
