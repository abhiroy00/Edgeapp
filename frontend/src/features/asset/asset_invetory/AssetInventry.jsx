import React, { useState } from "react";
import {
  useGetInventoriesQuery,
  useCreateInventoryMutation,
  useUpdateInventoryMutation,
  useDeleteInventoryMutation,
} from "./assetinventryApi";

import { useGetAssetsQuery } from "../../asset/asset_master/assetmasterApi";
import {useGetJunctionBoxesQuery} from "../../location/rack/rackApi";

export default function AssetInventry() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    assetid: "",
    junctionid: "",
    manufacturermodel: "",
    manufactureddate: "",
    manufactureyear: "",
    serialnumber: "",
    lattitude: "",
    longitude: "",
    railwaycode: "",
    isRDPMSasset: "",
    is_active: true,
  });

  // ✅ API hooks
  const { data, isLoading, refetch } = useGetInventoriesQuery({ search, page });
  const { data: assets } = useGetAssetsQuery();
  const { data: junctions } = useGetJunctionBoxesQuery();
  const [createInventory] = useCreateInventoryMutation();
  const [updateInventory] = useUpdateInventoryMutation();
  const [deleteInventory] = useDeleteInventoryMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateInventory({ id: editingId, ...formData }).unwrap();
        alert("✅ Updated successfully!");
      } else {
        await createInventory(formData).unwrap();
        alert("✅ Created successfully!");
      }
      setEditingId(null);
      refetch();
      setFormData({
        assetid: "",
        junctionid: "",
        manufacturermodel: "",
        manufactureddate: "",
        manufactureyear: "",
        serialnumber: "",
        lattitude: "",
        longitude: "",
        railwaycode: "",
        isRDPMSasset: "",
        is_active: true,
      });
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Something went wrong!");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.assetinventoryid);
    setFormData({ ...item });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteInventory(id);
      refetch();
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div className="w-full mt-30 bg-gray-100 flex justify-center py-10">
        <div className="w-full max-w-7xl bg-white shadow-xl rounded-lg p-8">
          <h1 className="text-3xl font-bold text-[oklch(0.53_0.27_303.85)] mb-5">
            🚉 Inventory Master
          </h1>

          {/* Search */}
          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="🔍 Search inventory..."
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
            {/* Logical Asset Dropdown */}
            <div>
              <label className="block mb-1 text-sm font-semibold">
                Logical Asset ID
              </label>
              <select
                value={formData.assetid}
                onChange={(e) =>
                  setFormData({ ...formData, assetid: e.target.value })
                }
                className="border p-2 w-full rounded focus:ring focus:ring-blue-300"
                required
              >
                <option value="">-- Select Logical Asset --</option>
                {(assets?.results || assets || []).map((a) => (
                  <option key={a.assetid} value={a.assetid}>
                    {a.assetname}
                  </option>
                ))}
              </select>
            </div>

            {/* Junction ID Dropdown */}
            <div>
              <label className="block mb-1 text-sm font-semibold">
                Junction ID
              </label>
              <select
                value={formData.junctionid}
                onChange={(e) =>
                  setFormData({ ...formData, junctionid: e.target.value })
                }
                className="border p-2 w-full rounded focus:ring focus:ring-blue-300"
                required
              >
                <option value="">-- Select Junction --</option>
                {(junctions?.results || junctions || []).map((j) => (
                  <option key={j.junctionid} value={j.junctionid}>
                    {j.junctionname}
                  </option>
                ))}
              </select>
            </div>

            {/* Manufacture Model */}
            <div>
              <label className="block mb-1 text-sm font-semibold">
                Manufacture Model
              </label>
              <input
                type="text"
                value={formData.manufacturermodel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    manufacturermodel: e.target.value,
                  })
                }
                className="border p-2 w-full rounded focus:ring focus:ring-blue-300"
                required
              />
            </div>

            {/* Manufacture Date */}
            <div>
              <label className="block mb-1 text-sm font-semibold">
                Manufacture Date
              </label>
              <input
                type="date"
                value={formData.manufactureddate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    manufactureddate: e.target.value,
                  })
                }
                className="border p-2 w-full rounded focus:ring focus:ring-blue-300"
                required
              />
            </div>

            {/* Manufacture Year */}
            <div>
              <label className="block mb-1 text-sm font-semibold">
                Manufacture Year
              </label>
              <input
                type="number"
                value={formData.manufactureyear}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    manufactureyear: e.target.value,
                  })
                }
                className="border p-2 w-full rounded focus:ring focus:ring-blue-300"
                required
              />
            </div>

            {/* Serial Number */}
            <div>
              <label className="block mb-1 text-sm font-semibold">
                Serial Number
              </label>
              <input
                type="text"
                value={formData.serialnumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    serialnumber: e.target.value,
                  })
                }
                className="border p-2 w-full rounded focus:ring focus:ring-blue-300"
                required
              />
            </div>

            {/* Latitude */}
            <div>
              <label className="block mb-1 text-sm font-semibold">
                Latitude
              </label>
              <input
                type="text"
                value={formData.lattitude}
                onChange={(e) =>
                  setFormData({ ...formData, lattitude: e.target.value })
                }
                className="border p-2 w-full rounded focus:ring focus:ring-blue-300"
                required
              />
            </div>

            {/* Longitude */}
            <div>
              <label className="block mb-1 text-sm font-semibold">
                Longitude
              </label>
              <input
                type="text"
                value={formData.longitude}
                onChange={(e) =>
                  setFormData({ ...formData, longitude: e.target.value })
                }
                className="border p-2 w-full rounded focus:ring focus:ring-blue-300"
                required
              />
            </div>

            {/* Railway Code */}
            <div>
              <label className="block mb-1 text-sm font-semibold">
                Railway Code
              </label>
              <input
                type="text"
                value={formData.railwaycode}
                onChange={(e) =>
                  setFormData({ ...formData, railwaycode: e.target.value })
                }
                className="border p-2 w-full rounded focus:ring focus:ring-blue-300"
                required
              />
            </div>

            {/* RDPMS Asset */}
            <div>
              <label className="block mb-1 text-sm font-semibold">
                RDPMS Asset
              </label>
              <input
                type="text"
                value={formData.isRDPMSasset}
                onChange={(e) =>
                  setFormData({ ...formData, isRDPMSasset: e.target.value })
                }
                className="border p-2 w-full rounded focus:ring focus:ring-blue-300"
                required
              />
            </div>

            {/* Is Active */}
            <div>
              <label className="block mb-1 text-sm font-semibold">Is Active</label>
              <select
                value={formData.is_active}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_active: e.target.value === "true",
                  })
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
                {editingId ? "Update Inventory" : "Add Inventory"}
              </button>
            </div>
          </form>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg text-sm shadow-md">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-4 py-2">Logical Asset</th>
                  <th className="px-4 py-2">Junction</th>
                  <th className="px-4 py-2">Model</th>
                  <th className="px-4 py-2">Serial</th>
                  <th className="px-4 py-2">Year</th>
                  <th className="px-4 py-2">Latitude</th>
                  <th className="px-4 py-2">Longitude</th>
                  <th className="px-4 py-2">Railway Code</th>
                  <th className="px-4 py-2">RDPMS</th>
                  <th className="px-4 py-2">Edit</th>
                  <th className="px-4 py-2">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.results?.map((item) => (
                  <tr key={item.assetinventoryid}>
                    <td className="px-4 py-2">{item.assetid}</td>
                    <td className="px-4 py-2">{item.junctionid}</td>
                    <td className="px-4 py-2">{item.manufacturermodel}</td>
                    <td className="px-4 py-2">{item.serialnumber}</td>
                    <td className="px-4 py-2">{item.manufactureyear}</td>
                    <td className="px-4 py-2">{item.lattitude}</td>
                    <td className="px-4 py-2">{item.longitude}</td>
                    <td className="px-4 py-2">{item.railwaycode}</td>
                    <td className="px-4 py-2">{item.isRDPMSasset}</td>
                    <td
                      className="px-4 py-2 text-blue-600 cursor-pointer hover:underline"
                      onClick={() => handleEdit(item)}
                    >
                      ✏️ Edit
                    </td>
                    <td
                      className="px-4 py-2 text-red-600 cursor-pointer hover:underline"
                      onClick={() => handleDelete(item.assetinventoryid)}
                    >
                      🗑️ Delete
                    </td>
                  </tr>
                ))}
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
    </div>
  );
}
