import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetInventoriesQuery } from "../../features/asset/asset_invetory/assetinventryApi";
import { useGetUsersQuery } from "../user/users/userApi";
import { useGetTaskListQuery, useMarkTaskCompleteMutation } from "../task_list/taskListApi"; 
import { 
  useCreateTaskCompletionMutation,
  useGetCompletedTasksQuery 
} from "./taskCompletionApi";

function TaskCloser() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedDateFromState = location.state?.selectedDate;
  const selectedTaskFromState = location.state?.task;

  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(selectedDateFromState || today);
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("tasks");

  // Modal
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [selectedTaskForCompletion, setSelectedTaskForCompletion] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCompletionDetails, setSelectedCompletionDetails] = useState(null);

  const [maintenanceData, setMaintenanceData] = useState({
    startTime: "",
    startPeriod: "AM",
    stopTime: "",
    stopPeriod: "AM",
    isSuccessful: true,
    feedback: "",
  });

  // Queries
  const { data: AssetInventoryData } = useGetInventoriesQuery({});
  const { data: usersData } = useGetUsersQuery();

  const { data: taskListData, isLoading, refetch: refetchTaskList } = useGetTaskListQuery(
    { taskmaster: selectedTaskFromState?.taskmaster },
    { skip: !selectedTaskFromState }
  );

  const {
    data: completedTasksData,
    isLoading: completedLoading,
    refetch: refetchCompleted,
  } = useGetCompletedTasksQuery(
    {
      taskmaster: selectedTaskFromState?.taskmaster,
      completed_date: selectedDate,
    },
    { skip: !selectedTaskFromState }
  );

  // Mutations
  const [createTaskCompletion] = useCreateTaskCompletionMutation();
  const [markTaskComplete] = useMarkTaskCompleteMutation();

  // Data extraction
  const AssetInventory = AssetInventoryData?.results || [];
  const users = usersData?.results || usersData || [];
  const allTasks = taskListData?.results || taskListData?.assignments || [];
  const completedTasks = completedTasksData?.results || [];

  const getAssetName = (assetId) => {
    const asset = AssetInventory.find(
      (item) =>
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

  const getUserName = (userId) => {
    if (!userId) return "Not assigned";
    const user = users.find((u) => u.id === userId || u.userid === userId);
    return user ? user.username || user.name || `User #${userId}` : `User #${userId}`;
  };

  // Convert to 24H
  const convertTo24Hour = (time, period) => {
    if (!time) return "";
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours);

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  };

  // Duration
  const calculateDuration = (startTime, startPeriod, stopTime, stopPeriod) => {
    if (!startTime || !stopTime) return "";

    const start24 = convertTo24Hour(startTime, startPeriod);
    const stop24 = convertTo24Hour(stopTime, stopPeriod);

    const startDate = new Date(`2000-01-01T${start24}`);
    const stopDate = new Date(`2000-01-01T${stop24}`);

    let diff = (stopDate - startDate) / (1000 * 60);
    if (diff < 0) diff += 1440;

    const hrs = Math.floor(diff / 60);
    const mins = diff % 60;

    return `${hrs}h ${mins}m`;
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    let filtered = allTasks.filter((task) => {
      const taskDate = new Date(task.scheduled_date).toISOString().split("T")[0];
      return taskDate === selectedDate;
    });

    if (statusFilter === "completed") {
      filtered = filtered.filter((t) => t.status === "completed");
    } else if (statusFilter === "pending") {
      filtered = filtered.filter((t) => t.status !== "completed");
    }

    return filtered.sort((a, b) => a.task_number - b.task_number);
  }, [allTasks, selectedDate, statusFilter]);

  // Stats
  const statistics = useMemo(() => {
    const tasksForDate = allTasks.filter((task) => {
      const taskDate = new Date(task.scheduled_date).toISOString().split("T")[0];
      return taskDate === selectedDate;
    });

    return {
      total: tasksForDate.length,
      completed: tasksForDate.filter((t) => t.status === "completed").length,
      pending: tasksForDate.filter((t) => t.status !== "completed").length,
    };
  }, [allTasks, selectedDate]);

  // Open Completion Modal
  const openCompletionModal = (task) => {
    setSelectedTaskForCompletion(task);
    setMaintenanceData({
      startTime: "",
      startPeriod: "AM",
      stopTime: "",
      stopPeriod: "AM",
      isSuccessful: true,
      feedback: "",
    });
    setShowCompletionModal(true);
  };

  const closeCompletionModal = () => {
    setShowCompletionModal(false);
    setSelectedTaskForCompletion(null);
  };

  // Open Details Modal
  const openDetailsModal = (completionTask) => {
    setSelectedCompletionDetails(completionTask);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedCompletionDetails(null);
  };

  // Submit Completion
  const handleSubmitCompletion = async () => {
    if (!maintenanceData.startTime || !maintenanceData.stopTime) {
      alert("⚠️ Enter start and stop times");
      return;
    }

    if (!maintenanceData.feedback.trim()) {
      alert("⚠️ Feedback required");
      return;
    }

    const start24 = convertTo24Hour(
      maintenanceData.startTime,
      maintenanceData.startPeriod
    );

    const stop24 = convertTo24Hour(
      maintenanceData.stopTime,
      maintenanceData.stopPeriod
    );

    // Check for overnight maintenance
    const startMinutes = parseInt(start24.split(':')[0]) * 60 + parseInt(start24.split(':')[1]);
    const stopMinutes = parseInt(stop24.split(':')[0]) * 60 + parseInt(stop24.split(':')[1]);
    
    if (stopMinutes <= startMinutes) {
      const proceed = window.confirm(
        `⚠️ Stop time (${maintenanceData.stopTime} ${maintenanceData.stopPeriod}) is before or equal to start time (${maintenanceData.startTime} ${maintenanceData.startPeriod}).\n\n` +
        `This indicates overnight maintenance spanning ${calculateDuration(
          maintenanceData.startTime,
          maintenanceData.startPeriod,
          maintenanceData.stopTime,
          maintenanceData.stopPeriod
        )}.\n\n` +
        `Do you want to continue?`
      );
      
      if (!proceed) {
        return;
      }
    }

    try {
      await createTaskCompletion({
        task_assignment_id: selectedTaskForCompletion.taskassignmentid,
        task_number: selectedTaskForCompletion.task_number,
        taskmaster: selectedTaskFromState.taskmaster,
        taskname: selectedTaskFromState.taskname,
        asset_id: selectedTaskFromState.physicalasset,
        assigned_user: selectedTaskForCompletion.assigned_to,
        scheduled_date: selectedTaskForCompletion.scheduled_date,
        completed_date: new Date().toISOString().split("T")[0],
        maintenance_start_time: start24,
        maintenance_stop_time: stop24,
        start_time_display: `${maintenanceData.startTime} ${maintenanceData.startPeriod}`,
        stop_time_display: `${maintenanceData.stopTime} ${maintenanceData.stopPeriod}`,
        duration: calculateDuration(
          maintenanceData.startTime,
          maintenanceData.startPeriod,
          maintenanceData.stopTime,
          maintenanceData.stopPeriod
        ),
        is_successful: maintenanceData.isSuccessful,
        feedback: maintenanceData.feedback,
      }).unwrap();

      await markTaskComplete({
        assignmentId: selectedTaskForCompletion.taskassignmentid,
        notes: maintenanceData.feedback,
      }).unwrap();

      await refetchTaskList();
      await refetchCompleted();

      alert("✅ Task completed successfully!");
      closeCompletionModal();

    } catch (err) {
      console.error(err);
      alert("❌ Error completing task");
    }
  };

  if (!selectedTaskFromState) {
    return (
      <div className="w-full mt-30 bg-gray-100 flex justify-center items-center py-10">
        <div className="max-w-md bg-white p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">No Task Selected</h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full mt-30 bg-gray-100 flex justify-center items-center py-10">
        <div className="text-center">
          <div className="text-xl mb-4">⏳ Loading...</div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-30 bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-7xl bg-white shadow-xl rounded-lg p-8">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[oklch(0.53_0.27_303.85)] mb-2">
              ✅ Task Closer
            </h1>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-md space-y-2">
              <p className="text-sm text-gray-700">
                <strong>Task Name:</strong> {selectedTaskFromState.taskname}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Machine:</strong> {selectedTaskFromState.machinename || "-"} |
                <strong> Asset:</strong> {getAssetName(selectedTaskFromState.physicalasset)}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-4 py-2 rounded shadow-md hover:bg-gray-600"
          >
            ← Back
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === "tasks"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            📋 Task List
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === "completed"
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            ✅ Completed Tasks ({completedTasks.length})
          </button>
        </div>

        {/* DATE FILTER */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📅 Filter by Date:
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* TASK LIST TAB */}
        {activeTab === "tasks" && (
          <>
            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap mb-6">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  statusFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All ({statistics.total})
              </button>

              <button
                onClick={() => setStatusFilter("pending")}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  statusFilter === "pending"
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Pending ({statistics.pending})
              </button>

              <button
                onClick={() => setStatusFilter("completed")}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  statusFilter === "completed"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Completed ({statistics.completed})
              </button>
            </div>

            {/* Task List Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 rounded-lg text-sm">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="px-4 py-3 text-left">Task #</th>
                    <th className="px-4 py-3 text-left">Scheduled Date</th>
                    <th className="px-4 py-3 text-left">Assigned User</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {filteredTasks.map((task) => (
                    <tr
                      key={task.taskassignmentid}
                      className={`hover:bg-gray-50 ${
                        task.status === "completed" ? "bg-green-50" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-semibold">Task #{task.task_number}</td>
                      <td className="px-4 py-3">{task.scheduled_date}</td>
                      <td className="px-4 py-3">{getUserName(task.assigned_to)}</td>

                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            task.status === "completed"
                              ? "bg-green-200 text-green-800"
                              : "bg-yellow-200 text-yellow-800"
                          }`}
                        >
                          {task.status || "pending"}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center">
                        {task.status !== "completed" && (
                          <button
                            onClick={() => openCompletionModal(task)}
                            className="bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 text-xs font-semibold"
                          >
                            ✓ Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}

                  {filteredTasks.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                        No tasks found for this date.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* COMPLETED TAB */}
        {activeTab === "completed" && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg text-sm">
              <thead className="bg-green-100">
                <tr>
                  <th className="px-4 py-3 text-left">Task #</th>
                  <th className="px-4 py-3 text-left">Completed Date</th>
                  <th className="px-4 py-3 text-left">Assigned User</th>
                  <th className="px-4 py-3 text-left">Start</th>
                  <th className="px-4 py-3 text-left">Stop</th>
                  <th className="px-4 py-3 text-left">Duration</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-left">Feedback</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {completedLoading ? (
                  <tr>
                    <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : completedTasks.length > 0 ? (
                  completedTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">Task #{task.task_number}</td>
                      <td className="px-4 py-3">{task.completed_date}</td>
                      <td className="px-4 py-3">{getUserName(task.assigned_user)}</td>
                      <td className="px-4 py-3">{task.start_time_display}</td>
                      <td className="px-4 py-3">{task.stop_time_display}</td>
                      <td className="px-4 py-3 font-semibold">{task.duration}</td>

                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            task.is_successful
                              ? "bg-green-200 text-green-800"
                              : "bg-red-200 text-red-800"
                          }`}
                        >
                          {task.is_successful ? "✓ Success" : "✗ Failed"}
                        </span>
                      </td>
                      
                      <td className="px-4 py-3 max-w-xs truncate" title={task.feedback}>
                        {task.feedback}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => openDetailsModal(task)}
                          className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 text-xs font-semibold"
                        >
                          👁️ View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                      No completed tasks.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* COMPLETION MODAL */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-green-600 text-white px-6 py-4 rounded-t-lg">
                <h2 className="text-2xl font-bold">✓ Complete Task</h2>
                <p className="text-sm mt-1 opacity-90">
                  Task #{selectedTaskForCompletion?.task_number}
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Start Time */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    🕐 Maintenance Start Time *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="time"
                      value={maintenanceData.startTime}
                      onChange={(e) =>
                        setMaintenanceData({
                          ...maintenanceData,
                          startTime: e.target.value,
                        })
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <select
                      value={maintenanceData.startPeriod}
                      onChange={(e) =>
                        setMaintenanceData({
                          ...maintenanceData,
                          startPeriod: e.target.value,
                        })
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>

                {/* Stop Time */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    🕐 Maintenance Stop Time *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="time"
                      value={maintenanceData.stopTime}
                      onChange={(e) =>
                        setMaintenanceData({
                          ...maintenanceData,
                          stopTime: e.target.value,
                        })
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <select
                      value={maintenanceData.stopPeriod}
                      onChange={(e) =>
                        setMaintenanceData({
                          ...maintenanceData,
                          stopPeriod: e.target.value,
                        })
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>

                {/* Duration */}
                {maintenanceData.startTime && maintenanceData.stopTime && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-sm">
                      <strong>Duration:</strong>{" "}
                      {calculateDuration(
                        maintenanceData.startTime,
                        maintenanceData.startPeriod,
                        maintenanceData.stopTime,
                        maintenanceData.stopPeriod
                      )}
                    </p>
                  </div>
                )}

                {/* Success/Failure */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    ✓ Task Completion Status *
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        setMaintenanceData({
                          ...maintenanceData,
                          isSuccessful: true,
                        })
                      }
                      className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                        maintenanceData.isSuccessful
                          ? "bg-green-600 text-white shadow-lg scale-105"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      ✓ Successful
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setMaintenanceData({
                          ...maintenanceData,
                          isSuccessful: false,
                        })
                      }
                      className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                        !maintenanceData.isSuccessful
                          ? "bg-red-600 text-white shadow-lg scale-105"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      ✗ Failed
                    </button>
                  </div>
                </div>

                {/* Feedback */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    💬 Feedback / Notes *
                  </label>
                  <textarea
                    rows={4}
                    value={maintenanceData.feedback}
                    onChange={(e) =>
                      setMaintenanceData({
                        ...maintenanceData,
                        feedback: e.target.value,
                      })
                    }
                    placeholder="Enter maintenance details, observations, issues encountered..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {maintenanceData.feedback.length} characters
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-3">
                <button
                  onClick={closeCompletionModal}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmitCompletion}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors shadow-md"
                >
                  ✓ Complete Task
                </button>
              </div>
            </div>
          </div>
        )}

         {/* DETAILS MODAL */}
        {showDetailsModal && selectedCompletionDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">
                <h2 className="text-2xl font-bold">📋 Task Completion Details</h2>
                <p className="text-sm mt-1 opacity-90">
                  Task #{selectedCompletionDetails.task_number}
                </p>
              </div>

              <div className="p-6 space-y-4">
                {/* Task Information */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-lg mb-3 text-gray-800">Task Information</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700">Start Time:</span>
                      <p className="text-gray-900 text-lg">{selectedCompletionDetails.start_time_display}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Stop Time:</span>
                      <p className="text-gray-900 text-lg">{selectedCompletionDetails.stop_time_display}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Duration:</span>
                      <p className="text-gray-900 text-lg font-bold">{selectedCompletionDetails.duration}</p>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className={`p-4 rounded-lg border ${
                  selectedCompletionDetails.is_successful 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <h3 className="font-bold text-lg mb-2 text-gray-800">Completion Status</h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                      selectedCompletionDetails.is_successful
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}>
                      {selectedCompletionDetails.is_successful ? "✓ Successful" : "✗ Failed"}
                    </span>
                  </div>
                </div>

                {/* Feedback */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-lg mb-2 text-gray-800">Feedback / Notes</h3>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedCompletionDetails.feedback}</p>
                </div>

                {/* Metadata */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-lg mb-3 text-gray-800">Record Information</h3>
                  <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                    <div>
                      <span className="font-semibold">Created:</span>
                      <p>{new Date(selectedCompletionDetails.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="font-semibold">Updated:</span>
                      <p>{new Date(selectedCompletionDetails.updated_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="font-semibold">Task Assignment ID:</span>
                      <p>{selectedCompletionDetails.task_assignment_id}</p>
                    </div>
                    <div>
                      <span className="font-semibold">Completion Record ID:</span>
                      <p>{selectedCompletionDetails.id}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end">
                <button
                  onClick={closeDetailsModal}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default TaskCloser