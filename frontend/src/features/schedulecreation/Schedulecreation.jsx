import React, { useState } from 'react';
import {
  useGetSchedulesQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
} from './schedulecreationApi';

import { useGetTasksQuery } from '../task_master/taskmasterApi';
import { useGetTypesDropdownQuery } from '../type_master/typemasterApi';
import { useGetStatusQuery } from '../status_master/statusmasterApi';
import { useGetUsersDropdownQuery } from '../user/users/userApi';

function ScheduleCreation() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [editingId, setEditingId] = useState(null);
  
  // Initialize form data with all fields
  const [formData, setFormData] = useState({
    task: '',
    maintenanceType: '',
    startDate: '',
    completeDate: '',
    scheduleDate: '',
    status: '',
    isBlockRequired: '',
    blockStartStamp: '',
    blockEndStamp: '',
    auto_dataTable_rid: '',
    auto_assestAttributeLink_id: '',
    auto_boundaryValue: '',
    auto_failureValue: '',
    auto_smsmsg: '',
    auto_edgeStamp: '',
    auto_cardStamp: '',
    auto_smsStamp: '',
    auto_assignStamp: '',
    user: '',
    app_feedback: '',
    app_latitude: '',
    app_longitude: '',
  });

  // API Queries
const { data: schedules, isLoading } = useGetSchedulesQuery({ page, page_size: pageSize });
const { data: tasks, isLoading: tasksLoading } = useGetTasksQuery();
const { data: TypeMaster, isLoading: typesLoading } = useGetTypesDropdownQuery();
const { data: users, isLoading: usersLoading, error: usersError } = useGetUsersDropdownQuery();
const { data: StatusMaster, isLoading: statusLoading } = useGetStatusQuery();
const normalize = (data) => (Array.isArray(data) ? data : data?.results || []);

  // Debug log to check users data
  console.log('Users data:', users);
  console.log('Users loading:', usersLoading);
  console.log('Users error:', usersError);

  // API Mutations
  const [createSchedule] = useCreateScheduleMutation();
  const [updateSchedule] = useUpdateScheduleMutation();
  const [deleteSchedule] = useDeleteScheduleMutation();

  // Normalize data helper
  const normalizeData = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.results) return data.results;
    return [];
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateSchedule({ id: editingId, ...formData }).unwrap();
        alert('Schedule updated successfully!');
      } else {
        await createSchedule(formData).unwrap();
        alert('Schedule created successfully!');
      }
      resetForm();
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert(`Failed to save schedule: ${error?.data?.detail || error?.message || 'Unknown error'}`);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      task: '',
      maintenanceType: '',
      startDate: '',
      completeDate: '',
      scheduleDate: '',
      status: '',
      isBlockRequired: '',
      blockStartStamp: '',
      blockEndStamp: '',
      auto_dataTable_rid: '',
      auto_assestAttributeLink_id: '',
      auto_boundaryValue: '',
      auto_failureValue: '',
      auto_smsmsg: '',
      auto_edgeStamp: '',
      auto_cardStamp: '',
      auto_smsStamp: '',
      auto_assignStamp: '',
      user: '',
      app_feedback: '',
      app_latitude: '',
      app_longitude: '',
    });
    setEditingId(null);
  };

  // Handle edit
  const handleEdit = (schedule) => {
    setFormData({
      task: schedule.task || '',
      maintenanceType: schedule.maintenanceType || schedule.maintenancetype || '',
      startDate: schedule.startDate || '',
      completeDate: schedule.completeDate || '',
      scheduleDate: schedule.scheduleDate || '',
      status: schedule.status || '',
      isBlockRequired: schedule.isBlockRequired || schedule.isBlockrequired || '',
      blockStartStamp: schedule.blockStartStamp || '',
      blockEndStamp: schedule.blockEndStamp || '',
      auto_dataTable_rid: schedule.auto_dataTable_rid || '',
      auto_assestAttributeLink_id: schedule.auto_assestAttributeLink_id || '',
      auto_boundaryValue: schedule.auto_boundaryValue || '',
      auto_failureValue: schedule.auto_failureValue || '',
      auto_smsmsg: schedule.auto_smsmsg || '',
      auto_edgeStamp: schedule.auto_edgeStamp || '',
      auto_cardStamp: schedule.auto_cardStamp || '',
      auto_smsStamp: schedule.auto_smsStamp || '',
      auto_assignStamp: schedule.auto_assignStamp || '',
      user: schedule.user || '',
      app_feedback: schedule.app_feedback || '',
      app_latitude: schedule.app_latitude || '',
      app_longitude: schedule.app_longitude || '',
    });
    setEditingId(schedule.id || schedule.scheduleid);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await deleteSchedule(id).unwrap();
        alert('Schedule deleted successfully!');
      } catch (error) {
        console.error('Error deleting schedule:', error);
        alert(`Failed to delete schedule: ${error?.data?.detail || error?.message || 'Unknown error'}`);
      }
    }
  };

  return (
    <div className="p-6 mt-10 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Schedule Creation</h1>

      {/* Form */}
      <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Task Select */}
          <div>
            <label className="block mb-1 font-semibold">Task</label>
            <select
              name="task"
              value={formData.task}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
              disabled={tasksLoading}
            >
              <option value="">
                {tasksLoading ? 'Loading tasks...' : 'Select Task'}
              </option>
              {normalizeData(tasks).map((task) => (
                <option key={task.id || task.taskid} value={task.id || task.taskid}>
                  {task.name || task.taskname || task.task_name}
                </option>
              ))}
            </select>
          </div>

          {/* Maintenance Type Select */}


          {/* Maintenance Type Select */}
