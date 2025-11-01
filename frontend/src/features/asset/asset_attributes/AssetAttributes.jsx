import React, { useState } from "react";
import { Plus } from "lucide-react";

import {
  useFetchAssetAttributesQuery,
  useAddAssetAttributeMutation,
  useDeleteAssetAttributeMutation,
} from "./assetattributeApi";

import { useGetUnitsQuery } from "../../unit_of_measurement/unitofmesurementApi";
import { useGetAssetsQuery } from "../../asset/asset_master/assetmasterApi";

export default function AssetAttributes() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useFetchAssetAttributesQuery({ page, search });
  const { data: assets } = useGetAssetsQuery({ page: 1, pageSize: 100 });
  const { data: units } = useGetUnitsQuery({ page: 1, page_size: 100 });

  const [addAttribute] = useAddAssetAttributeMutation();
  const [deleteAttribute] = useDeleteAssetAttributeMutation();

  const [asset, setAsset] = useState("");
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");

  const handleSubmit = async () => {
    if (!asset || !name || !unit) {
      alert("Please fill all fields");
      return;
    }

    await addAttribute({
      asset,
      name,
      unitofmeasurementmaster: unit,
    });

    setAsset("");
    setName("");
    setUnit("");
  };

  if (isLoading) return <h2 className="text-center">Loading...</h2>;

  return (
    <div className="min-h-screen bg-gradient-to-br mt-32 from-purple-50 to-pink-50 p-6">
      <div className="w-full bg-white shadow-2xl rounded-2xl p-8 space-y-6">
        <h1 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          Add Attribute
        </h1>

        {/* Choose Asset */}
        <div className="flex items-center gap-3">
          <label className="w-40 text-gray-700 font-medium">Choose Asset</label>
          <select
            className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={asset}
            onChange={(e) => setAsset(e.target.value)}
          >
            <option value="">Select Asset</option>
            {assets?.results?.map((item) => (
              <option key={item.assetid} value={item.assetid}>
                {item.assetname}
              </option>
            ))}
          </select>

          <button className="p-2 rounded-full bg-green-600 hover:bg-green-700 text-white transition">
            <Plus size={18} />
          </button>
        </div>

        {/* Attribute Name */}
        <div className="flex items-center gap-3">
          <label className="w-40 text-gray-700 font-medium">
            Attribute Name
          </label>
          <input
            type="text"
            placeholder="Enter attribute name"
            className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* UOM */}
        <div className="flex items-center gap-3">
          <label className="w-40 text-gray-700 font-medium">UOM</label>
          <select
            className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            <option value="">Select UOM</option>
            {units?.results?.map((item) => (
              <option
                key={item.unitofmeasurementmasterid}
                value={item.unitofmeasurementmasterid}
              >
                {item.unitmeasurename}
              </option>
            ))}
          </select>

          <button className="p-2 rounded-full bg-green-600 hover:bg-green-700 text-white transition">
            <Plus size={18} />
          </button>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            className=" py-3 px-6 bg-fuchsia-700 hover:bg-fuchsia-800 text-white font-semibold rounded-lg shadow-md transition"
            onClick={handleSubmit}
          >
            Add Attribute
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full mt-5 bg-white shadow-2xl rounded-2xl p-8 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <label className="text-gray-700 font-medium">Search:</label>
            <input
              type="text"
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              placeholder="Type to search..."
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="min-w-full border border-gray-200 rounded-lg text-sm">
            <thead className="bg-fuchsia-100">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                  Asset
                </th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                  Attribute Name
                </th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                  UOM
                </th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                  Delete
                </th>
              </tr>
            </thead>

           <tbody className="divide-y divide-gray-200">
  {data?.results?.map((item) => {
    const assetName =
      assets?.results?.find((a) => a.assetid === item.asset)?.assetname ||
      "N/A";

    const uomName =
      units?.results?.find((u) => u.unitofmeasurementmasterid === item.unitofmeasurementmaster)
        ?.unitmeasurename || "N/A";

    return (
      <tr className="hover:bg-fuchsia-50" key={item.assetattributemasterid}>
        <td className="px-4 py-2">{assetName}</td>
        <td className="px-4 py-2">{item.name}</td>
        <td className="px-4 py-2">{uomName}</td>
        <td
          className="px-4 py-2 text-red-600 cursor-pointer"
          onClick={() => deleteAttribute(item.assetattributemasterid)}
        >
          🗑️
        </td>
      </tr>
    );
  })}
</tbody>

          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <button
            className="px-3 py-1 border rounded-md hover:bg-gray-100"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          <button
            className="px-3 py-1 border rounded-md hover:bg-gray-100"
            disabled={data?.results?.length < 10}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
