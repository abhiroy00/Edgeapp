import React from 'react'

export default function AlramCreation() {
  return (
    <div className="bg-gradient-to-br mt-30 from-purple-50 to-pink-50  justify-center  p-6">
      <div className="h-[500px]  w-full bg-white shadow-2xl rounded-2xl p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-fuchsia-900 mb-4 text-center">
          ADD ALARM
        </h1>

        <div className="flex flex-1 gap-10">
          {/* Left Side */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Asset Attribute
              </label>
              <select className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500">
                <option>Point Machine</option>
                <option>Motor Voltage</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Threshold
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Repeat
              </label>
              <select className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500">
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Condition
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Message
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                User Level
              </label>
              <select className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Duration (sec)
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              />
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-center mt-6">
          <button className="bg-fuchsia-900 text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:bg-fuchsia-800 transition-all">
            Add
          </button>
        </div>
      </div>

    <div className="h-[500px] w-full bg-white shadow-2xl rounded-2xl mt-5 p-6 flex flex-col">
  {/* Header controls */}
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

  {/* Table */}
  <div className="overflow-x-auto flex-1">
    <table className="min-w-full border border-gray-200 rounded-lg text-sm">
      <thead className="bg-fuchsia-100">
        <tr>
          <th className="px-4 py-2 text-left font-semibold text-gray-700">Asset Attribute</th>
          <th className="px-4 py-2 text-left font-semibold text-gray-700">Condition</th>
          <th className="px-4 py-2 text-left font-semibold text-gray-700">Threshold</th>
          <th className="px-4 py-2 text-left font-semibold text-gray-700">Message</th>
          <th className="px-4 py-2 text-left font-semibold text-gray-700">Action</th>
          <th className="px-4 py-2 text-left font-semibold text-gray-700">User Level</th>
          <th className="px-4 py-2 text-left font-semibold text-gray-700">Repeat</th>
          <th className="px-4 py-2 text-left font-semibold text-gray-700">Duration</th>
          <th className="px-4 py-2 text-left font-semibold text-gray-700">Edit</th>
          <th className="px-4 py-2 text-left font-semibold text-gray-700">Delete</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        <tr className="hover:bg-fuchsia-50">
          <td className="px-4 py-2">The point machine</td>
          <td className="px-4 py-2">If greater than</td>
          <td className="px-4 py-2">110</td>
          <td className="px-4 py-2">text message</td>
          <td className="px-4 py-2">action text</td>
          <td className="px-4 py-2">2</td>
          <td className="px-4 py-2">yes</td>
          <td className="px-4 py-2">300</td>
          <td className="px-4 py-2 text-fuchsia-700 cursor-pointer">✏️</td>
          <td className="px-4 py-2 text-red-600 cursor-pointer">🗑️</td>
        </tr>
      </tbody>
    </table>
  </div>

  {/* Pagination */}
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