<div>
  <label className="block mb-1 font-semibold">Maintenance Type</label>
  <select
  name="maintenanceType"
  value={formData.maintenanceType}
  onChange={handleChange}
  className="border p-2 w-full rounded"
  required
  disabled={typesLoading}
>
  <option value="">
    {typesLoading ? "Loading types..." : "Select Maintenance Type"}
  </option>

  {normalizeData(TypeMaster).map((type) => (
    <option key={type.rid} value={type.rid}>
      {type.maintenancetypename}
    </option>
  ))}
</select>

</div>

         

          {/* Start Date */}
          <div>
            <label className="block mb-1 font-semibold">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          {/* Complete Date */}
          <div>
            <label className="block mb-1 font-semibold">Complete Date</label>
            <input
              type="date"
              name="completeDate"
              value={formData.completeDate}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          {/* Schedule Date */}
          <div>
            <label className="block mb-1 font-semibold">Schedule Date</label>
            <input
              type="date"
              name="scheduleDate"
              value={formData.scheduleDate}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          {/* Status Select */}
          <div>
            <label className="block mb-1 font-semibold">Status</label>
          <select
  name="status"
  value={formData.status}
  onChange={handleChange}
  disabled={statusLoading}
  className="border p-2 w-full rounded"
>
  <option value="">
    {statusLoading ? "Loading Status..." : "Select Status"}
  </option>

  {normalize(StatusMaster).map((status) => (
    <option key={status.sid} value={status.sid}>
      {status.statusText}
    </option>
  ))}
