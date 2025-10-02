import React, { useState } from "react";
import { Plus } from "lucide-react";
import {
  useGetDivisionsQuery,
  useGetZonesQuery,
  useCreateDivisionMutation,
  useDeleteDivisionMutation,
} from "./divisionApi";

export default function Division() {
  const { data: divisions = [], isLoading: loadingDivisions } = useGetDivisionsQuery();
  const { data: zones = [], isLoading: loadingZones } = useGetZonesQuery();

  const [createDivision] = useCreateDivisionMutation();
  const [deleteDivision] = useDeleteDivisionMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    prefix: "",
    zoneId: "",
    isActive: "true",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createDivision(formData).unwrap();
      setFormData({ name: "", description: "", prefix: "", zoneId: "", isActive: "true" });
    } catch (err) {
      console.error("❌ Error creating division:", err);
      alert("Failed to add division. Check API.");
    }
  };

const handleDelete = async (divisionid) => {
  if (!divisionid) return alert("Division ID not found!");
  if (window.confirm("Are you sure you want to delete this division?")) {
    try {
      await deleteDivision(divisionid).unwrap();
      alert("Division deleted successfully!");
    } catch (err) {
      console.error("❌ Error deleting division:", err);
      alert("Failed to delete division. Check API.");
    }
  }
};


  if (loadingDivisions || loadingZones) return <p>Loading...</p>;

  return (
    <div className="p-6 mt-30">
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-2xl p-6 mb-6 space-y-4"
      >
        <h2 className="text-xl font-bold text-fuchsia-700 mb-7">🏛️ Add Division</h2>

        <div>
          <label className="block text-gray-700">Division Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-fuchsia-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Division Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-fuchsia-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Zone</label>
          <select
            name="zoneId"
            value={formData.zoneId}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-fuchsia-500"
            required
          >
            <option value="">Select Zone</option>
            {zones.map((zone) => (
              <option key={zone.zoneid} value={zone.zoneid}>
                {zone.zonename}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700">Prefix Code</label>
          <input
            type="text"
            name="prefix"
            value={formData.prefix}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-fuchsia-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Is Active</label>
          <select
            name="isActive"
            value={formData.isActive}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-fuchsia-500"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
<button
  type="submit"
  className="p-2 flex items-center justify-center gap-2 rounded-md mt-4 w-full text-center bg-[oklch(0.45_0.15_323.42)] hover:bg-[oklch(0.40_0.15_323.42)] text-white transition duration-300 ease-in-out"
>
  <Plus size={18} /> <span className="font-bold">Add Division</span>
</button>
      </form>

      {/* Table */}
      <div className="w-full bg-white shadow-2xl rounded-2xl p-6">
        <h2 className="text-xl font-bold text-[oklch(0.45_0.15_323.42)] mb-6">📋 Division List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg text-sm">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Prefix</th>
                <th className="px-4 py-2 text-left">Under Zone</th>
                <th className="px-4 py-2 text-left">Active</th>
                <th className="px-4 py-2 text-left">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
 {divisions.map((div) => (
  <tr key={div.divisionid} className="hover:bg-fuchsia-50">
    <td className="px-4 py-2">{div.divisionname}</td>
    <td className="px-4 py-2">{div.divisiondesc}</td>
    <td className="px-4 py-2">{div.prefixcode}</td>
    <td className="px-4 py-2">{div.zone?.zonename}</td>
    <td className="px-4 py-2">{div.is_active ? "✅" : "❌"}</td>
    <td
      className="px-4 py-2 text-red-600 cursor-pointer"
      onClick={() => handleDelete(div.divisionid)}
    >
      🗑️
    </td>
  </tr>
))}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
