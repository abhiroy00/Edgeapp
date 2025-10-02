import React, { useState } from "react";
import {
  useGetUserTypesQuery,
  useCreateUserTypeMutation,
  useUpdateUserTypeMutation,
  useDeleteUserTypeMutation,
} from "./userTypeApi";

export default function UserType() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({ typename: "", is_active: true });
  const [editingId, setEditingId] = useState(null);

  const { data, isLoading, isError } = useGetUserTypesQuery({
    page,
    page_size: 5,
    search,
  });

  const [createUserType] = useCreateUserTypeMutation();
  const [updateUserType] = useUpdateUserTypeMutation();
  const [deleteUserType] = useDeleteUserTypeMutation();

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
      await updateUserType({ id: editingId, ...formData });
      setEditingId(null);
    } else {
      await createUserType(formData);
    }
    setFormData({ typename: "", is_active: true });
  };

  const handleEdit = (usertype) => {
    setFormData(usertype);
    setEditingId(usertype.typeid);
  };

  const handleDelete = async (id) => {
    await deleteUserType(id);
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (isError) return <p className="text-center mt-10 text-red-600">Error loading user types.</p>;

  return (
    <div className="w-full mt-30 min-h-screen bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-7xl bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-3xl font-bold text-[oklch(0.53_0.27_303.85)] mb-5">
        🧑‍🌾 User Types
        </h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search user type..."
          className="border p-2 rounded-md w-full mb-6 focus:ring focus:ring-blue-300"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 p-6 rounded-lg shadow-inner"
        >
          <div>
            <label className="block mb-1 font-semibold text-sm">User Type Name</label>
            <input
              type="text"
              name="typename"
              value={formData.typename}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sm">Is Active</label>
            <select
              name="is_active"
              value={formData.is_active}
              onChange={handleChange}
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
              {editingId ? "Update User Type" : "Add User Type"}
            </button>
          </div>
        </form>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg text-sm shadow-md">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-2">User Type Name</th>
                <th className="px-4 py-2">Active</th>
                <th className="px-4 py-2">Edit</th>
                <th className="px-4 py-2">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data?.results?.map((usertype) => (
                <tr key={usertype.typeid} className="hover:bg-blue-50">
                  <td className="px-4 py-2">{usertype.typename}</td>
                  <td className="px-4 py-2">
                    {usertype.is_active ? "✅ Yes" : "❌ No"}
                  </td>
                  <td
                    className="px-4 py-2 text-blue-600 cursor-pointer hover:underline"
                    onClick={() => handleEdit(usertype)}
                  >
                    ✏️ Edit
                  </td>
                  <td
                    className="px-4 py-2 text-red-600 cursor-pointer hover:underline"
                    onClick={() => handleDelete(usertype.typeid)}
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
  );
}
