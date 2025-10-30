import React, { useState } from "react";
import {
  useGetUnitsQuery,
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
} from "./unitofmesurementApi";

function Unitofmeasurement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, refetch } = useGetUnitsQuery({
    page,
    page_size: 5,
    search,
  });

  const [createUnit] = useCreateUnitMutation();
  const [updateUnit] = useUpdateUnitMutation();
  const [deleteUnit] = useDeleteUnitMutation();

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    unitmeasurename: "",
    abbrivation: "",
    zeroafterdecimal: "",
    sensortype: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      zeroafterdecimal: Number(formData.zeroafterdecimal),
    };

    try {
      if (editingId) {
        await updateUnit({ id: editingId, ...payload });
      } else {
        await createUnit(payload);
      }

      setFormData({
        unitmeasurename: "",
        abbrivation: "",
        zeroafterdecimal: "",
        sensortype: "",
      });
      setEditingId(null);
      refetch();
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to save UOM");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.uid);
    setFormData({
      unitmeasurename: item.unitmeasurename,
      abbrivation: item.abbrivation || "",
      zeroafterdecimal: item.zeroafterdecimal,
      sensortype: item.sensortype || "",
    });
  };

  const handleDeleteRow = async (id) => {
    await deleteUnit(id);
    refetch();
  };

  return (
    <>
      <div className="w-full mt-30 min-h-screen bg-gray-100 flex justify-center py-10">
        <div className="w-full max-w-7xl bg-white shadow-xl rounded-lg p-8">
          <h1 className="text-3xl font-bold text-[oklch(0.53_0.27_303.85)] mb-5">
            UOM
          </h1>

          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="🔍 Search UOM..."
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
              <label className="block mb-1 font-semibold">UOM Name</label>
              <input
                type="text"
                name="unitmeasurename"
                value={formData.unitmeasurename}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">ABBR</label>
              <input
                type="text"
                name="abbrivation"
                value={formData.abbrivation}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">ZERO AFTER DECIMAL</label>
              <input
                type="number"
                name="zeroafterdecimal"
                value={formData.zeroafterdecimal}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">SENSOR TYPE</label>
              <input
                type="text"
                name="sensortype"
                value={formData.sensortype}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded shadow-md hover:scale-105"
            >
              {editingId ? "Update UOM" : "Add UOM"}
            </button>
          </form>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-4 py-2">UOM Name</th>
                  <th className="px-4 py-2">ABBR</th>
                  <th className="px-4 py-2">ZERO AFTER DECIMAL</th>
                  <th className="px-4 py-2">SENSOR TYPE</th>
                  <th className="px-4 py-2">Edit</th>
                  <th className="px-4 py-2">Delete</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {data?.results?.map((item) => (
                  <tr key={item.uid}>
                    <td className="px-4 py-2">{item.unitmeasurename}</td>
                    <td className="px-4 py-2">{item.abbrivation || "—"}</td>
                    <td className="px-4 py-2">{item.zeroafterdecimal}</td>
                    <td className="px-4 py-2">{item.sensortype || "—"}</td>

                    <td
                      className="px-4 py-2 text-blue-600 cursor-pointer"
                      onClick={() => handleEdit(item)}
                    >
                      ✏ Edit
                    </td>

                    <td
                      className="px-4 py-2 text-red-600 cursor-pointer"
                      onClick={() => handleDeleteRow(item.uid)}
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
    </>
  );
}

export default Unitofmeasurement;
