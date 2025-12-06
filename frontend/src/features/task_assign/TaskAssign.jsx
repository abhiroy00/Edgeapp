import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetInventoriesQuery } from "../../features/asset/asset_invetory/assetinventryApi";
import { useGetTaskListQuery } from "../task_list/taskListApi";
import { 
  useGetUsersQuery,
  useAssignTasksMutation 
} from "./taskAssignmentApi";

function TaskAssign() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedTask = location.state?.task;

  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [assignments, setAssignments] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const { data: AssetInventoryData } = useGetInventoriesQuery({});
  const { data: usersData, isLoading: isLoadingUsers } = useGetUsersQuery();
  const { 
    data: taskListData, 
    isLoading: isLoadingTasks 
  } = useGetTaskListQuery(
    { taskmaster: selectedTask?.taskmaster },
    { skip: !selectedTask }
  );

  const [assignTasks] = useAssignTasksMutation();

  const AssetInventory = AssetInventoryData?.results || [];
  const users = usersData?.results || usersData || [];
  const taskList = taskListData?.results || taskListData?.assignments || [];

  // DEBUG: Log users data to see structure
  console.log('[DEBUG] Users data:', users);
  console.log('[DEBUG] First user:', users[0]);
  
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

  // Filter tasks by selected date
  const filteredTasks = useMemo(() => {
    return taskList.filter((task) => {
      const taskDate = new Date(task.scheduled_date).toISOString().split('T')[0];
      return taskDate === selectedDate;
    }).sort((a, b) => a.task_number - b.task_number);
  }, [taskList, selectedDate]);

  // Handle user assignment for a specific task
  const handleUserChange = (taskId, userId) => {
    console.log('[DEBUG] Raw onChange value:', { taskId, userId, type: typeof userId });
    
    // Check if userId is somehow a username
    if (isNaN(userId)) {
      console.error('[ERROR] Received non-numeric userId:', userId);
      console.log('[ERROR] This means the <option value> is wrong!');
      console.log('[ERROR] Users array:', normalizedUsers);
      alert('❌ Error: Invalid user selection. Please check console.');
      return;
    }
    
    // CRITICAL FIX: Ensure userId is converted to integer
    const numericUserId = userId ? parseInt(userId, 10) : null;
    
    // Debug info
    const selectedUser = normalizedUsers.find(u => u.id === numericUserId);
    console.log('[DEBUG] User selected:', {
      taskId,
      userId,
      numericUserId,
      userName: selectedUser?.username,
      selectedUser
    });
    
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
        assigned_user: parseInt(assignments[task.taskassignmentid], 10) // ENSURE INTEGER
      }));

    console.log('[DEBUG] Assignments to save:', assignmentsToSave);

    if (assignmentsToSave.length === 0) {
      alert("⚠️ Please assign at least one task to a user");
      return;
    }

    // Validate all user IDs are numbers
    const hasInvalidUserId = assignmentsToSave.some(a => 
      isNaN(a.assigned_user) || typeof a.assigned_user !== 'number'
    );

    if (hasInvalidUserId) {
      alert("❌ Invalid user selection. Please refresh and try again.");
      console.error('[ERROR] Invalid user IDs:', assignmentsToSave);
      return;
    }

    setIsSaving(true);
    try {
      const result = await assignTasks({ assignments: assignmentsToSave }).unwrap();
      console.log('[SUCCESS] Assignment result:', result);
      
      alert(`✅ Successfully assigned ${assignmentsToSave.length} task(s)`);
      
      // Navigate to TaskCloser page with the selected date
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
    
    // CRITICAL FIX: Ensure userId is converted to integer
    const numericUserId = parseInt(userId, 10);
    
    console.log('[DEBUG] Assign all to user:', { userId, numericUserId });
    
    const newAssignments = {};
    filteredTasks.forEach(task => {
      newAssignments[task.taskassignmentid] = numericUserId;
    });
    setAssignments(newAssignments);
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
                  const userId = user.id;  // Now guaranteed to exist
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
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
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
                      <select
                        value={assignments[task.taskassignmentid] || ""}
                        onChange={(e) => handleUserChange(task.taskassignmentid, e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        disabled={task.status === 'completed'}
                      >
                        <option value="">-- Select User --</option>
                        {normalizedUsers.map((user) => {
                          const userId = user.id;  // Guaranteed to exist now
                          const userName = user.username || `User #${userId}`;
                          
                          return (
                            <option key={userId} value={userId}>
                              {userName}
                            </option>
                          );
                        })}
                      </select>
                      {/* Debug: Show what's selected */}
                      {assignments[task.taskassignmentid] && (
                        <div className="text-xs text-gray-500 mt-1">
                          Selected ID: {assignments[task.taskassignmentid]}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
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

      </div>
    </div>
  );
}

export default TaskAssign;