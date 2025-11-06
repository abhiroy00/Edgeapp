import React, { useState } from "react";
import {
  useGetStatusQuery,
  useAddStatusMutation,
  useUpdateStatusMutation,
  useDeleteStatusMutation,
} from "../../features/status_master/statusmasterApi";

function Statusmaster() {
  const { data, isLoading } = useGetStatusQuery();
  const [addStatus] = useAddStatusMutation();
  const [updateStatus] = useUpdateStatusMutation();
  const [deleteStatus] = useDeleteStatusMutation();

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false); // ✅ NEW

  const [formData, setFormData] = useState({
    statusText: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.statusText.trim()) return alert("Required!");

    setIsSaving(true); // ✅ start spinner

    if (editingId) {
      await updateStatus({ sid: editingId, statusText: formData.statusText });
    } else {
      await addStatus({ statusText: formData.statusText });
    }

    setFormData({ statusText: "" });
    setEditingId(null);
    setIsSaving(false); // ✅ stop spinner
  };

  const handleEdit = (item) => {
    setEditingId(item.sid);
    setFormData({ statusText: item.statusText });
  };

  const handleDelete = async (sid) => {
    setDeletingId(sid);
    await deleteStatus(sid);
    setDeletingId(null);
  };

  return (
    <div className="w-full mt-30 bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-7xl bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-3xl font-bold text-[oklch(0.53_0.27_303.85)] mb-5">
          🚨 Status Master
        </h1>

        {isLoading && (
          <p className="text-center text-lg font-semibold mb-5">
            ⏳ Loading...
          </p>
        )}

        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="🔍 Search..."
            className="border p-2 rounded-md w-full focus:ring"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 p-6 rounded-lg shadow-inner"
        >
          <div>
            <label className="block mb-1 font-semibold">Status Text</label>
            <input
              type="text"
              name="statusText"
              value={formData.statusText}
              onChange={(e) =>
                setFormData({ ...formData, statusText: e.target.value })
              }
              className="border p-2 w-full rounded"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="bg-[oklch(0.48_0.27_303.85)] text-white px-6 py-2 rounded shadow-md flex items-center gap-2"
            >
              {isSaving ? (
                <span className="animate-spin inline-block border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
              ) : editingId ? (
                "Update"
              ) : (
                "Add"
              )}
            </button>
          </div>
        </form>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg text-sm shadow-md">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-2">Status Text</th>
                <th className="px-4 py-2">Edit</th>
                <th className="px-4 py-2">Delete</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {(data || [])
                .filter((item) =>
                  (item?.statusText || "")
                    .toLowerCase()
                    .includes(search.toLowerCase())
                )
                .map((item) => (
                  <tr key={item.sid}>
                    <td className="px-4 py-2">{item.statusText}</td>

                    <td
                      onClick={() => handleEdit(item)}
                      className="px-4 py-2 text-blue-600 cursor-pointer"
                    >
                      ✏ Edit
                    </td>

                    <td
                      onClick={() => handleDelete(item.sid)}
                      className="px-4 py-2 text-red-600 cursor-pointer"
                    >
                      {deletingId === item.sid ? (
                        <span className="animate-spin inline-block border-2 border-red-600 border-t-transparent rounded-full w-5 h-5"></span>
                      ) : (
                        "🗑 Delete"
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-gray-600 text-sm">
          Showing {data?.length || 0} Status
        </p>
      </div>
    </div>
  );
}

export default Statusmaster;
