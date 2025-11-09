import React, { useState } from "react";
import {
  useGetJunctionBoxesQuery,
  useCreateJunctionBoxMutation,
  useUpdateJunctionBoxMutation,
  useDeleteJunctionBoxMutation,
} from "../rack/rackApi";

import { useGetEntitiesQuery } from "../entity/entityApi";

export default function Rack() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    junctionname: "",
    junctiondesc: "",
    stationentity: "",
    prefixcode: "",
    is_active: "true",
  });

  const { data, isLoading } = useGetJunctionBoxesQuery({ page, search });

  // ✅ IMPORTANT: pass parameters to useGetEntitiesQuery
  const { data: entity } = useGetEntitiesQuery({
    page: 1,
    page_size: 100,
    search: "",
  });

  const [createJunctionBox] = useCreateJunctionBoxMutation();
  const [updateJunctionBox] = useUpdateJunctionBoxMutation();
  const [deleteJunctionBox] = useDeleteJunctionBoxMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      junctionname: formData.junctionname.trim(),
      junctiondesc: formData.junctiondesc.trim(),
      stationentity: Number(formData.stationentity),
      prefixcode: formData.prefixcode.trim(),
      is_active: formData.is_active === "true",
    };

    try {
      if (editingId) {
        await updateJunctionBox({ id: editingId, ...payload }).unwrap();
      } else {
        await createJunctionBox(payload).unwrap();
      }

      setFormData({
        junctionname: "",
        junctiondesc: "",
        stationentity: "",
        prefixcode: "",
        is_active: "true",
      });
      setEditingId(null);
    } catch (error) {
      console.log("Error:", error?.data);
      alert("Error: " + JSON.stringify(error?.data));
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.junctionid);
    setFormData({
      junctionname: item.junctionname,
      junctiondesc: item.junctiondesc,
      stationentity: item.stationentity,
      prefixcode: item.prefixcode,
      is_active: item.is_active ? "true" : "false",
    });
  };

  const handleDeleteRow = async (id) => {
    await deleteJunctionBox(id);
  };

  return (
    <div className="w-full mt-30 min-h-screen bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-7xl bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-3xl font-bold text-[oklch(0.43_0.27_303.85)] mb-5">
          🛠️ Junction Box
        </h1>

        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="🔍 Search Junction..."
            className="border p-2 rounded-md w-full focus:ring focus:ring-blue-300"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 p-6 rounded-lg shadow-inner"
        >
          <div>
            <label className="block mb-1 font-semibold">Junction Name</label>
            <input
              type="text"
              name="junctionname"
              value={formData.junctionname}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Description</label>
            <input
              type="text"
              name="junctiondesc"
              value={formData.junctiondesc}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          {/* ✅ DROPDOWN - ENTITY */}
          <div>
            <label className="block mb-1 font-semibold">Entity</label>
            <select
              name="stationentity"
              value={formData.stationentity}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            >
              <option value="">Select Entity</option>

              {entity?.results?.length > 0 ? (
                entity.results.map((e) => (
                  <option key={e.entityid} value={e.entityid}>
                    {e.entityname}
                  </option>
                ))
              ) : (
                <option disabled>No Entities Found</option>
              )}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Prefix Code</label>
            <input
              type="text"
              name="prefixcode"
              value={formData.prefixcode}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Is Active</label>
            <select
              name="is_active"
              value={formData.is_active}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            >
              <option value="true">✅ Yes</option>
              <option value="false">❌ No</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-[oklch(0.42_0.27_303.85)] text-white px-6 py-2 rounded shadow-md hover:scale-105"
          >
            {editingId ? "Update Junction Box" : "Add Junction Box"}
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Entity</th>
                <th className="px-4 py-2">Prefix</th>
                <th className="px-4 py-2">Active</th>
                <th className="px-4 py-2">Edit</th>
                <th className="px-4 py-2">Delete</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {data?.results?.map((item) => (
                <tr key={item.junctionid}>
                  <td className="px-4 py-2">{item.junctionname}</td>
                  <td className="px-4 py-2">{item.junctiondesc || "—"}</td>

                  {/* ✅ Display Entity Name */}
                  <td className="px-4 py-2">
                    {
                      entity?.results?.find(
                        (e) => e.entityid === item.stationentity
                      )?.entityname || "—"
                    }
                  </td>

                  <td className="px-4 py-2">{item.prefixcode}</td>

                  <td className="px-4 py-2">
                    {item.is_active ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-red-600 font-semibold">No</span>
                    )}
                  </td>

                  <td
                    className="px-4 py-2 text-blue-600 cursor-pointer"
                    onClick={() => handleEdit(item)}
                  >
                    ✏ Edit
                  </td>

                  <td
                    className="px-4 py-2 text-red-600 cursor-pointer"
                    onClick={() => handleDeleteRow(item.junctionid)}
                  >
                    🗑 Delete
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-6">
          <p>
            Showing {data?.results?.length || 0} of {data?.count || 0} entries
          </p>

          <div className="flex gap-2">
            <button
              disabled={!data?.previous}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              ⬅ Prev
            </button>

            <span>Page {page}</span>

            <button
              disabled={!data?.next}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next ➡
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
