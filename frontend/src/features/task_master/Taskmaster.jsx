import React, { useState, useMemo } from "react";
import {
  useGetTasksQuery,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "./taskmasterApi";

import { useGetInventoriesQuery } from "../../features/asset/asset_invetory/assetinventryApi";
import { useGetSeveritiesQuery } from "../../features/severity_master/SeveritymasterApi";

function Taskmaster() {
  const [formData, setFormData] = useState({
    machinename: "",
    physicalasset: "",
    taskname: "",
    frequency_days: "",
    severity: "",
    schedulelimitdate: "",
    isBlockrequired: false,
  });

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Fix: Pass empty object as default to avoid undefined errors
  const { data, isLoading } = useGetTasksQuery();
  const { data: AssetInventoryData, isLoading: isLoadingAssets } = useGetInventoriesQuery({});
  const { data: SeverityData, isLoading: isLoadingSeverity } = useGetSeveritiesQuery({});

  // Extract results array from API response
  const AssetInventory = AssetInventoryData?.results || [];
  const Severity = SeverityData?.results || [];

  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  // Helper function to get asset name by id
  const getAssetName = (assetId) => {
    if (!assetId) return "";
    const asset = AssetInventory.find((item) => 
      item.assetinventoryid === assetId || 
      item.assetid === assetId || 
      item.id === assetId
    );
    
    if (!asset) return `Asset #${assetId}`;
    
    // Build a descriptive name from available fields
    const modelInfo = asset.manufacturermodel || "";
    const serialNumber = asset.serialnumber || "";
    const railwayCode = asset.railwaycode || "";
    
    if (modelInfo && serialNumber) {
      return `${modelInfo} (${serialNumber})`;
    } else if (modelInfo) {
      return modelInfo;
    } else if (railwayCode) {
      return railwayCode;
    } else {
      return asset.asset_name || asset.assetname || `Asset #${assetId}`;
    }
  };

  // Helper function to get severity name by id
  const getSeverityName = (severityId) => {
    if (!severityId) return "";
    const severity = Severity.find((item) => item.rid === severityId || item.id === severityId);
    return severity ? (severity.severitystring || severity.name || severity.severity_name || "") : severityId;
  };

  // Filter data based on search input
  const filteredData = useMemo(() => {
    if (!search.trim()) {
      return data?.results || [];
    }

    const searchLower = search.toLowerCase().trim();

    return (data?.results || []).filter((item) => {
      const machineName = (item.machinename || "").toLowerCase();
      const assetName = getAssetName(item.physicalasset).toLowerCase();
      const severityName = getSeverityName(item.severity).toLowerCase();
      const taskName = (item.taskname || "").toLowerCase();
      const frequencyDays = (item.frequency_days || "").toString();
      const scheduleDate = (item.schedulelimitdate || "").toLowerCase();
      const taskMasterId = (item.taskmaster || "").toString();

      return (
        machineName.includes(searchLower) ||
        taskName.includes(searchLower) ||
        assetName.includes(searchLower) ||
        severityName.includes(searchLower) ||
        frequencyDays.includes(searchLower) ||
        scheduleDate.includes(searchLower) ||
        taskMasterId.includes(searchLower)
      );
    });
  }, [data?.results, search, AssetInventory, Severity]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const submitData = {
        ...formData,
        isBlockrequired: formData.isBlockrequired ? 1 : 0, // Convert boolean to integer
      };

      if (editingId) {
        await updateTask({ id: editingId, ...submitData }).unwrap();
        alert("✅ Updated Successfully");
      } else {
        await createTask(submitData).unwrap();
        alert("✅ Task Created");
      }

      setEditingId(null);
      setFormData({
        machinename: "",
        physicalasset: "",
        taskname: "",
        frequency_days: "",
        severity: "",
        schedulelimitdate: "",
        isBlockrequired: false,
      });
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error: " + (error?.data?.message || "Something went wrong"));
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.taskmaster);
    setFormData({
      machinename: item.machinename || "",
      physicalasset: item.physicalasset,
      taskname: item.taskname,
      frequency_days: item.frequency_days,
      severity: item.severity,
      schedulelimitdate: item.schedulelimitdate,
      isBlockrequired: item.isBlockrequired === 1 || item.isBlockrequired === true,
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id).unwrap();
        alert("✅ Task Deleted");
      } catch (error) {
        console.error("Delete error:", error);
        alert("❌ Error deleting task");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      machinename: "",
      physicalasset: "",
      taskname: "",
      frequency_days: "",
      severity: "",
      schedulelimitdate: "",
      isBlockrequired: false,
    });
  };

  if (isLoading || isLoadingAssets || isLoadingSeverity) {
    return (
      <div className="w-full mt-30 bg-gray-100 flex justify-center items-center py-10">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full mt-30 bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-7xl bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-3xl font-bold text-[oklch(0.53_0.27_303.85)] mb-5">
          🚨 Task Master
        </h1>

        {/* SEARCH */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="🔍 Search by machine name, task name, asset, severity..."
            className="border p-2 rounded-md w-full focus:ring focus:ring-blue-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="ml-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
            >
              Clear
            </button>
          )}
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 p-6 rounded-lg shadow-inner"
        >
          {editingId && (
            <div className="md:col-span-2 bg-yellow-100 border border-yellow-400 p-3 rounded">
              ✏️ Editing Task ID: {editingId}
            </div>
          )}

          {/* Machine Name */}
          <div>
            <label className="block mb-1 font-semibold">
              Machine Name
            </label>
            <input
              type="text"
              name="machinename"
              value={formData.machinename}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:ring focus:ring-blue-200"
              placeholder="Enter machine name (optional)"
            />
          </div>

          {/* 🔹 Physical Asset Dropdown */}
          <div>
            <label className="block mb-1 font-semibold">
              Physical Asset <span className="text-red-500">*</span>
            </label>
            <select
              name="physicalasset"
              value={formData.physicalasset}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:ring focus:ring-blue-200"
              required
            >
              <option value="">-- Select Physical Asset --</option>
              {AssetInventory.map((item) => {
                const assetId = item.assetinventoryid || item.assetid || item.id;
                const modelInfo = item.manufacturermodel || "";
                const serialNumber = item.serialnumber || "";
                const railwayCode = item.railwaycode || "";
                
                let displayName = "";
                if (modelInfo && serialNumber) {
                  displayName = `${modelInfo} (${serialNumber})`;
                } else if (modelInfo) {
                  displayName = modelInfo;
                } else if (railwayCode) {
                  displayName = railwayCode;
                } else {
                  displayName = item.asset_name || item.assetname || `Asset #${assetId}`;
                }
                
                return (
                  <option key={assetId} value={assetId}>
                    {displayName}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Task Name */}
          <div>
            <label className="block mb-1 font-semibold">
              Task Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="taskname"
              value={formData.taskname}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:ring focus:ring-blue-200"
              placeholder="Enter task name"
              required
            />
          </div>

          {/* Frequency Days */}
          <div>
            <label className="block mb-1 font-semibold">
              Frequency (Days) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="frequency_days"
              value={formData.frequency_days}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:ring focus:ring-blue-200"
              placeholder="e.g., 30"
              min="1"
              required
            />
          </div>

          {/* 🔹 Severity Dropdown */}
          <div>
            <label className="block mb-1 font-semibold">
              Severity <span className="text-red-500">*</span>
            </label>
            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:ring focus:ring-blue-200"
              required
            >
              <option value="">-- Select Severity --</option>
              {Severity.map((item) => (
                <option key={item.rid || item.id} value={item.rid || item.id}>
                  {item.severitystring || item.name || item.severity_name}
                </option>
              ))}
            </select>
          </div>

          {/* Schedule Limit Date */}
          <div>
            <label className="block mb-1 font-semibold">
              Schedule Limit Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="schedulelimitdate"
              value={formData.schedulelimitdate}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:ring focus:ring-blue-200"
              required
            />
          </div>

          {/* Is Block Required */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isBlockrequired"
              id="isBlockrequired"
              checked={formData.isBlockrequired}
              onChange={handleChange}
              className="w-5 h-5 mr-2"
            />
            <label htmlFor="isBlockrequired" className="font-semibold cursor-pointer">
              Is Block Required?
            </label>
          </div>

          {/* SUBMIT */}
          <div className="flex items-end gap-2 md:col-span-2">
            <button
              type="submit"
              className="bg-[oklch(0.48_0.27_303.85)] text-white px-6 py-2 rounded shadow-md hover:opacity-90 transition"
            >
              {editingId ? "✅ Update Task" : "➕ Add Task"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white px-6 py-2 rounded shadow-md hover:opacity-90 transition"
              >
                ❌ Cancel
              </button>
            )}
          </div>
        </form>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg text-sm shadow-md">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Machine Name</th>
                <th className="px-4 py-2 text-left">Physical Asset</th>
                <th className="px-4 py-2 text-left">Task Name</th>
                <th className="px-4 py-2 text-left">Frequency (Days)</th>
                <th className="px-4 py-2 text-left">Severity</th>
                <th className="px-4 py-2 text-left">Schedule Date</th>
                <th className="px-4 py-2 text-center">Block Required</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.taskmaster} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2">{item.taskmaster}</td>
                    <td className="px-4 py-2 font-medium">{item.machinename || "-"}</td>
                    <td className="px-4 py-2">{getAssetName(item.physicalasset)}</td>
                    <td className="px-4 py-2">{item.taskname}</td>
                    <td className="px-4 py-2">{item.frequency_days}</td>
                    <td className="px-4 py-2">{getSeverityName(item.severity)}</td>
                    <td className="px-4 py-2">{item.schedulelimitdate}</td>
                    <td className="px-4 py-2 text-center">
                      {item.isBlockrequired === 1 || item.isBlockrequired === true ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">✅ Yes</span>
                      ) : (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">❌ No</span>
                      )}
                    </td>

                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:underline mr-3"
                        title="Edit"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.taskmaster)}
                        className="text-red-600 hover:underline"
                        title="Delete"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                    {search ? "🔍 No tasks found matching your search." : "📝 No tasks available. Create one above!"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-gray-600 text-sm">
          Showing {filteredData.length} of {data?.count || data?.results?.length || 0} tasks
          {search && ` (filtered by "${search}")`}
        </p>
      </div>
    </div>
  );
}

export default Taskmaster;