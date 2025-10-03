import React, { useState } from "react";
import {
  useGetUserRolesQuery,
  useCreateUserRoleMutation,
  useUpdateUserRoleMutation,
  useDeleteUserRoleMutation,
} from "./userRoleApi";
import { useGetUserTypesQuery } from "../user_type/userTypeApi";

export default function UserRole() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    roletype: "",
    rolename: "",
    roledesc: "",
    is_active: "true",
  });
  const [editingId, setEditingId] = useState(null);

  // API hooks
  const { data, isLoading } = useGetUserRolesQuery({ page, pageSize: 5, search });
  const { data: userTypes } = useGetUserTypesQuery();
  const [createRole] = useCreateUserRoleMutation();
  const [updateRole] = useUpdateUserRoleMutation();
  const [deleteRole] = useDeleteUserRoleMutation();

  // handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateRole({ id: editingId, ...formData }).unwrap();
      } else {
        await createRole(formData).unwrap();
      }
      setFormData({ roletype: "", rolename: "", roledesc: "", is_active: "true" });
      setEditingId(null);
    } catch (error) {
      console.error("Error saving role:", error);
    }
  };

  // edit role
  const handleEdit = (role) => {
    setEditingId(role.roleid);
    setFormData({
      roletype: role.roletype,
      rolename: role.rolename,
      roledesc: role.roledesc,
      is_active: role.is_active ? "true" : "false",
    });
  };

  // delete role
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      await deleteRole(id);
    }
  };

  return (
    <div className="w-full mt-10 min-h-screen bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-7xl bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-5">🧑‍🌾 User Role</h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search role..."
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
            <label className="block mb-1 text-sm font-semibold">User Type</label>
            <select
              name="roletype"
              value={formData.roletype}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:ring focus:ring-fuchsia-300"
              required
            >
              <option value="">Select User Type</option>
              {userTypes?.results?.map((ut) => (
                <option key={ut.typeid} value={ut.typeid}>
                  {ut.typename}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sm">Role Name</label>
            <input
              type="text"
              name="rolename"
              value={formData.rolename}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sm">Description</label>
            <input
              type="text"
              name="roledesc"
              value={formData.roledesc}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:ring focus:ring-blue-300"
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow-md transition"
            >
              {editingId ? "Update Role" : "Add Role"}
            </button>
          </div>
        </form>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg text-sm shadow-md">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-2">User Type</th>
                <th className="px-4 py-2">Role Name</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Active</th>
                <th className="px-4 py-2">Edit</th>
                <th className="px-4 py-2">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : (
                data?.results?.map((role) => (
                  <tr key={role.roleid} className="hover:bg-blue-50">
                    {/* ✅ Show typename instead of id */}
                    <td className="px-4 py-2">{role.roletype_name}</td>
                    <td className="px-4 py-2">{role.rolename}</td>
                    <td className="px-4 py-2">{role.roledesc}</td>
                    <td className="px-4 py-2">
                      {role.is_active ? "✅ Yes" : "❌ No"}
                    </td>
                    <td
                      className="px-4 py-2 text-blue-600 cursor-pointer hover:underline"
                      onClick={() => handleEdit(role)}
                    >
                      ✏️ Edit
                    </td>
                    <td
                      className="px-4 py-2 text-red-600 cursor-pointer hover:underline"
                      onClick={() => handleDelete(role.roleid)}
                    >
                      🗑️ Delete
                    </td>
                  </tr>
                ))
              )}
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
