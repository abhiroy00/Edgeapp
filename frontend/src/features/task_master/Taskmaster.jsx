import React, { useState } from "react";
import {
  useGetTasksQuery,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "./taskmasterApi";

function Taskmaster() {
  const [formData, setFormData] = useState({
    physicalasset: "",
    taskname: "",
    frequency_days: "",
    severity: "",
    schedulelimitdate: "",
    isBlockrequired: false,
  });

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const { data } = useGetTasksQuery();
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await updateTask({ id: editingId, ...formData });
      alert("✅ Updated Successfully");
    } else {
      await createTask(formData);
      alert("✅ Task Created");
    }

    // Reset form
    setEditingId(null);
    setFormData({
      physicalasset: "",
      taskname: "",
      frequency_days: "",
      severity: "",
      schedulelimitdate: "",
      isBlockrequired: false,
    });
  };

  const handleEdit = (item) => {
    setEditingId(item.taskmaster);

    // Fill form for editing
    setFormData({
      physicalasset: item.physicalasset,
      taskname: item.taskname,
      frequency_days: item.frequency_days,
      severity: item.severity,
      schedulelimitdate: item.schedulelimitdate,
      isBlockrequired: item.isBlockrequired,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete task?")) {
      await deleteTask(id);
    }
  };

  return (
    <div className="w-full mt-30 bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-7xl bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-3xl font-bold text-[oklch(0.53_0.27_303.85)] mb-5">
          🚨 Task Master
        </h1>

        {/* ✅ SEARCH */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="🔍 Search..."
            className="border p-2 rounded-md w-full focus:ring focus:ring-blue-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ✅ FORM */}
        <form
          onSubmit={handleSubmit}
          className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 p-6 rounded-lg shadow-inner"
        >
          <div>
            <label className="block mb-1 font-semibold">PhysicalAsset</label>
            <input
              type="text"
              name="physicalasset"
              value={formData.physicalasset}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">TaskName</label>
            <input
              type="text"
              name="taskname"
              value={formData.taskname}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Frequency_Days</label>
            <input
              type="number"
              name="frequency_days"
              value={formData.frequency_days}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Severity</label>
            <input
              type="number"
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">
              ScheduleLimitDate
            </label>
            <input
              type="date"
              name="schedulelimitdate"
              value={formData.schedulelimitdate}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">
              ISBlockrequired
            </label>
            <input
              type="checkbox"
              name="isBlockrequired"
              checked={formData.isBlockrequired}
              onChange={handleChange}
              className="w-5 h-5"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="bg-[oklch(0.48_0.27_303.85)] text-white px-6 py-2 rounded shadow-md"
            >
              {editingId ? "Update" : "Add"}
            </button>
          </div>
        </form>

        {/* ✅ TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg text-sm shadow-md">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-2">TaskMaster</th>
                <th className="px-4 py-2">PhysicalAsset</th>
                <th className="px-4 py-2">TaskName</th>
                <th className="px-4 py-2">Frequency_Days</th>
                <th className="px-4 py-2">Severity</th>
                <th className="px-4 py-2">ScheduleLimitDate</th>
                <th className="px-4 py-2">ISBlockrequired</th>
                <th className="px-4 py-2">Edit</th>
                <th className="px-4 py-2">Delete</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {(data?.results || []).map((item) => (
                <tr key={item.taskmaster}>
                  <td className="px-4 py-2">{item.taskmaster}</td>
                  <td className="px-4 py-2">{item.physicalasset}</td>
                  <td className="px-4 py-2">{item.taskname}</td>
                  <td className="px-4 py-2">{item.frequency_days}</td>
                  <td className="px-4 py-2">{item.severity}</td>
                  <td className="px-4 py-2">{item.schedulelimitdate}</td>
                  <td className="px-4 py-2">
                    {item.isBlockrequired ? "✅ Yes" : "❌ No"}
                  </td>

                  {/* ✅ EDIT BUTTON */}
                  <td
                    onClick={() => handleEdit(item)}
                    className="px-4 py-2 text-blue-600 cursor-pointer"
                  >
                    ✏ Edit
                  </td>

                  {/* ✅ DELETE BUTTON */}
                  <td
                    onClick={() => handleDelete(item.taskmaster)}
                    className="px-4 py-2 text-red-600 cursor-pointer"
                  >
                    🗑 Delete
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-gray-600 text-sm">
          Showing {data?.results?.length || 0} of {data?.count || 0}
        </p>
      </div>
    </div>
  );
}

export default Taskmaster;
