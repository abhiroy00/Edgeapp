import React, { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetInventoriesQuery } from "../../features/asset/asset_invetory/assetinventryApi";
import { useGetSeveritiesQuery } from "../../features/severity_master/SeveritymasterApi";
import {
  useGetTaskListQuery,
} from "./taskListApi";
import { useGenerateScheduleMutation } from "../task_assign/taskAssignmentApi";

function TaskList() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedTask = location.state?.task;

  const [filter, setFilter] = useState("all");
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: AssetInventoryData } = useGetInventoriesQuery({});
  const { data: SeverityData } = useGetSeveritiesQuery({});

  const { 
    data: assignmentsData, 
    isLoading: isLoadingAssignments,
    refetch 
  } = useGetTaskListQuery(
    { taskmaster: selectedTask?.taskmaster },
    { skip: !selectedTask }
  );

  const [generateSchedule] = useGenerateScheduleMutation();

  const AssetInventory = AssetInventoryData?.results || [];
  const Severity = SeverityData?.results || [];
  const assignments = assignmentsData?.results || assignmentsData?.assignments || [];

  // Auto-generate schedule if none exists
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
          alert("❌ Error generating schedule");
        } finally {
          setIsGenerating(false);
        }
      }
    };
    autoGenerateSchedule();
  }, [selectedTask, assignments.length, isLoadingAssignments]);

  const handleViewSchedule = () => {
    navigate("/maitenance/taskassgn", {
      state: { task: selectedTask }
    });
  };

  const getAssetName = (assetId) => {
    const asset = AssetInventory.find((item) =>
      item.assetinventoryid === assetId || 
      item.assetid === assetId || 
      item.id === assetId
    );

    if (!asset) return `Asset #${assetId}`;
    return (
      asset.manufacturermodel ||
      asset.serialnumber ||
      asset.railwaycode ||
      asset.asset_name ||
      asset.assetname ||
      `Asset #${assetId}`
    );
  };

  const getSeverityName = (severityId) => {
    const severity = Severity.find(
      (item) => item.rid === severityId || item.id === severityId
    );
    return severity ? (severity.severitystring || severity.name) : severityId;
  };

  const filteredAssignments = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);

    return assignments
      .filter((a) => {
        const schedDate = new Date(a.scheduled_date).setHours(0, 0, 0, 0);
        const isOverdue = schedDate < today && a.status !== "completed";

        if (filter === "completed") return a.status === "completed";
        if (filter === "pending") return a.status === "pending";
        if (filter === "overdue") return isOverdue;
        return true;
      })
      .sort((a, b) => a.task_number - b.task_number);
  }, [assignments, filter]);

  const statistics = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);

    const total = assignments.length;
    const completed = assignments.filter((a) => a.status === "completed").length;
    const pending = assignments.filter((a) => a.status === "pending").length;
    const overdue = assignments.filter((a) => {
      const schedDate = new Date(a.scheduled_date).setHours(0, 0, 0, 0);
      return schedDate < today && a.status !== "completed";
    }).length;

    return { total, completed, pending, overdue };
  }, [assignments]);

  if (!selectedTask) {
    return (
      <div className="w-full mt-30 bg-gray-100 flex justify-center items-center py-10">
        <div className="max-w-md bg-white p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">No Task Selected</h2>
          <button onClick={() => navigate(-1)} className="bg-gray-600 text-white px-6 py-2 rounded">
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

  const today = new Date().setHours(0, 0, 0, 0);

  return (
    <div className="w-full mt-30 bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-7xl bg-white shadow-xl rounded-lg p-8">

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[oklch(0.53_0.27_303.85)] mb-2">
              📅 Task List
            </h1>

            <div className="bg-blue-50 p-5 rounded-xl border border-blue-200 shadow-md hover:shadow-lg transition-shadow duration-200 space-y-3">
              <p className="text-sm text-gray-700">
                <strong>Task Name:</strong> {selectedTask.taskname}
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

        {/* Task Assign Button */}
        <button
          onClick={handleViewSchedule}
          className="bg-blue-600 text-white px-6 py-2.5 rounded shadow-md hover:bg-blue-700 mb-6 font-semibold"
        >
          👥 Assign Tasks to Users
        </button>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            All ({statistics.total})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded ${filter === "pending" ? "bg-yellow-600 text-white" : "bg-gray-200"}`}
          >
            Pending ({statistics.pending})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded ${filter === "completed" ? "bg-green-600 text-white" : "bg-gray-200"}`}
          >
            Completed ({statistics.completed})
          </button>
          <button
            onClick={() => setFilter("overdue")}
            className={`px-4 py-2 rounded ${filter === "overdue" ? "bg-red-600 text-white" : "bg-gray-200"}`}
          >
            Overdue ({statistics.overdue})
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{statistics.total}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{statistics.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{statistics.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-red-100 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{statistics.overdue}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg text-sm">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-2 text-left">Task #</th>
                <th className="px-4 py-2 text-left">Scheduled Date</th>
                <th className="px-4 py-2 text-center">Status</th>
                <th className="px-4 py-2 text-left">Completed Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredAssignments.length > 0 ? (
                filteredAssignments.map((assignment) => {
                  const schedDate = new Date(assignment.scheduled_date).setHours(0, 0, 0, 0);
                  const isPast = schedDate < today;
                  const isOverdue = isPast && assignment.status !== "completed";
                  const isCompleted = assignment.status === "completed";

                  return (
                    <tr
                      key={assignment.taskassignmentid}
                      className={`${isCompleted ? "bg-green-50" : isOverdue ? "bg-red-50" : ""}`}
                    >
                      <td className="px-4 py-2 font-semibold">Task #{assignment.task_number}</td>
                      <td className="px-4 py-2">{assignment.scheduled_date}</td>
                      <td className="px-4 py-2 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          isCompleted ? "bg-green-200 text-green-800" : 
                          isOverdue ? "bg-red-200 text-red-800" : 
                          "bg-yellow-200 text-yellow-800"
                        }`}>
                          {assignment.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {assignment.completed_date || "Not completed"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                    No tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default TaskList;