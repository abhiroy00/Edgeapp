import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetInventoriesQuery } from "../../features/asset/asset_invetory/assetinventryApi";
import { useGetUsersQuery } from "../user/users/userApi";
import { useGetTaskListQuery } from "../task_list/taskListApi";
import { useUpdateTaskAssignmentMutation } from "../task_assign/taskAssignmentApi";

function TaskCloser() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const selectedDateFromState = location.state?.selectedDate;
  const selectedTaskFromState = location.state?.task;
  
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(selectedDateFromState || today);
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: AssetInventoryData } = useGetInventoriesQuery({});
  const { data: usersData } = useGetUsersQuery();
  const { 
    data: taskListData, 
    isLoading,
    refetch 
  } = useGetTaskListQuery(
    { taskmaster: selectedTaskFromState?.taskmaster },
    { skip: !selectedTaskFromState }
  );

  const [updateTaskAssignment] = useUpdateTaskAssignmentMutation();

  const AssetInventory = AssetInventoryData?.results || [];
  const users = usersData?.results || usersData || [];
  const allTasks = taskListData?.results || taskListData?.assignments || [];

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
    const user = users.find(u => u.id === userId);
    return user ? (user.username || user.name || `User #${userId}`) : `User #${userId}`;
  };

  // Filter tasks by selected date and status
  const filteredTasks = useMemo(() => {
    let filtered = allTasks.filter((task) => {
      const taskDate = new Date(task.scheduled_date).toISOString().split('T')[0];
      return taskDate === selectedDate;
    });

    // Filter by status
    if (statusFilter === "completed") {
      filtered = filtered.filter(task => task.status === "completed");
    } else if (statusFilter === "pending") {
      filtered = filtered.filter(task => task.status === "pending" || !task.status);
    }

    return filtered.sort((a, b) => a.task_number - b.task_number);
  }, [allTasks, selectedDate, statusFilter]);

  // Statistics
  const statistics = useMemo(() => {
    const tasksForDate = allTasks.filter((task) => {
      const taskDate = new Date(task.scheduled_date).toISOString().split('T')[0];
      return taskDate === selectedDate;
    });
    
    const total = tasksForDate.length;
    const completed = tasksForDate.filter(t => t.status === "completed").length;
    const pending = tasksForDate.filter(t => t.status === "pending" || !t.status).length;
    
    return { total, completed, pending };
  }, [allTasks, selectedDate]);

  // Handle mark as completed
  const handleMarkCompleted = async (taskAssignmentId) => {
    if (!window.confirm("Mark this task as completed?")) return;
    
    try {
      await updateTaskAssignment({
        taskassignmentid: taskAssignmentId,
        status: "completed",
        completed_date: new Date().toISOString().split('T')[0]
      }).unwrap();
      
      alert("✅ Task marked as completed");
      refetch();
    } catch (error) {
      console.error("Error updating task:", error);
      alert("❌ Error updating task status");
    }
  };

  // Handle mark as pending
  const handleMarkPending = async (taskAssignmentId) => {
    if (!window.confirm("Mark this task as pending?")) return;
    
    try {
      await updateTaskAssignment({
        taskassignmentid: taskAssignmentId,
        status: "pending",
        completed_date: null
      }).unwrap();
      
      alert("✅ Task marked as pending");
      refetch();
    } catch (error) {
      console.error("Error updating task:", error);
      alert("❌ Error updating task status");
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
        
        {/* Header */}
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

        {/* Date Filter & Status Filter */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
          <div className="flex flex-wrap gap-4 items-center mb-4">
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
          </div>

          {/* Status Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
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

          <div className="mt-3 text-sm text-gray-600">
            Showing <strong>{filteredTasks.length}</strong> task(s) for{" "}
            <strong>{new Date(selectedDate).toLocaleDateString()}</strong>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{statistics.total}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{statistics.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{statistics.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>

        {/* Tasks Table */}
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
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <tr 
                    key={task.taskassignmentid} 
                    className={`hover:bg-gray-50 ${
                      task.status === 'completed' ? 'bg-green-50' : ''
                    }`}
                  >
                    <td className="px-4 py-3 font-semibold">
                      Task #{task.task_number}
                    </td>
                    <td className="px-4 py-3">{task.scheduled_date}</td>
                    <td className="px-4 py-3">{getUserName(task.assigned_user)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        task.status === 'completed' 
                          ? 'bg-green-200 text-green-800' : 
                          'bg-yellow-200 text-yellow-800'
                      }`}>
                        {task.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex gap-2 justify-center">
                        {task.status !== 'completed' && (
                          <button
                            onClick={() => handleMarkCompleted(task.taskassignmentid)}
                            className="bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 text-xs font-semibold transition-colors"
                          >
                            ✓ Complete
                          </button>
                        )}
                        {task.status === 'completed' && (
                          <button
                            onClick={() => handleMarkPending(task.taskassignmentid)}
                            className="bg-yellow-600 text-white px-3 py-1.5 rounded hover:bg-yellow-700 text-xs font-semibold transition-colors"
                          >
                            ↻ Pending
                          </button>
                        )}
                      </div>
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

      </div>
    </div>
  );
}

export default TaskCloser;