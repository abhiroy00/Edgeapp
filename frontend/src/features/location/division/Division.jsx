import React from 'react'
import { Plus } from "lucide-react";

export default function Division() {
  return (
    <div>
       <button className="p-2 h-12 flex items-center rounded-md mt-30 ml-270 w-40 text-center bg-green-600 hover:bg-green-700 text-white transition">
                        <Plus size={18} className='font-bold' /> <p className='font-bold'>Add Division</p>
      </button>
    <div className="w-full mt-3  bg-white shadow-2xl rounded-2xl p-8">


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
          <th className="px-4 py-2 text-left font-semibold text-gray-700">Name</th>
          <th className="px-4 py-2 text-left font-semibold text-gray-700">Description</th>
          <th className="px-4 py-2 text-left font-semibold text-gray-700">Prefix</th>
          <th className="px-4 py-2 text-left font-semibold text-gray-700">Under Zone</th>
          <th className="px-4 py-2 text-left font-semibold text-gray-700">Edit</th>
          <th className="px-4 py-2 text-left font-semibold text-gray-700">Delete</th>
         
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        <tr className="hover:bg-fuchsia-50">
          <td className="px-4 py-2">muradabad</td>
          <td className="px-4 py-2">M</td>
          <td className="px-4 py-2">MB</td>
          <td className="px-4 py-2">Northern Railway</td>
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
  )
}
