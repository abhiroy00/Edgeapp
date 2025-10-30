import React, { useState } from "react";
import {
  useGetAssetsQuery,
  useCreateAssetMutation,
  useUpdateAssetMutation,
  useDeleteAssetMutation,
} from "./assetmasterApi";

function AssetMaster() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    assetname: "",
    asssetprefix: "",
    assetstatus: "",
  });

  const { data, isLoading, isError } = useGetAssetsQuery({
    page,
    pageSize: 5,
    search,
  });

  const [createAsset] = useCreateAssetMutation();
  const [updateAsset] = useUpdateAssetMutation();
  const [deleteAsset] = useDeleteAssetMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateAsset({ assetid: editingId, ...formData });
      } else {
        await createAsset(formData);
      }

      setFormData({ assetname: "", asssetprefix: "", assetstatus: "" });
      setEditingId(null);
    } catch (err) {
      console.error("Error submitting asset:", err);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.assetid);
    setFormData({
      assetname: item.assetname,
      asssetprefix: item.asssetprefix,
      assetstatus: item.assetstatus,
    });
  };

  const handleDelete = async (assetid) => {
    if (window.confirm("Are you sure to delete?")) {
      await deleteAsset(assetid);
    }
  };

  return (
    <div className="w-full mt-30 min-h-screen bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-7xl bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-3xl font-bold text-[oklch(0.53_0.27_303.85)] mb-5">
          🛤️ Asset Master
        </h1>

        {/* Search */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="🔍 Search asset..."
            className="border p-2 rounded-md w-full focus:ring focus:ring-blue-300"
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
              Asset Name
            </label>
            <input
              type="text"
              name="assetname"
              value={formData.assetname}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">
              Prefix Code
            </label>
            <input
              type="text"
              name="asssetprefix"
              value={formData.asssetprefix}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">Status</label>
            <input
              type="text"
              name="assetstatus"
              value={formData.assetstatus}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="bg-[oklch(0.48_0.27_303.85)] text-white px-6 py-2 rounded shadow-md transition"
            >
              {editingId ? "Update Asset" : "Add Asset"}
            </button>
          </div>
        </form>

        {/* Loading / Error */}
        {isLoading && <p className="text-center text-blue-600">Loading...</p>}
        {isError && (
          <p className="text-center text-red-600">Failed to fetch data</p>
        )}

        {/* Table */}
        {!isLoading && data?.results?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg text-sm shadow-md">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-4 py-2">Asset Name</th>
                  <th className="px-4 py-2">Prefix Code</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Edit</th>
                  <th className="px-4 py-2">Delete</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {data?.results?.map((item) => (
                  <tr key={item.assetid} className="hover:bg-fuchsia-50">
                    <td className="px-4 py-2">{item.assetname}</td>
                    <td className="px-4 py-2">{item.asssetprefix}</td>
                    <td className="px-4 py-2">{item.assetstatus}</td>

                    <td
                      className="px-4 py-2 text-blue-600 cursor-pointer"
                      onClick={() => handleEdit(item)}
                    >
                      ✏ Edit
                    </td>

                    <td
                      className="px-4 py-2 text-red-600 cursor-pointer"
                      onClick={() => handleDelete(item.assetid)}
                    >
                      🗑 Delete
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !isLoading && (
            <p className="text-center text-gray-500 pt-3">No data found</p>
          )
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
          <p>
            Showing {data?.results?.length || 0} of {data?.count || 0} entries
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={!data?.previous}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 border rounded-md disabled:opacity-50"
            >
              ⬅ Prev
            </button>

            <span>Page {page}</span>

            <button
              disabled={!data?.next}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded-md disabled:opacity-50"
            >
              Next ➡
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssetMaster;
