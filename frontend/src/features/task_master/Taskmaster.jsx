import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetTasksQuery,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "./taskmasterApi";
import { useGetInventoriesQuery } from "../../features/asset/asset_invetory/assetinventryApi";
import { useGetSeveritiesQuery } from "../../features/severity_master/SeveritymasterApi";
import { useGenerateScheduleMutation } from "../task_assign/taskAssignmentApi";
import { useGetUsersQuery } from '../user/users/userApi'

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
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useGetTasksQuery();
  const { data: AssetInventoryData, isLoading: isLoadingAssets } = useGetInventoriesQuery({});
  const { data: SeverityData, isLoading: isLoadingSeverity } = useGetSeveritiesQuery({});
  const { data: Users } = useGetUsersQuery()

  const AssetInventory = AssetInventoryData?.results || [];
  const Severity = SeverityData?.results || [];
  const UserList = Users?.results || [];

  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [generateSchedule] = useGenerateScheduleMutation();

  // Calculate scheduled dates based on frequency
  const calculateSchedule = (frequency, limitDate) => {
    if (!frequency || !limitDate) return [];
    const today = new Date();
    const endDate = new Date(limitDate);
    const totalDays = Math.floor((endDate - today) / (1000 * 60 * 60 * 24));
    if (totalDays <= 0) return [];
    const numberOfTasks = Math.floor(totalDays / frequency);
    const schedule = [];
    for (let i = 1; i <= numberOfTasks; i++) {
      const scheduledDate = new Date(today);
      scheduledDate.setDate(today.getDate() + (i * frequency));
      if (scheduledDate <= endDate) {
        schedule.push({
          taskNumber: i,
          scheduledDate: scheduledDate.toISOString().split('T')[0],
          daysFromNow: i * frequency,
        });
      }
    }
    return schedule;
  };

  const getAssetName = (assetId) => {
    if (!assetId) return "";
    const asset = AssetInventory.find((item) => 
      item.assetinventoryid === assetId || item.assetid === assetId || item.id === assetId
    );
    if (!asset) return `Asset #${assetId}`;
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

  const getSeverityName = (severityId) => {
    if (!severityId) return "";
    const severity = Severity.find((item) => item.rid === severityId || item.id === severityId);
    return severity ? (severity.severitystring || severity.name || severity.severity_name || "") : severityId;
  };

  const getUserName = (userId) => {
    if (!userId) return "";
    const user = UserList.find((item) => item.id === userId || item.userid === userId);
    return user ? (user.username || user.name || user.fullname || `User #${userId}`) : `User #${userId}`;
  };

  const filteredData = useMemo(() => {
    const taskList = Array.isArray(data) ? data : (data?.results || []);
    
    if (!search.trim()) {
      return taskList;
    }
    const searchLower = search.toLowerCase().trim();
    return taskList.filter((item) => {
      const machineName = (item.machinename || "").toLowerCase();
      const assetName = getAssetName(item.physicalasset).toLowerCase();
      const severityName = getSeverityName(item.severity).toLowerCase();
      const taskName = (item.taskname || "").toLowerCase();
      const userName = getUserName(item.username).toLowerCase();
      const frequencyDays = (item.frequency_days || "").toString();
      const scheduleDate = (item.schedulelimitdate || "").toLowerCase();
      const taskMasterId = (item.taskmaster || "").toString();
      return (
        machineName.includes(searchLower) ||
        taskName.includes(searchLower) ||
        assetName.includes(searchLower) ||
        severityName.includes(searchLower) ||
        userName.includes(searchLower) ||
        frequencyDays.includes(searchLower) ||
        scheduleDate.includes(searchLower) ||
        taskMasterId.includes(searchLower)
      );
    });
  }, [data, search, AssetInventory, Severity, UserList]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGeneratingSchedule(true);
    
    try {
      const submitData = {
        ...formData,
        isBlockrequired: formData.isBlockrequired ? 1 : 0,
      };

      if (editingId) {
        await updateTask({ id: editingId, ...submitData }).unwrap();
        alert("✅ Updated Successfully");
        setIsGeneratingSchedule(false);
      } else {
        const createdTask = await createTask(submitData).unwrap();
        console.log("Created task:", createdTask);
        
        try {
          const scheduleResult = await generateSchedule({
            taskmasterId: createdTask.taskmaster,
            regenerate: false,
          }).unwrap();
          
          console.log("Schedule generated:", scheduleResult);
          await refetch();
          
          alert(`✅ Task Created Successfully!\n📅 ${scheduleResult.assignments?.length || 0} scheduled tasks generated.`);
          
          setTimeout(() => {
            navigate("/maitenance/taskassgn", {
              state: { task: createdTask }
            });
          }, 500);
          
        } catch (scheduleError) {
          console.error("Error generating schedule:", scheduleError);
          alert("✅ Task Created, but there was an error generating the schedule.\nYou can manually regenerate it from the assignment page.");
          setIsGeneratingSchedule(false);
        }
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
      setIsGeneratingSchedule(false);
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

  const handleViewSchedule = (item) => {
    navigate("/maitenance/tasklist", {
      state: { task: item }
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

        {isGeneratingSchedule && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
              <p className="text-xl font-semibold">Creating task and generating schedule...</p>
              <p className="text-sm text-gray-600 mt-2">Please wait...</p>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="🔍 Search by machine name, task name, asset, severity, user..."
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

        <form
          onSubmit={handleSubmit}
          className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 p-6 rounded-lg shadow-inner"
        >
          {editingId && (
            <div className="md:col-span-2 bg-yellow-100 border border-yellow-400 p-3 rounded">
              ✏️ Editing Task ID: {editingId}
            </div>
          )}


          <div>
            <label className="block mb-1 font-semibold">Machine Name</label>
            <input
              type="text"
              name="machinename"
              value={formData.machinename}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:ring focus:ring-blue-200"
              placeholder="Enter machine name (optional)"
            />
          </div>

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
              placeholder="e.g., 20"
              min="1"
              required
            />
            {formData.frequency_days && formData.schedulelimitdate && (
              <p className="text-xs text-gray-600 mt-1">
                📅 Will generate {calculateSchedule(parseInt(formData.frequency_days), formData.schedulelimitdate).length} scheduled tasks
              </p>
            )}
          </div>

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

          <div className="flex items-end gap-2 md:col-span-2">
            <button
              type="submit"
              className="bg-[oklch(0.48_0.27_303.85)] text-white px-6 py-2 rounded shadow-md hover:opacity-90 transition disabled:opacity-50"
              disabled={isGeneratingSchedule}
            >
              {isGeneratingSchedule ? "⏳ Processing..." : editingId ? "✅ Update Task" : "➕ Add Task & Generate Schedule"}
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

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg text-sm shadow-md">
            <thead className="bg-blue-100">
              <tr>
              
                <th className="px-4 py-2 text-left">Machine Name</th>
                <th className="px-4 py-2 text-left">Physical Asset</th>
                <th className="px-4 py-2 text-left">Task Name</th>
                <th className="px-4 py-2 text-left">Frequency (Days)</th>
                <th className="px-4 py-2 text-left">Severity</th>
                <th className="px-4 py-2 text-left">Schedule Date</th>
                <th className="px-4 py-2 text-center">Assignments</th>
                <th className="px-4 py-2 text-center">Block Required</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.taskmaster} className="hover:bg-gray-50 transition">
                    
                    <td className="px-4 py-2 font-medium">{item.machinename || "-"}</td>
                    <td className="px-4 py-2">{getAssetName(item.physicalasset)}</td>
                    <td className="px-4 py-2">{item.taskname}</td>
                    <td className="px-4 py-2">{item.frequency_days}</td>
                    <td className="px-4 py-2">{getSeverityName(item.severity)}</td>
                    <td className="px-4 py-2">{item.schedulelimitdate}</td>
                    <td className="px-4 py-2 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        item.assignment_count > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {item.assignment_count || 0} tasks
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      {item.isBlockrequired === 1 || item.isBlockrequired === true ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">✅ Yes</span>
                      ) : (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">❌ No</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center inline-flex space-x-2">
                      <button
                        onClick={() => handleViewSchedule(item)}
                        className="text-green-600 hover:underline"
                        title="View Schedule"
                      >
                        📅 Schedule
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:underline"
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
                  <td colSpan="10" className="px-4 py-8 text-center text-gray-500">
                    {search ? "🔍 No tasks found matching your search." : "📝 No tasks available. Create one above!"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-gray-600 text-sm">
          Showing {filteredData.length} of {Array.isArray(data) ? data.length : (data?.count || data?.results?.length || 0)} tasks
          {search && ` (filtered by "${search}")`}
        </p>
      </div>
    </div>
  );
}

export default Taskmaster;