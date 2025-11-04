import React, { useState, useEffect } from "react";
import {
  useGetAlarmsQuery,
  useCreateAlarmMutation,
  useDeleteAlarmMutation,
  useUpdateAlarmMutation,
  useGetOperatorsQuery,
  useGetAssetAttributesQuery,
} from "./alarmcreationApi";

export default function AlramCreation() {
  const { data: operatorData } = useGetOperatorsQuery();
  const { data: attributeData } = useGetAssetAttributesQuery();
  const { data: alarmData } = useGetAlarmsQuery();

  const [createAlarm] = useCreateAlarmMutation();
  const [updateAlarm] = useUpdateAlarmMutation();
  const [deleteAlarm] = useDeleteAlarmMutation();

  const [editingAlarm, setEditingAlarm] = useState(null);

  const [formData, setFormData] = useState({
    assetattributelink: "",
    mathoperator: "",
    thresholdvalue: "",
    message: "",
    actiontext: "",
    alerttolevel: "",
    repeat: "",
    duration_seconds: "",
    is_active: true,
  });

  // ✅ When clicking Edit - prefill
  const handleEdit = (alarm) => {
    setEditingAlarm(alarm.alarmsetup);
    setFormData({
      assetattributelink: alarm.assetattributelink,
      mathoperator: alarm.mathoperator,
      thresholdvalue: alarm.thresholdvalue,
      message: alarm.message,
      actiontext: alarm.actiontext,
      alerttolevel: alarm.alerttolevel,
      repeat: alarm.repeat,
      duration_seconds: alarm.duration_seconds,
      is_active: alarm.is_active,
    });
  };

  // ✅ Handle Submit (Create or Update)
  const handleSubmit = async () => {
    const payload = {
      assetattributelink: Number(formData.assetattributelink),
      mathoperator: Number(formData.mathoperator),
      thresholdvalue: Number(formData.thresholdvalue),
      message: formData.message,
      actiontext: formData.actiontext,
      alerttolevel: Number(formData.alerttolevel),
      repeat: Number(formData.repeat),
      duration_seconds: Number(formData.duration_seconds),
      is_active: true,
    };

    try {
      if (editingAlarm) {
        await updateAlarm({ alarmsetup: editingAlarm, ...payload }).unwrap();
        alert("✅ Alarm Updated Successfully");
        setEditingAlarm(null);
      } else {
        await createAlarm(payload).unwrap();
        alert("✅ Alarm Created Successfully");
      }

      setFormData({
        assetattributelink: "",
        mathoperator: "",
        thresholdvalue: "",
        message: "",
        actiontext: "",
        alerttolevel: "",
        repeat: "",
        duration_seconds: "",
        is_active: true,
      });
    } catch (error) {
      console.log("Error:", error);
      alert("❌ Failed! Check console");
    }
  };

  // ✅ Delete Alarm
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        await deleteAlarm(id).unwrap();
        alert("🗑️ Deleted Successfully");
      } catch (err) {
        alert("❌ Failed to delete");
      }
    }
  };

  return (
    <div className="bg-gradient-to-br mt-30 from-purple-50 to-pink-50 justify-center p-6">
      <div className="h-[500px] w-full bg-white shadow-2xl rounded-2xl p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-fuchsia-900 mb-4 text-center">
          {editingAlarm ? "UPDATE ALARM" : "ADD ALARM"}
        </h1>

        <div className="flex flex-1 gap-10">

          <div className="flex-1 space-y-4">

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Asset Attribute Link
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                value={formData.assetattributelink}
                onChange={(e) =>
                  setFormData({ ...formData, assetattributelink: e.target.value })
                }
              >
                <option value="">-- Select Attribute --</option>
                {(attributeData?.results || attributeData)?.map((at) => (
                  <option key={at.assetattributelink} value={at.assetattributelink}>
                    {at.assetattributelink}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Operator
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                value={formData.mathoperator}
                onChange={(e) =>
                  setFormData({ ...formData, mathoperator: e.target.value })
                }
              >
                <option value="">-- Select Operator --</option>
                {(operatorData?.results || operatorData)?.map((op) => (
                  <option key={op.mathoperator} value={op.mathoperator}>
                    {op.operator} ({op.mathexpression})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Threshold</label>
              <input
                type="number"
                step="0.01"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                value={formData.thresholdvalue}
                onChange={(e) =>
                  setFormData({ ...formData, thresholdvalue: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Repeat</label>
              <select
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                value={formData.repeat}
                onChange={(e) =>
                  setFormData({ ...formData, repeat: e.target.value })
                }
              >
                <option value="">Select</option>
                <option value={1}>Yes</option>
                <option value={0}>No</option>
              </select>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Message</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">User Level</label>
              <select
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                value={formData.alerttolevel}
                onChange={(e) =>
                  setFormData({ ...formData, alerttolevel: e.target.value })
                }
              >
                <option value="">Select</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Duration (sec)
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                value={formData.duration_seconds}
                onChange={(e) =>
                  setFormData({ ...formData, duration_seconds: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Action Text
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                value={formData.actiontext}
                onChange={(e) =>
                  setFormData({ ...formData, actiontext: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            className="bg-fuchsia-900 text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:bg-fuchsia-800 transition-all"
            onClick={handleSubmit}
          >
            {editingAlarm ? "Update" : "Add"}
          </button>
        </div>
      </div>

      {/* ✅ TABLE */}
      <div className="h-[500px] w-full bg-white shadow-2xl rounded-2xl mt-5 p-6 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="min-w-full border border-gray-200 rounded-lg text-sm">
            <thead className="bg-fuchsia-100">
              <tr>
                <th className="px-4 py-2 text-left">Operator</th>
                <th className="px-4 py-2 text-left">Threshold</th>
                <th className="px-4 py-2 text-left">Message</th>
                <th className="px-4 py-2 text-left">User Level</th>
                <th className="px-4 py-2 text-left">Repeat</th>
                <th className="px-4 py-2 text-left">Duration</th>
                <th className="px-4 py-2 text-left">Action Text</th>

                <th className="px-4 py-2 text-left">Delete</th>
                <th className="px-4 py-2 text-left">Edit</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {alarmData?.results?.length > 0 ? (
                alarmData.results.map((alarm) => (
                  <tr key={alarm.alarmsetup} className="hover:bg-fuchsia-50">
                    <td className="px-4 py-2">{alarm.mathoperator}</td>
                    <td className="px-4 py-2">{alarm.thresholdvalue}</td>
                    <td className="px-4 py-2">{alarm.message}</td>
                    <td className="px-4 py-2">{alarm.alerttolevel}</td>
                    <td className="px-4 py-2">{alarm.repeat === 1 ? "Yes" : "No"}</td>
                    <td className="px-4 py-2">{alarm.duration_seconds}</td>
                     <td className="px-4 py-2">{alarm.actiontext}</td>


                    <td className="px-4 py-2">
                      <button
                        className="text-red-600 font-bold"
                        onClick={() => handleDelete(alarm.alarmsetup)}
                      >
                        Delete
                      </button>
                    </td>

                    <td className="px-4 py-2">
                      <button
                        className="text-blue-600 font-bold"
                        onClick={() => handleEdit(alarm)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    No records found
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
