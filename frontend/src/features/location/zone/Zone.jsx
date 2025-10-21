import React, { useState } from "react";
import {
  useGetZonesQuery,
  useCreateZoneMutation,
  useUpdateZoneMutation,
  useDeleteZoneMutation,
} from "./zoneApi";

export default function Zone() {
  const [formData, setFormData] = useState({
    zonename: "",
    zonedesc: "",
    prefixcode: "",
    is_active: true,
  });
  const [editingId, setEditingId] = useState(null);

  // RTK Query hooks
  const { data = [], isLoading } = useGetZonesQuery();
  const [createZone] = useCreateZoneMutation();
  const [updateZone] = useUpdateZoneMutation();
  const [deleteZone] = useDeleteZoneMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "is_active" ? value === "true" : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateZone({ id: editingId, ...formData });
      setEditingId(null);
    } else {
      await createZone(formData);
    }
    setFormData({ zonename: "", zonedesc: "", prefixcode: "", is_active: true });
  };

  const handleEdit = (zone) => {
    setFormData({
      zonename: zone.zonename,
      zonedesc: zone.zonedesc,
      prefixcode: zone.prefixcode,
      is_active: zone.is_active,
    });
    setEditingId(zone.zoneid);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this zone?")) {
      await deleteZone(id);
    }
  };

  return (
    <div className="w-full p-8 mt-10">
      <div className="w-full shadow-lg rounded-lg p-6 mb-8 bg-blue-100 border border-blue-300">
        <h1 className="text-3xl font-bold text-[oklch(0.45_0.15_323.42)]">🌍 Zone Master</h1>
        <p className="text-gray-700 mt-1">Manage your zones.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-xl p-6 w-full space-y-5 border border-gray-200">
        <input type="text" name="zonename" value={formData.zonename} onChange={handleChange} placeholder="Zone Name" required className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-fuchsia-300 outline-none" />
        <textarea name="zonedesc" value={formData.zonedesc} onChange={handleChange} placeholder="Zone Description" className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-fuchsia-300 outline-none" />
        <input type="text" name="prefixcode" value={formData.prefixcode} onChange={handleChange} placeholder="Prefix Code" required className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-fuchsia-300 outline-none" />
        <select name="is_active" value={formData.is_active} onChange={handleChange} className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-fuchsia-300 outline-none">
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <button type="submit" className={`w-full py-3 rounded-lg text-white ${editingId ? "bg-[oklch(0.45_0.15_323.42)] hover:bg-[oklch(0.42_0.15_323.42)]" : "bg-[oklch(0.45_0.15_323.42)] hover:bg-[oklch(0.42_0.15_323.42)]"}`}>
          {editingId ? "✏️ Update Zone" : "➕ Add Zone"}
        </button>
      </form>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-[oklch(0.53_0.27_303.85)] mb-5">📋 Existing Zones</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : data.length === 0 ? (
          <p>No zones found.</p>
        ) : (
          <ul className="space-y-4">
            {data.map((zone) => (
              <li key={zone.zoneid} className="bg-white shadow-md border rounded-lg p-5 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold">{zone.zonename}</h3>
                  <p className="text-gray-600 text-sm">{zone.zonedesc}</p>
                  <span className={`text-xs px-2 py-1 rounded ${zone.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {zone.is_active ? "Active" : "Inactive"}
                  </span>
                  <p className="text-gray-500 text-sm mt-1">Prefix: {zone.prefixcode}</p>
                </div>
                <div className="flex space-x-3">
                  <button onClick={() => handleEdit(zone)} className="px-3 py-1 bg-blue-500 text-white rounded-lg">Edit</button>
                  <button onClick={() => handleDelete(zone.zoneid)} className="px-3 py-1 bg-red-500 text-white rounded-lg">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
