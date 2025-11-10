import React, { useState } from "react";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "./userApi";

import { useGetUserTypesQuery } from "../user_type/userTypeApi";
import { useGetUserLevelsQuery } from "../user_level/userLevelApi";
import { useGetUserRolesQuery } from "../user_role/userRoleApi";
import { useGetZonesQuery } from "../../location/zone/zoneApi";
import { useGetDivisionsQuery } from "../../location/division/divisionApi";
import { useGetAllStationsQuery } from "../../location/station/stationApi";

export default function Users() {
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const [formData, setFormData] = useState({
    usertype: "",
    userlevel: "",
    userrole: "",
    username: "",
    userphone: "",
    usermail: "",
    userdesignation: "",
    alertrecipient: 0,
    zone: "",
    division: "",
    station: "",
    password: "",
    is_active: true,
    sendsms: 0,
  });

  const [editingId, setEditingId] = useState(null);

  // Fetch dropdown data
  const { data: userTypes } = useGetUserTypesQuery();
  const { data: userLevels } = useGetUserLevelsQuery();
  const { data: userRoles } = useGetUserRolesQuery();
  const { data: zones } = useGetZonesQuery();
  const { data: divisions } = useGetDivisionsQuery();
  const { data: stations } = useGetAllStationsQuery();

  // CRUD hooks
  const { data: users, isLoading } = useGetUsersQuery({ page, pageSize });
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateUser({ id: editingId, ...formData });
      setEditingId(null);
    } else {
      await createUser(formData);
    }
    setFormData({
      usertype: "",
      userlevel: "",
      userrole: "",
      username: "",
      userphone: "",
      usermail: "",
      userdesignation: "",
      alertrecipient: 0,
      zone: "",
      division: "",
      station: "",
      password: "",
      is_active: true,
      sendsms: 0,
    });
  };

  const handleEdit = (user) => {
    setFormData({
      usertype: user.usertype,
      userlevel: user.userlevel,
      userrole: user.userrole,
      username: user.username,
      userphone: user.userphone,
      usermail: user.usermail,
      userdesignation: user.userdesignation,
      alertrecipient: user.alertrecipient,
      zone: user.zone,
      division: user.division,
      station: user.station,
      password: user.password,
      is_active: user.is_active,
      sendsms: user.sendsms,
    });
    setEditingId(user.userid);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(id);
    }
  };

  // Helper to handle both plain arrays and paginated { results: [] }
  const normalizeData = (d) => (d?.results ? d.results : d) || [];

  return (
    <div className="p-6 mt-10 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="usertype"
            value={formData.usertype || ""}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select User Type</option>
            {normalizeData(userTypes).map((ut) => (
              <option key={ut.typeid} value={ut.typeid}>
                {ut.typename}
              </option>
            ))}
          </select>

          <select
            name="userlevel"
            value={formData.userlevel || ""}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select User Level</option>
            {normalizeData(userLevels).map((lvl) => (
              <option key={lvl.levelid} value={lvl.levelid}>
                {lvl.levelname}
              </option>
            ))}
          </select>

          <select
            name="userrole"
            value={formData.userrole || ""}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select User Role</option>
            {normalizeData(userRoles).map((role) => (
              <option key={role.roleid} value={role.roleid}>
                {role.rolename}
              </option>
            ))}
          </select>

          <select
            name="zone"
            value={formData.zone || ""}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select Zone</option>
            {normalizeData(zones).map((z) => (
              <option key={z.zoneid} value={z.zoneid}>
                {z.zonename}
              </option>
            ))}
          </select>

          <select
            name="division"
            value={formData.division || ""}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select Division</option>
            {normalizeData(divisions).map((d) => (
              <option key={d.divisionid} value={d.divisionid}>
                {d.divisionname}
              </option>
            ))}
          </select>

          <select
            name="station"
            value={formData.station || ""}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select Station</option>
            {normalizeData(stations).map((s) => (
              <option key={s.stationid} value={s.stationid}>
                {s.stationname}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="username"
            placeholder="Full Name"
            value={formData.username}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="userphone"
            placeholder="Phone"
            value={formData.userphone}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="email"
            name="usermail"
            placeholder="Email"
            value={formData.usermail}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="userdesignation"
            placeholder="Designation"
            value={formData.userdesignation}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {editingId ? "Update User" : "Add User"}
        </button>
      </form>

      {/* Table */}
      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 border">Name</th>
              <th className="px-3 py-2 border">Email</th>
              <th className="px-3 py-2 border">Designation</th>
              <th className="px-3 py-2 border">Zone</th>
              <th className="px-3 py-2 border">Division</th>
              <th className="px-3 py-2 border">Station</th>
              <th className="px-3 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : (
              users?.results?.map((u) => (
                <tr key={u.userid} className="hover:bg-gray-50">
                  <td className="px-3 py-2 border">{u.username}</td>
                  <td className="px-3 py-2 border">{u.usermail}</td>
                  <td className="px-3 py-2 border">{u.userdesignation}</td>
                  <td className="px-3 py-2 border">{u.zone_name}</td>
                  <td className="px-3 py-2 border">{u.division_name}</td>
                  <td className="px-3 py-2 border">{u.station_name}</td>
                  <td className="px-3 py-2 border flex space-x-2">
                    <button
                      onClick={() => handleEdit(u)}
                      className="bg-yellow-400 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(u.userid)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-4 space-x-4">
          <button
            disabled={!users?.previous}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {Math.ceil(users?.count / pageSize) || 1}
          </span>
          <button
            disabled={!users?.next}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
