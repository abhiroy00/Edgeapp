import React, { useState } from "react";
import {
  useGetAlarmSetupsQuery,
  useAddAlarmSetupMutation,
  useUpdateAlarmSetupMutation,
  useDeleteAlarmSetupMutation,
} from "./alarmsetupApi";

import { useGetInventoriesQuery } from "../../asset/asset_invetory/assetinventryApi";
import { useGetAssetsQuery } from "../../asset/asset_master/assetmasterApi";

export default function AlarmSetup() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    assetinventory: "",
    assetattributemaster: "",
    sensorserial: "",
    sensorvalue: "",
    conversion: "",
    portnumber: "",
    testpoint: "",
    testpointlocation: "",
    pulsevalue: "",
    lolimit: "",
    hilimit: "",
    chnagethreshold_percentage: "",
    datacollectionfrequency_minutes: "",
    wireferrrules: "",
    activewindowhours: "",
    isdashboardattribute: "",
    colorcondition: "",
  });

  const { data } = useGetAlarmSetupsQuery({ page, search });
  const { data: assets } = useGetAssetsQuery({ page: 1, pageSize: 200, search: "" });
  const { data: inventories } = useGetInventoriesQuery({ search: "", page: 1 });

  const [addAlarmSetup] = useAddAlarmSetupMutation();
  const [updateAlarmSetup] = useUpdateAlarmSetupMutation();
  const [deleteAlarmSetup] = useDeleteAlarmSetupMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateAlarmSetup({ id: editingId, ...formData });
    } else {
      await addAlarmSetup(formData);
    }

    setEditingId(null);
    setFormData({
      assetinventory: "",
      assetattributemaster: "",
      sensorserial: "",
      sensorvalue: "",
      conversion: "",
      portnumber: "",
      testpoint: "",
      testpointlocation: "",
      pulsevalue: "",
      lolimit: "",
      hilimit: "",
      chnagethreshold_percentage: "",
      datacollectionfrequency_minutes: "",
      wireferrrules: "",
      activewindowhours: "",
      isdashboardattribute: "",
      colorcondition: "",
    });
  };

  const handleEdit = (item) => {
    setEditingId(item.assetattributelink);
    setFormData(item);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteAlarmSetup(id);
    }
  };

  return (
    <div className="w-full mt-30 bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-7xl bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-3xl font-bold text-[oklch(0.53_0.27_303.85)] mb-5">
          🚨 Asset Attribute Link
        </h1>

        {/* ✅ SEARCH */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="🔍 Search..."
            className="border p-2 rounded-md w-full focus:ring focus:ring-blue-200"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* ✅ FORM */}
        <form
          onSubmit={handleSubmit}
          className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 p-6 rounded-lg shadow-inner"
        >
          {/* ✅ ASSET INVENTORY DROPDOWN */}
          <div>
            <label className="block mb-1 text-sm font-semibold">
              Asset Inventory
            </label>
            <select
              value={formData.assetinventory}
              onChange={(e) => setFormData({ ...formData, assetinventory: e.target.value })}
              className="border p-2 w-full rounded focus:ring focus:ring-blue-300"
            >
              <option value="">-- Select Asset Inventory --</option>
              {(inventories?.results || []).map((inv) => (
                <option key={inv.assetinventoryid} value={inv.assetinventoryid}>
                  {inv.serialnumber} — {inv.manufacturermodel}
                </option>
              ))}
            </select>
          </div>

          {/* ✅ ATTRIBUTE DROPDOWN */}
          <div>
            <label className="block mb-1 text-sm font-semibold">Attribute</label>
            <select
              value={formData.assetattributemaster}
              onChange={(e) =>
                setFormData({ ...formData, assetattributemaster: e.target.value })
              }
              className="border p-2 w-full rounded focus:ring focus:ring-blue-300"
            >
              <option value="">-- Select Attribute --</option>
              {(assets?.results || []).map((a) => (
                <option key={a.assetid} value={a.assetid}>
                  {a.assetname}
                </option>
              ))}
            </select>
          </div>

          {/* ✅ INPUT FIELDS (auto rendered) */}
          {Object.keys(formData)
            .filter((k) => k !== "assetinventory" && k !== "assetattributemaster")
            .map((key) => (
              <div key={key}>
                <label className="block mb-1 text-sm font-semibold">{key}</label>
                <input
                  type="text"
                  value={formData[key]}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  className="border p-2 w-full rounded focus:ring focus:ring-blue-300"
                />
              </div>
            ))}

          <div className="flex items-end">
            <button type="submit" className="bg-[oklch(0.48_0.27_303.85)] text-white px-6 py-2 rounded shadow-md">
              {editingId ? "Update" : "Add"}
            </button>
          </div>
        </form>

        {/* ✅ TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg text-sm shadow-md">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-2">Asset Inv</th>
                <th className="px-4 py-2">Attribute</th>
                <th className="px-4 py-2">sensorserial</th>
                <th className="px-4 py-2">sensorvalue</th>
                <th className="px-4 py-2">conversion</th>
                <th className="px-4 py-2">portnumber</th>
                <th className="px-4 py-2">testpointlocation</th>
                <th className="px-4 py-2">pulsevalue</th>
                <th className="px-4 py-2">lolimit</th>
                <th className="px-4 py-2">hilimit</th>

                {/* ✅ NEW COLUMNS ADDED */}
                <th className="px-4 py-2">chnagethreshold percentage</th>
                <th className="px-4 py-2">datacollectionfrequency minutes</th>

                <th className="px-4 py-2">wireferrrules</th>
                <th className="px-4 py-2">activewindowhours</th>
                <th className="px-4 py-2">isdashboardattribute</th>
                <th className="px-4 py-2">colorcondition</th>

                <th className="px-4 py-2">Edit</th>
                <th className="px-4 py-2">Delete</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {(data?.results || []).map((item) => (
                <tr key={item.assetattributelink}>
                  <td className="px-4 py-2">
                    {inventories?.results?.find(
                      (inv) => inv.assetinventoryid === Number(item.assetinventory)
                    )?.serialnumber || item.assetinventory}
                  </td>

                  <td className="px-4 py-2">
                    {assets?.results?.find(
                      (a) => a.assetid === Number(item.assetattributemaster)
                    )?.assetname || item.assetattributemaster}
                  </td>

                  <td className="px-4 py-2">{item.sensorserial}</td>
                  <td className="px-4 py-2">{item.sensorvalue}</td>
                  <td className="px-4 py-2">{item.conversion}</td>
                  <td className="px-4 py-2">{item.portnumber}</td>
                  <td className="px-4 py-2">{item.testpoint}</td>
                  <td className="px-4 py-2">{item.pulsevalue}</td>
                  <td className="px-4 py-2">{item.lolimit}</td>
                  <td className="px-4 py-2">{item.hilimit}</td>

                  {/* ✅ SHOW NEW FIELDS */}
                  <td className="px-4 py-2">{item.chnagethreshold_percentage}</td>
                  <td className="px-4 py-2">{item.datacollectionfrequency_minutes}</td>

                  <td className="px-4 py-2">{item.wireferrrules}</td>
                  <td className="px-4 py-2">{item.activewindowhours}</td>
                  <td className="px-4 py-2">{item.isdashboardattribute}</td>
                  <td className="px-4 py-2">{item.colorcondition}</td>

                  <td
                    className="px-4 py-2 text-blue-600 cursor-pointer"
                    onClick={() => handleEdit(item)}
                  >
                    ✏️ Edit
                  </td>
                  <td
                    className="px-4 py-2 text-red-600 cursor-pointer"
                    onClick={() => handleDelete(item.assetattributelink)}
                  >
                    🗑 Delete
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ Pagination */}
        <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
          <p>
            Showing {data?.results?.length || 0} of {data?.count || 0} entries
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={!data?.previous}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded-md"
            >
              ⬅ Prev
            </button>

            <span>Page {page}</span>

            <button
              disabled={!data?.next}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border rounded-md"
            >
              Next ➡
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
