import React from "react";
import { Plus } from "lucide-react";

export default function AssetAttributes() {
  return (
    <div className="min-h-screen bg-gradient-to-br mt-32 from-purple-50 to-pink-50 p-6">
      <div className="w-full bg-white shadow-2xl rounded-2xl p-8 space-y-6">
        <h1 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          Add Attribute
        </h1>

        {/* Choose Asset */}
        <div className="flex items-center gap-3">
          <label className="w-40 text-gray-700 font-medium">Choose Asset</label>
          <select className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-400">
            <option>Point Machine</option>
          </select>
          <button className="p-2 rounded-full bg-green-600 hover:bg-green-700 text-white transition">
            <Plus size={18} />
          </button>
        </div>

        {/* Asset Name */}
        <div className="flex items-center gap-3">
          <label className="w-40 text-gray-700 font-medium">Asset Name</label>
          <input
            type="text"
            placeholder="Enter asset name"
            className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* UOM */}
        <div className="flex items-center gap-3">
          <label className="w-40 text-gray-700 font-medium">UOM</label>
          <select className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-400">
            <option>Voltage</option>
            <option>Current</option>
          </select>
          <button className="p-2 rounded-full bg-green-600 hover:bg-green-700 text-white transition">
            <Plus size={18} />
          </button>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button className=" py-3 px-6 bg-fuchsia-700 hover:bg-fuchsia-800 text-white font-semibold rounded-lg shadow-md transition">
            Add Attribute
          </button>
        </div>
      </div>

  <div className="w-full mt-5 bg-white shadow-2xl rounded-2xl p-8 space-y-6">

  <div className="flex justify-between items-center mb-4">

    <div className="flex items-center gap-2">
      <span className="text-gray-700">Show</span>
      <input
        type="number"
        className="w-20 border border-gray-300 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
      />
      <span className="text-gray-700">entries</span>
    </div>

    <div className="flex items-center gap-2">
      <label className="text-gray-700 font-medium">Search:</label>
      <input
        type="text"
        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
        placeholder="Type to search..."
      />
    </div>


  
  </div>



  <div className="overflow-x-auto flex-1">
    <table className="min-w-full border border-gray-200 rounded-lg text-sm">
      <thead className="bg-fuchsia-100">
        <tr>
          <th className="px-4 py-2 text-left font-semibold text-gray-700">Asset</th>
          <th className="px-4 py-2 text-left font-semibold text-gray-700">Attribute Name</th>
          <th className="px-4 py-2 text-left font-semibold text-gray-700">UOM</th>
          <th className="px-4 py-2 text-left font-semibold text-gray-700">Edit</th>
          <th className="px-4 py-2 text-left font-semibold text-gray-700">Delete</th>
         
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        <tr className="hover:bg-fuchsia-50">
          <td className="px-4 py-2">Point Machine</td>
          <td className="px-4 py-2">Moter voltages</td>
          <td className="px-4 py-2">Votage</td>

          
          <td className="px-4 py-2 text-fuchsia-700 cursor-pointer">✏️</td>
          <td className="px-4 py-2 text-red-600 cursor-pointer">🗑️</td>
        </tr>
      </tbody>
    </table>
  </div>


    <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
    <p>Showing 1 to 10 of 50 entries</p>
    <div className="flex items-center gap-2">
      <button className="px-3 py-1 border rounded-md hover:bg-gray-100">Prev</button>
      <button className="px-3 py-1 border rounded-md bg-fuchsia-600 text-white">1</button>
      <button className="px-3 py-1 border rounded-md hover:bg-gray-100">2</button>
      <button className="px-3 py-1 border rounded-md hover:bg-gray-100">3</button>
      <span className="px-2">...</span>
      <button className="px-3 py-1 border rounded-md hover:bg-gray-100">5</button>
      <button className="px-3 py-1 border rounded-md hover:bg-gray-100">Next</button>
    </div>
  </div>







  </div>
  
  



    </div>
  );
}
