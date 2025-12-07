import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetInventoriesQuery } from "../../features/asset/asset_invetory/assetinventryApi";
import { useGetTaskListQuery } from "../task_list/taskListApi";
import { 
  useGetUsersQuery,
  useAssignTasksMutation 
} from "./taskAssignmentApi";
import { useGetCompletedTasksQuery } from "../task_closer/taskCompletionApi";

function TaskAssign() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedTask = location.state?.task;

  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [assignments, setAssignments] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  
  // Modal state for completed task details
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCompletionDetails, setSelectedCompletionDetails] = useState(null);

  const { data: AssetInventoryData } = useGetInventoriesQuery({});
  const { data: usersData, isLoading: isLoadingUsers } = useGetUsersQuery();
  const { 
    data: taskListData, 
    isLoading: isLoadingTasks 
  } = useGetTaskListQuery(
    { taskmaster: selectedTask?.taskmaster },
    { skip: !selectedTask }
  );

  // Fetch completed tasks
  const {
    data: completedTasksData,
  } = useGetCompletedTasksQuery(
    {
      taskmaster: selectedTask?.taskmaster,
    },
    { skip: !selectedTask }
  );

  const [assignTasks] = useAssignTasksMutation();

  const AssetInventory = AssetInventoryData?.results || [];
  const users = usersData?.results || usersData || [];
  const taskList = taskListData?.results || taskListData?.assignments || [];
  const allCompletedTasks = completedTasksData?.results || [];
  
  // CRITICAL FIX: Normalize users to have 'id' field for consistent access
  const normalizedUsers = users.map(user => ({
    ...user,
    id: user.id || user.userid  // Ensure every user has 'id' field
  }));

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

  const getUserName = (userId) => {
    if (!userId) return "Not assigned";
    const user = normalizedUsers.find((u) => u.id === userId);
    return user ? (user.username || user.name || `User #${userId}`) : `User #${userId}`;
  };

  // Filter tasks by selected date
  const filteredTasks = useMemo(() => {
    return taskList.filter((task) => {
      const taskDate = new Date(task.scheduled_date).toISOString().split('T')[0];
      return taskDate === selectedDate;
    }).sort((a, b) => a.task_number - b.task_number);
  }, [taskList, selectedDate]);

  // Get completion details for a task
  const getCompletionDetails = (taskAssignmentId) => {
    return allCompletedTasks.find(
      (completion) => completion.task_assignment_id === taskAssignmentId
    );
  };

  // Handle user assignment for a specific task
  const handleUserChange = (taskId, userId) => {
    if (isNaN(userId)) {
      alert('❌ Error: Invalid user selection.');
      return;
    }
    
    const numericUserId = userId ? parseInt(userId, 10) : null;
    
    setAssignments(prev => ({
      ...prev,
      [taskId]: numericUserId
    }));
  };

  // Save all assignments and navigate to TaskCloser
  const handleSaveAssignments = async () => {
    const assignmentsToSave = filteredTasks
      .filter(task => assignments[task.taskassignmentid])
      .map(task => ({
        taskassignmentid: task.taskassignmentid,
        assigned_user: parseInt(assignments[task.taskassignmentid], 10)
      }));

    if (assignmentsToSave.length === 0) {
      alert("⚠️ Please assign at least one task to a user");
      return;
    }

    const hasInvalidUserId = assignmentsToSave.some(a => 
      isNaN(a.assigned_user) || typeof a.assigned_user !== 'number'
    );

    if (hasInvalidUserId) {
      alert("❌ Invalid user selection. Please refresh and try again.");
      return;
    }

    setIsSaving(true);
    try {
      await assignTasks({ assignments: assignmentsToSave }).unwrap();
      
      alert(`✅ Successfully assigned ${assignmentsToSave.length} task(s)`);
      
      navigate("/maitenance/taskclose", {
        state: { 
          selectedDate: selectedDate,
          task: selectedTask
        }
      });
    } catch (error) {
      console.error("[ERROR] Assigning tasks:", error);
      alert(`❌ Error: ${error?.data?.detail || 'Failed to assign tasks'}`);
      setIsSaving(false);
    }
  };

  // Assign all visible tasks to one user
  const handleAssignAllToUser = (userId) => {
    if (!userId) return;
    
    const numericUserId = parseInt(userId, 10);
    
    const newAssignments = {};
    filteredTasks.forEach(task => {
      newAssignments[task.taskassignmentid] = numericUserId;
    });
    setAssignments(newAssignments);
  };

  // Open details modal
  const openDetailsModal = (task) => {
    const completionDetails = getCompletionDetails(task.taskassignmentid);
    if (completionDetails) {
      setSelectedCompletionDetails(completionDetails);
      setShowDetailsModal(true);
    } else {
      alert("⚠️ No completion details found for this task.");
    }
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedCompletionDetails(null);
  };

  if (!selectedTask) {
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

  if (isLoadingTasks || isLoadingUsers) {
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

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[oklch(0.53_0.27_303.85)] mb-2">
              👥 Task Assignment
            </h1>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-md space-y-2">
              <p className="text-sm text-gray-700">
                <strong>Task Name:</strong> {selectedTask.taskname}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Machine:</strong> {selectedTask.machinename || "-"} | 
                <strong> Asset:</strong> {getAssetName(selectedTask.physicalasset)}
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

        {/* Date Filter & Quick Assign */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📅 Filter by Date:
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                👤 Assign All To:
              </label>
              <select
                onChange={(e) => handleAssignAllToUser(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value=""
              >
                <option value="">-- Select User --</option>
                {normalizedUsers.map((user) => {
                  const userId = user.id;
                  const userName = user.username || user.name || `User #${userId}`;
                  
                  return (
                    <option key={userId} value={userId}>
                      {userName}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="mt-3 text-sm text-gray-600">
            Showing <strong>{filteredTasks.length}</strong> task(s) for{" "}
            <strong>{new Date(selectedDate).toLocaleDateString()}</strong>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border border-gray-300 rounded-lg text-sm">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-3 text-left">Task #</th>
                <th className="px-4 py-3 text-left">Scheduled Date</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-left">Current User</th>
                <th className="px-4 py-3 text-left">Assign To</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => {
                  const hasCompletionDetails = getCompletionDetails(task.taskassignmentid);
                  
                  return (
                    <tr key={task.taskassignmentid} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">
                        Task #{task.task_number}
                      </td>
                      <td className="px-4 py-3">{task.scheduled_date}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          task.status === 'completed' 
                            ? 'bg-green-200 text-green-800' 
                            : 'bg-yellow-200 text-yellow-800'
                        }`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {(() => {
                          const userId = task.assigned_to || task.assigned_user;
                          if (!userId) return "Not assigned";
                          const user = normalizedUsers.find(u => u.id === userId);
                          return user ? user.username : `User #${userId}`;
                        })()}
                      </td>
                      <td className="px-4 py-3">
                        {task.status !== 'completed' ? (
                          <select
                            value={assignments[task.taskassignmentid] || ""}
                            onChange={(e) => handleUserChange(task.taskassignmentid, e.target.value)}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          >
                            <option value="">-- Select User --</option>
                            {normalizedUsers.map((user) => {
                              const userId = user.id;
                              const userName = user.username || `User #${userId}`;
                              
                              return (
                                <option key={userId} value={userId}>
                                  {userName}
                                </option>
                              );
                            })}
                          </select>
                        ) : (
                          <span className="text-gray-500 text-xs">Completed</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {task.status === 'completed' && hasCompletionDetails && (
                          <button
                            onClick={() => openDetailsModal(task)}
                            className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 text-xs font-semibold"
                          >
                            👁️ View Details
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    No tasks found for the selected date.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Save Button */}
        {filteredTasks.length > 0 && (
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setAssignments({})}
              className="bg-gray-400 text-white px-6 py-2.5 rounded-lg shadow-md hover:bg-gray-500 transition-colors"
              disabled={isSaving}
            >
              Clear All
            </button>
            <button
              onClick={handleSaveAssignments}
              disabled={isSaving || Object.keys(assignments).length === 0}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? "Saving..." : `💾 Save & Continue (${Object.keys(assignments).length})`}
            </button>
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
                      <span className="font-semibold text-gray-700">Task Name:</span>
                      <p className="text-gray-900">{selectedCompletionDetails.taskname}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Task Number:</span>
                      <p className="text-gray-900">#{selectedCompletionDetails.task_number}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Scheduled Date:</span>
                      <p className="text-gray-900">{selectedCompletionDetails.scheduled_date}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Completed Date:</span>
                      <p className="text-gray-900">{selectedCompletionDetails.completed_date}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Assigned User:</span>
                      <p className="text-gray-900">{getUserName(selectedCompletionDetails.assigned_user)}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Asset:</span>
                      <p className="text-gray-900">{getAssetName(selectedCompletionDetails.asset_id)}</p>
                    </div>
                  </div>
                </div>

                {/* Time Details */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-bold text-lg mb-3 text-gray-800">Maintenance Time</h3>
                  <div className="grid grid-cols-3 gap-3 text-sm">
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

export default TaskAssign;