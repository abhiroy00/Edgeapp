import React, { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetInventoriesQuery } from "../../features/asset/asset_invetory/assetinventryApi";
import { useGetSeveritiesQuery } from "../../features/severity_master/SeveritymasterApi";
import {
  useGetTaskAssignmentsQuery,
  useGenerateScheduleMutation,
  useMarkTaskCompleteMutation,
  useMarkTaskPendingMutation,
  useBulkMarkCompleteMutation,
} from "./taskAssignmentApi";

function TaskAssign() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedTask = location.state?.task;

  const [filter, setFilter] = useState("all");
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: AssetInventoryData } = useGetInventoriesQuery({});
  const { data: SeverityData } = useGetSeveritiesQuery({});

  // Fetch assignments from backend
  const { 
    data: assignmentsData, 
    isLoading: isLoadingAssignments,
    refetch 
  } = useGetTaskAssignmentsQuery(
    { taskmaster: selectedTask?.taskmaster },
    { skip: !selectedTask }
  );

  const [generateSchedule] = useGenerateScheduleMutation();
  const [markComplete] = useMarkTaskCompleteMutation();
  const [markPending] = useMarkTaskPendingMutation();
  const [bulkComplete] = useBulkMarkCompleteMutation();

  const AssetInventory = AssetInventoryData?.results || [];
  const Severity = SeverityData?.results || [];
  const assignments = assignmentsData?.results || assignmentsData?.assignments || [];

  // Auto-generate schedule if no assignments exist
  useEffect(() => {
    const autoGenerateSchedule = async () => {
      if (selectedTask && assignments.length === 0 && !isLoadingAssignments && !isGenerating) {
        setIsGenerating(true);
        try {
          await generateSchedule({
            taskmasterId: selectedTask.taskmaster,
            regenerate: false,
          }).unwrap();
          await refetch();
        } catch (error) {
          console.error("Error generating schedule:", error);
          alert("❌ Error generating schedule: " + (error?.data?.error || "Something went wrong"));
        } finally {
          setIsGenerating(false);
        }
      }
    };

    autoGenerateSchedule();
  }, [selectedTask, assignments.length, isLoadingAssignments, generateSchedule, refetch, isGenerating]);

  const getAssetName = (assetId) => {
    if (!assetId) return "";
    const asset = AssetInventory.find((item) => 
      item.assetinventoryid === assetId || 
      item.assetid === assetId || 
      item.id === assetId
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

  const handleToggleComplete = async (assignment) => {
    try {
      if (assignment.status === "completed") {
        await markPending(assignment.taskassignmentid).unwrap();
      } else {
        await markComplete({
          assignmentId: assignment.taskassignmentid,
          notes: "",
        }).unwrap();
      }
      await refetch();
    } catch (error) {
      console.error("Error toggling status:", error);
      alert("❌ Error updating task status");
    }
  };

  const handleBulkComplete = async () => {
    try {
      const pendingIds = assignments
        .filter(a => a.status !== "completed")
        .map(a => a.taskassignmentid);
      
      if (pendingIds.length === 0) {
        alert("ℹ️ No pending tasks to complete");
        return;
      }

      await bulkComplete(pendingIds).unwrap();
      await refetch();
      alert(`✅ Marked ${pendingIds.length} tasks as completed`);
    } catch (error) {
      console.error("Error bulk completing:", error);
      alert("❌ Error completing tasks");
    }
  };

  const handleRegenerateSchedule = async () => {
    if (!window.confirm("This will delete all existing assignments and create new ones. Continue?")) {
      return;
    }

    setIsGenerating(true);
    try {
      await generateSchedule({
        taskmasterId: selectedTask.taskmaster,
        regenerate: true,
      }).unwrap();
      await refetch();
      alert("✅ Schedule regenerated successfully");
    } catch (error) {
      console.error("Error regenerating schedule:", error);
      alert("❌ Error regenerating schedule");
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredAssignments = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const filtered = assignments.filter(assignment => {
      const schedDate = new Date(assignment.scheduled_date);
      schedDate.setHours(0, 0, 0, 0);
      const isOverdue = schedDate < today && assignment.status !== "completed";
      
      if (filter === "completed") return assignment.status === "completed";
      if (filter === "pending") return assignment.status === "pending";
      if (filter === "overdue") return isOverdue;
      return true;
    });
    
    // Sort by task number in ascending order
    return filtered.sort((a, b) => a.task_number - b.task_number);
  }, [assignments, filter]);

  const statistics = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const total = assignments.length;
    const completed = assignments.filter(a => a.status === "completed").length;
    const pending = assignments.filter(a => a.status === "pending").length;
    const overdue = assignments.filter(a => {
      const schedDate = new Date(a.scheduled_date);
      schedDate.setHours(0, 0, 0, 0);
      return schedDate < today && a.status !== "completed";
    }).length;
    
    return { total, completed, pending, overdue };
  }, [assignments]);

  if (!selectedTask) {
    return (
      <div className="w-full mt-30 bg-gray-100 flex justify-center items-center py-10">
        <div className="max-w-md bg-white p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">No Task Selected</h2>
          <p className="text-gray-600 mb-6">Please select a task from the Task Master page.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-[oklch(0.48_0.27_303.85)] text-white px-6 py-2 rounded shadow-md hover:opacity-90"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  if (isLoadingAssignments || isGenerating) {
    return (
      <div className="w-full mt-30 bg-gray-100 flex justify-center items-center py-10">
        <div className="text-center">
          <div className="text-xl mb-4">
            {isGenerating ? "🔄 Generating Schedule..." : "⏳ Loading..."}
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="w-full mt-30 bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-7xl bg-white shadow-xl rounded-lg p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[oklch(0.53_0.27_303.85)] mb-2">
              📅 Task Assignment Schedule
            </h1>
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-200 shadow-md hover:shadow-lg transition-shadow duration-200 space-y-3">
              <p className="text-sm text-gray-700">
                <strong>Task ID:</strong> {selectedTask.taskmaster} | 
                <strong> Task Name:</strong> {selectedTask.taskname}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Machine:</strong> {selectedTask.machinename || "-"} | 
                <strong> Asset:</strong> {getAssetName(selectedTask.physicalasset)}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Frequency:</strong> {selectedTask.frequency_days} days | 
                <strong> Severity:</strong> {getSeverityName(selectedTask.severity)} |
                <strong> Limit Date:</strong> {selectedTask.schedulelimitdate}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-4 py-2 rounded shadow-md hover:opacity-90"
          >
            ← Back
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-lg cursor-pointer hover:shadow-md transition" onClick={() => setFilter("all")}>
            <p className="text-sm text-gray-600">Total Tasks</p>
            <p className="text-3xl font-bold text-blue-700">{statistics.total}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg cursor-pointer hover:shadow-md transition" onClick={() => setFilter("completed")}>
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-3xl font-bold text-green-700">{statistics.completed}</p>
            <p className="text-xs text-gray-600">
              {statistics.total > 0 ? ((statistics.completed / statistics.total) * 100).toFixed(1) : 0}%
            </p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg cursor-pointer hover:shadow-md transition" onClick={() => setFilter("pending")}>
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-3xl font-bold text-yellow-700">{statistics.pending}</p>
            <p className="text-xs text-gray-600">
              {statistics.total > 0 ? ((statistics.pending / statistics.total) * 100).toFixed(1) : 0}%
            </p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg cursor-pointer hover:shadow-md transition" onClick={() => setFilter("overdue")}>
            <p className="text-sm text-gray-600">Overdue</p>
            <p className="text-3xl font-bold text-red-700">{statistics.overdue}</p>
            <p className="text-xs text-gray-600">{statistics.overdue > 0 ? "⚠️ Action Required" : "✅ On Track"}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            All ({statistics.total})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded ${filter === "completed" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Completed ({statistics.completed})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded ${filter === "pending" ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Pending ({statistics.pending})
          </button>
          <button
            onClick={() => setFilter("overdue")}
            className={`px-4 py-2 rounded ${filter === "overdue" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Overdue ({statistics.overdue})
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleBulkComplete}
            className="bg-green-600 text-white px-4 py-2 rounded shadow-md hover:opacity-90"
            disabled={statistics.pending === 0}
          >
            ✅ Mark All Pending as Completed
          </button>
          <button
            onClick={handleRegenerateSchedule}
            className="bg-orange-600 text-white px-4 py-2 rounded shadow-md hover:opacity-90"
          >
            🔄 Regenerate Schedule
          </button>
        </div>

        {/* Schedule Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg text-sm shadow-md">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-2 text-left">Task #</th>
                <th className="px-4 py-2 text-left">Scheduled Date</th>
                <th className="px-4 py-2 text-center">Status</th>
                <th className="px-4 py-2 text-left">Completed Date</th>
                <th className="px-4 py-2 text-left">Notes</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAssignments.length > 0 ? (
                filteredAssignments.map((assignment) => {
                  const schedDate = new Date(assignment.scheduled_date);
                  schedDate.setHours(0, 0, 0, 0);
                  const isPast = schedDate < today;
                  const isToday = schedDate.toDateString() === today.toDateString();
                  const isOverdue = isPast && assignment.status !== "completed";
                  const isCompleted = assignment.status === "completed";
                  
                  return (
                    <tr 
                      key={assignment.taskassignmentid} 
                      className={`hover:bg-gray-50 transition ${
                        isCompleted ? 'bg-green-50' : 
                        isOverdue ? 'bg-red-50' : 
                        isToday ? 'bg-yellow-50' : ''
                      }`}
                    >
                      <td className="px-4 py-2 font-semibold">Task #{assignment.task_number}</td>
                      <td className="px-4 py-2">{assignment.scheduled_date}</td>
                      <td className="px-4 py-2 text-center">
                        {isCompleted ? (
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                            ✅ Completed
                          </span>
                        ) : isOverdue ? (
                          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold">
                            ⚠️ Overdue
                          </span>
                        ) : isToday ? (
                          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                            📅 Due Today
                          </span>
                        ) : (
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                            📌 Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {assignment.completed_date ? (
                          <span className="text-sm text-green-700 font-medium">
                            ✓ {assignment.completed_date}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">Not completed</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-600">
                        {assignment.notes || "-"}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => handleToggleComplete(assignment)}
                          className={`px-4 py-1 rounded text-sm font-medium ${
                            isCompleted
                              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              : "bg-green-600 text-white hover:bg-green-700"
                          }`}
                        >
                          {isCompleted ? "↩️ Undo" : "✓ Complete"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    {assignments.length === 0 
                      ? "📝 No schedule generated yet. Click Regenerate Schedule to create tasks."
                      : "🔍 No tasks found with the selected filter."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-2">Progress Summary</h3>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div 
              className="bg-green-600 h-4 rounded-full transition-all duration-300" 
              style={{ 
                width: `${statistics.total > 0 ? (statistics.completed / statistics.total) * 100 : 0}%` 
              }}
            ></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
            <p><strong>Total Scheduled Tasks:</strong> {statistics.total}</p>
            <p><strong>Completion Rate:</strong> {statistics.total > 0 ? ((statistics.completed / statistics.total) * 100).toFixed(1) : 0}%</p>
            <p><strong>Schedule Period:</strong> Until {selectedTask.schedulelimitdate}</p>
            <p><strong>Frequency:</strong> Every {selectedTask.frequency_days} days</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskAssign;