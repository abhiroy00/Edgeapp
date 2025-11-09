import React, { useState } from "react";
import {
  useGetTypesQuery,
  useCreateTypeMutation,
  useUpdateTypeMutation,
  useDeleteTypeMutation,
} from "./typemasterApi";

function Typemaster() {
  const [formData, setFormData] = useState({ maintenancetypename: "" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const { data } = useGetTypesQuery({});
  const [createType] = useCreateTypeMutation();
  const [updateType] = useUpdateTypeMutation();
  const [deleteType] = useDeleteTypeMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await updateType({ rid: editingId, ...formData });
      alert("Updated ✅");
    } else {
      await createType(formData);
      alert("Created ✅");
    }

    setFormData({ maintenancetypename: "" });
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setEditingId(item.rid);
    setFormData({ maintenancetypename: item.maintenancetypename });
  };

  const handleDelete = async (rid) => {
    if (window.confirm("Delete?")) {
      await deleteType(rid);
    }
  };

  return (
    <div className="w-full mt-30 bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-7xl bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-3xl font-bold text-[oklch(0.53_0.27_303.85)] mb-5">
          🚨 Type Master
        </h1>

        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="🔍 Search..."
            className="border p-2 rounded-md w-full focus:ring focus:ring-blue-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 p-6 rounded-lg shadow-inner"
        >
          <div>
            <label className="block mb-1 font-semibold">Maintenance Type</label>
            <input
              type="text"
              name="maintenancetypename"
              value={formData.maintenancetypename}
              onChange={(e) =>
                setFormData({ ...formData, maintenancetypename: e.target.value })
              }
              className="border p-2 w-full rounded"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="bg-[oklch(0.48_0.27_303.85)] text-white px-6 py-2 rounded shadow-md"
            >
              {editingId ? "Update" : "Add"}
            </button>
          </div>
        </form>

        {/* ✅ TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg text-sm shadow-md">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-2">Maintenance Type</th>
                <th className="px-4 py-2">Edit</th>
                <th className="px-4 py-2">Delete</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {(data || []).map((item) => (
                <tr key={item.rid}>
                  <td className="px-4 py-2">{item.maintenancetypename}</td>

                  <td
                    onClick={() => handleEdit(item)}
                    className="px-4 py-2 text-blue-600 cursor-pointer text-center"
                  >
                    ✏ Edit
                  </td>

                  <td
                    onClick={() => handleDelete(item.rid)}
                    className="px-4 py-2 text-red-600 cursor-pointer text-center"
                  >
                    🗑 Delete
                  </td>
                </tr>
              ))}
            </tbody>
          </table> 
        </div>

        <p className="mt-4 text-gray-600 text-sm">
          Showing {data?.length || 0} Types
        </p>
      </div>
    </div>
  );
}

export default Typemaster;
