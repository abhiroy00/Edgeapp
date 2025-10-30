import React, { useState } from "react";
import {
  useGetSeveritiesQuery,
  useCreateSeverityMutation,
  useUpdateSeverityMutation,
  useDeleteSeverityMutation,
} from "./SeveritymasterApi";

function Severitymaster() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    severitystring: "",
  });

  const { data, isLoading } = useGetSeveritiesQuery({ page, search });

  const [createSeverity] = useCreateSeverityMutation();
  const [updateSeverity] = useUpdateSeverityMutation();
  const [deleteSeverity] = useDeleteSeverityMutation();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateSeverity({ rid: editingId, ...formData }).unwrap();
      } else {
        await createSeverity(formData).unwrap();
      }

      setFormData({ severitystring: "" });
      setEditingId(null);
    } catch (err) {
      alert("Error: " + JSON.stringify(err?.data));
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.rid);
    setFormData({
      severitystring: item.severitystring,
    });
  };

  const handleDeleteRow = async (rid) => {
    await deleteSeverity(rid);
  };

  return (
    <div className="w-full mt-30 min-h-screen bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-7xl bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-3xl font-bold text-[oklch(0.53_0.27_303.85)] mb-5">
          SEVERITY MASTER
        </h1>

        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="🔍 Search Severity..."
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
            <label className="block mb-1 font-semibold">Severity Name</label>
            <input
              type="text"
              name="severitystring"
              value={formData.severitystring}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded shadow-md hover:scale-105"
          >
            {editingId ? "Update Severity" : "Add Severity"}
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-2">RID</th>
                <th className="px-4 py-2">Severity</th>
                <th className="px-4 py-2">Edit</th>
                <th className="px-4 py-2">Delete</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {data?.results?.map((item) => (
                <tr key={item.rid}>
                  <td className="px-4 py-2">{item.rid}</td>
                  <td className="px-4 py-2">{item.severitystring}</td>

                  <td
                    className="px-4 py-2 text-blue-600 cursor-pointer"
                    onClick={() => handleEdit(item)}
                  >
                    ✏ Edit
                  </td>

                  <td
                    className="px-4 py-2 text-red-600 cursor-pointer"
                    onClick={() => handleDeleteRow(item.rid)}
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

export default Severitymaster;
