import React from "react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Station Info Card */}
      <div
        className="w-full mt-24 shadow-2xl rounded-2xl p-8 mb-8"
        style={{ backgroundColor: "#d8eefc" }}
      >
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <p className="font-bold text-lg">
            Station : Pt Ram Prasad Bismil (PRPM)
          </p>
          <p className="font-bold text-lg">Division : Moradabad</p>
          <p className="font-bold text-lg">Zone : Northern Railway</p>
        </div>
      </div>

      {/* Asset Summary */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-6  rounded-2xl ">
          <p className="font-medium text-gray-700">
            Assets Monitored : <span className="font-bold">220</span>
          </p>
          <p className="font-medium text-gray-700">
            Assets Active : <span className="font-bold text-green-600">220</span>
          </p>
          <p className="font-medium text-gray-700">
            Non Active Assets : <span className="font-bold text-red-600">0</span>
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-6   rounded-2xl ">
          <p className="font-medium text-gray-700">
            Sensors Installed : <span className="font-bold">220</span>
          </p>
          <p className="font-medium text-gray-700">
            Active Sensors : <span className="font-bold text-green-600">220</span>
          </p>
          <p className="font-medium text-gray-700">
            Non Active Sensors : <span className="font-bold text-red-600">0</span>
          </p>
        </div>
      </div>

      {/* Section Titles */}
     <div className="mt-10 bg-white shadow-lg rounded-2xl p-6">
  <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
    System Status
  </h2>

  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <h2 className="text-lg font-medium text-gray-700">
      Types of Assets
    </h2>

    <select className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 hover:bg-gray-100 cursor-pointer transition">
      <option>Track Circuit</option>
      <option>Point Machine</option>
      <option>Signal</option>
      <option>Relay</option>
    </select>
  </div>
</div>


      {/* Data Grid */}
      <div className="data h-[500px] w-full shadow-2xl bg-white rounded-2xl mt-6 p-6">
        <div className="grid grid-cols-4 grid-rows-4 gap-4 h-full">
          {Array.from({ length: 16 }, (_, i) => (
            <div
              key={i}
              className="flex items-center justify-center bg-blue-100 rounded-xl shadow-md font-semibold text-gray-700 hover:bg-blue-200 transition"
            >
              Box {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
