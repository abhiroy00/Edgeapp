import React, { useEffect, useState } from "react";

export default function Zone() {
  const [zones, setZones] = useState([]);
  const [formData, setFormData] = useState({
    zonename: "",
    zonedesc: "",
    prefixcode: "",
    is_active: true,
  });
  const [editingId, setEditingId] = useState(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Fetch zones
  useEffect(() => {
    fetchZones();
  }, []);

  async function fetchZones() {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/zones/");
      const data = await res.json();
      setZones(data);
    } catch (error) {
      console.error("Error fetching zones:", error);
    }
  }

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "is_active" ? value === "true" : value,
    });
  };

  // Handle submit (POST or PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        const res = await fetch(
          `http://127.0.0.1:8000/api/zones/${editingId}/`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );

        if (res.ok) {
          const updatedZone = await res.json();
          setZones(
            zones.map((zone) =>
              zone.zoneid === editingId ? updatedZone : zone
            )
          );
          setEditingId(null);
        }
      } else {
        const res = await fetch("http://127.0.0.1:8000/api/zones/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          const newZone = await res.json();
          setZones([...zones, newZone]);
        }
      }

      // Reset form
      setFormData({
        zonename: "",
        zonedesc: "",
        prefixcode: "",
        is_active: true,
      });
    } catch (error) {
      console.error("Error saving zone:", error);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this zone?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/zones/${id}/`, {
        method: "DELETE",
      });

      if (res.status === 204) {
        setZones(zones.filter((zone) => zone.zoneid !== id));
      }
    } catch (error) {
      console.error("Error deleting zone:", error);
    }
  };

  // Handle edit
  const handleEdit = (zone) => {
    setFormData({
      zonename: zone.zonename,
      zonedesc: zone.zonedesc,
      prefixcode: zone.prefixcode,
      is_active: zone.is_active,
    });
    setEditingId(zone.zoneid);
  };

  // Pagination
  const totalPages = Math.ceil(zones.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedZones = zones.slice(startIndex, startIndex + pageSize);

  return (
    <div className="w-full p-8 mt-10">
      {/* Header */}
      <div className="w-full mt-30 shadow-lg rounded-lg p-6 mb-8 bg-green-100 border border-green-300">
        <h1 className="text-green-700 text-3xl font-bold">Zone Management</h1>
        <p className="text-gray-700 mt-1">
          Add, update, delete, and manage zones.
        </p>
      </div>

      {/* Zone Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-6 w-full space-y-5"
      >
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Zone Name
          </label>
          <input
            type="text"
            name="zonename"
            value={formData.zonename}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Zone Description
          </label>
          <textarea
            name="zonedesc"
            value={formData.zonedesc}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Prefix Code
          </label>
          <input
            type="text"
            name="prefixcode"
            value={formData.prefixcode}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Active?
          </label>
          <select
            name="is_active"
            value={formData.is_active}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
        >
          {editingId ? "✏️ Update Zone" : "➕ Add Zone"}
        </button>
      </form>

      {/* Zone List */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-green-700 mb-5">
          Existing Zones
        </h2>
        <ul className="space-y-4">
          {paginatedZones.map((zone) => (
            <li
              key={zone.zoneid}
              className="bg-gray-50 border rounded-lg p-5 flex justify-between items-center shadow-sm"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {zone.zonename}
                </h3>
                <p className="text-gray-600 text-sm mt-1">{zone.zonedesc}</p>
                <span className="text-sm text-gray-500">
                  Prefix: {zone.prefixcode}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    zone.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {zone.is_active ? "Active" : "Inactive"}
                </span>
                <button
                  onClick={() => handleEdit(zone)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(zone.zoneid)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-3 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Prev
          </button>
          <span className="font-semibold">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
