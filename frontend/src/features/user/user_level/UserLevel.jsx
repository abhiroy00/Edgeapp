import React, { useState } from "react";
import {
  useGetUserLevelsQuery,
  useCreateUserLevelMutation,
  useUpdateUserLevelMutation,
  useDeleteUserLevelMutation,
} from "./userLevelApi";

export default function UserLevel() {
  const [formData, setFormData] = useState({
    levelname: "",
    is_active: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // RTK Hooks
  const { data, isLoading } = useGetUserLevelsQuery({ page, pageSize });
  const [createUserLevel] = useCreateUserLevelMutation();
  const [updateUserLevel] = useUpdateUserLevelMutation();
  const [deleteUserLevel] = useDeleteUserLevelMutation();

  const levels = data?.results || [];
  const totalPages = Math.ceil((data?.count || 0) / pageSize);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "is_active" ? value === "true" : value,
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateUserLevel({ id: editingId, ...formData });
      setEditingId(null);
    } else {
      await createUserLevel(formData);
    }
    setFormData({ levelname: "", is_active: true });
  };

  // Edit handler
  const handleEdit = (level) => {
    setFormData({
      levelname: level.levelname,
      is_active: level.is_active,
    });
    setEditingId(level.levelid);
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteUserLevel(id);
    }
  };

  return (
    <div className="w-full p-8 mt-30">
      {/* Header */}
      <div className="w-full shadow-lg rounded-lg p-6 mb-8 bg-blue-100 border border-blue-300">
        <h1 className="text-3xl font-bold text-blue-700">User Level Master</h1>
        <p className="text-gray-700 mt-1">Manage user levels.</p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-6 w-full space-y-5"
      >
        <input
          type="text"
          name="levelname"
          value={formData.levelname}
          onChange={handleChange}
          placeholder="Level Name"
          required
          className="w-full border rounded-lg p-3"
        />
        <select
          name="is_active"
          value={formData.is_active}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg"
        >
          {editingId ? "✏️ Update Level" : "➕ Add Level"}
        </button>
      </form>

      {/* List */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-blue-700 mb-5">
          Existing Levels
        </h2>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul className="space-y-4">
            {levels.map((level) => (
              <li
                key={level.levelid}
                className="bg-gray-50 border rounded-lg p-5 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-semibold">{level.levelname}</h3>
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      level.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {level.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleEdit(level)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(level.levelid)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-3 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Prev
          </button>
          <span className="font-semibold">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