</select>

          </div>

          {/* Is Block Required */}
          <div>
            <label className="block mb-1 font-semibold">Is Block Required</label>
            <select
              name="isBlockRequired"
              value={formData.isBlockRequired}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            >
              <option value="">Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          {/* Block Start Stamp */}
          <div>
            <label className="block mb-1 font-semibold">Block Start Stamp</label>
            <input
              type="datetime-local"
              name="blockStartStamp"
              value={formData.blockStartStamp}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          {/* Block End Stamp */}
          <div>
            <label className="block mb-1 font-semibold">Block End Stamp</label>
            <input
              type="datetime-local"
              name="blockEndStamp"
              value={formData.blockEndStamp}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          {/* Auto Data Table RID */}
          <div>
            <label className="block mb-1 font-semibold">Auto Data Table RID</label>
            <input
              type="text"
              name="auto_dataTable_rid"
              value={formData.auto_dataTable_rid}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          {/* Auto Asset Attribute Link ID */}
          <div>
            <label className="block mb-1 font-semibold">Auto Asset Attribute Link ID</label>
            <input
              type="text"
              name="auto_assestAttributeLink_id"
              value={formData.auto_assestAttributeLink_id}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          {/* Auto Boundary Value */}
          <div>
            <label className="block mb-1 font-semibold">Auto Boundary Value</label>
            <input
              type="text"
              name="auto_boundaryValue"
              value={formData.auto_boundaryValue}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          {/* Auto Failure Value */}
          <div>
            <label className="block mb-1 font-semibold">Auto Failure Value</label>
            <input
              type="text"
              name="auto_failureValue"
              value={formData.auto_failureValue}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          {/* Auto SMS Message */}
          <div>
            <label className="block mb-1 font-semibold">Auto SMS Message</label>
            <input
              type="text"
              name="auto_smsmsg"
              value={formData.auto_smsmsg}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          {/* Auto Edge Stamp */}
          <div>
            <label className="block mb-1 font-semibold">Auto Edge Stamp</label>
            <input
              type="datetime-local"
              name="auto_edgeStamp"
              value={formData.auto_edgeStamp}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          {/* Auto Card Stamp */}
          <div>
            <label className="block mb-1 font-semibold">Auto Card Stamp</label>
            <input
              type="datetime-local"
              name="auto_cardStamp"
              value={formData.auto_cardStamp}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          {/* Auto SMS Stamp */}
          <div>
            <label className="block mb-1 font-semibold">Auto SMS Stamp</label>
            <input
              type="datetime-local"
              name="auto_smsStamp"
              value={formData.auto_smsStamp}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          {/* Auto Assign Stamp */}
          <div>
            <label className="block mb-1 font-semibold">Auto Assign Stamp</label>
            <input
              type="datetime-local"
              name="auto_assignStamp"
              value={formData.auto_assignStamp}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          {/* User Select */}
          <div>
            <label className="block mb-1 font-semibold">User</label>
            <select
              name="user"
              value={formData.user}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              disabled={usersLoading}
            >
              <option value="">
                {usersLoading ? 'Loading users...' : 'Select User'}
              </option>
              {normalizeData(users).map((user) => (
                <option key={user.id || user.userid} value={user.id || user.userid}>
                  {user.name || user.username || user.user_name || user.email}
                </option>
              ))}
            </select>
            {usersError && (
              <p className="text-red-500 text-sm mt-1">Error loading users: {usersError.message}</p>
            )}
          </div>
        </div>

        {/* App Feedback */}
        <div>
          <label className="block mb-1 font-semibold">App Feedback</label>
          <textarea
            name="app_feedback"
            value={formData.app_feedback}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            rows="3"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* App Latitude */}
          <div>
            <label className="block mb-1 font-semibold">App Latitude</label>
            <input
              type="text"
              name="app_latitude"
              value={formData.app_latitude}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              placeholder="e.g., 28.4595"
            />
          </div>

          {/* App Longitude */}
          <div>
            <label className="block mb-1 font-semibold">App Longitude</label>
            <input
              type="text"
              name="app_longitude"
              value={formData.app_longitude}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              placeholder="e.g., 77.0266"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {editingId ? "Update Schedule" : "Add Schedule"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 border">Task</th>
              <th className="px-3 py-2 border">Maintenance Type</th>
              <th className="px-3 py-2 border">Complete Date</th>
              <th className="px-3 py-2 border">Schedule Date</th>
              <th className="px-3 py-2 border">Is Block Required</th>
              <th className="px-3 py-2 border">Block Start Stamp</th>
              <th className="px-3 py-2 border">Block End Stamp</th>
              <th className="px-3 py-2 border">Auto Data Table RID</th>
              <th className="px-3 py-2 border">Auto Asset Attribute Link ID</th>
              <th className="px-3 py-2 border">Auto Boundary Value</th>
              <th className="px-3 py-2 border">Auto SMS Msg</th>
              <th className="px-3 py-2 border">Auto Edge Stamp</th>
              <th className="px-3 py-2 border">Auto Card Stamp</th>
              <th className="px-3 py-2 border">Auto SMS Stamp</th>
              <th className="px-3 py-2 border">Auto Assign Stamp</th>
              <th className="px-3 py-2 border">User</th>
              <th className="px-3 py-2 border">App Feedback</th>
              <th className="px-3 py-2 border">App Latitude</th>
              <th className="px-3 py-2 border">App Longitude</th>
              <th className="px-3 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="20" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : normalizeData(schedules).length === 0 ? (
              <tr>
                <td colSpan="20" className="text-center p-4 text-gray-500">
                  No schedules found. Create your first schedule!
                </td>
              </tr>
            ) : (
              normalizeData(schedules).map((schedule) => (
                <tr key={schedule.id || schedule.scheduleid} className="hover:bg-gray-50">
                  <td className="px-3 py-2 border">{schedule.task_name || schedule.task || 'N/A'}</td>
                  <td className="px-3 py-2 border">{schedule.maintenancetype_name || schedule.maintenanceType || 'N/A'}</td>
                  <td className="px-3 py-2 border">{schedule.completeDate || 'N/A'}</td>
                  <td className="px-3 py-2 border">{schedule.scheduleDate || 'N/A'}</td>
                  <td className="px-3 py-2 border">{schedule.isBlockrequired || schedule.isBlockRequired || 'N/A'}</td>
                  <td className="px-3 py-2 border">{schedule.blockStartStamp || 'N/A'}</td>
                  <td className="px-3 py-2 border">{schedule.blockEndStamp || 'N/A'}</td>
                  <td className="px-3 py-2 border">{schedule.auto_dataTable_rid || 'N/A'}</td>
                  <td className="px-3 py-2 border">{schedule.auto_assestAttributeLink_id || 'N/A'}</td>
                  <td className="px-3 py-2 border">{schedule.auto_boundaryValue || 'N/A'}</td>
                  <td className="px-3 py-2 border">{schedule.auto_smsmsg || 'N/A'}</td>
                  <td className="px-3 py-2 border">{schedule.auto_edgeStamp || 'N/A'}</td>
                  <td className="px-3 py-2 border">{schedule.auto_cardStamp || 'N/A'}</td>
                  <td className="px-3 py-2 border">{schedule.auto_smsStamp || 'N/A'}</td>
                  <td className="px-3 py-2 border">{schedule.auto_assignStamp || 'N/A'}</td>
                  <td className="px-3 py-2 border">{schedule.user_name || schedule.user || 'N/A'}</td>
                  <td className="px-3 py-2 border">{schedule.app_feedback || 'N/A'}</td>
                  <td className="px-3 py-2 border">{schedule.app_latitude || 'N/A'}</td>
                  <td className="px-3 py-2 border">{schedule.app_longitude || 'N/A'}</td>
                  <td className="px-3 py-2 border">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(schedule)}
                        className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(schedule.id || schedule.scheduleid)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-4 space-x-4">
          <button
            disabled={!schedules?.previous}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
          >
            Prev
          </button>
          <span>
            Page {page} of {Math.ceil((schedules?.count || 0) / pageSize) || 1}
          </span>
          <button
            disabled={!schedules?.next}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScheduleCreation;