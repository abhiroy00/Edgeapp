import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AssetPerformance() {
  const data = [
    { name: "53ANW", value: 33 },
    { name: "53ARW", value: 20 },
  ];

  const COLORS = ["#0088FE", "#FF8042"];

  return (
    <div className="p-6">
      {/* Top Info */}
      <div
        className="w-full mt-30 shadow-2xl rounded-2xl p-8 mb-8"
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

      {/* Dropdowns */}
      <div className="flex justify-between mb-4">
        <div className="flex gap-2 items-center">
          <p className="font-semibold">Asset Type</p>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200"
          >
            <option value="">Point Machine</option>
          </select>
        </div>

        <div className="flex gap-2 items-center">
          <p className="font-semibold">Physical Asset</p>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200"
          >
            <option value="">PM53A</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between mb-6">
        <div className="flex gap-2 items-center">
          <p className="font-semibold">Date from</p>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200"
          >
            <option value="">01-01-2023</option>
          </select>
        </div>

        <div className="flex gap-2 items-center">
          <p className="font-semibold">Date to</p>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200"
          >
            <option value="">31/01/2025</option>
          </select>
        </div>
      </div>

      {/* Data + Chart */}
      <div className="flex flex-col md:flex-row justify-between gap-6">
        {/* Left Side Numbers */}
        <div>
          <div className="flex justify-between w-64 mb-2">
            <p>Total Problems occurred</p>
            <p className="font-bold">53</p>
          </div>
          <div className="flex justify-between w-64 mb-2">
            <p>Total Problems resolved</p>
            <p className="font-bold">53</p>
          </div>
          <div className="flex justify-between w-64 mb-2">
            <p>Problematic Test Points</p>
            <p className="font-bold">30</p>
          </div>
          <div className="flex justify-between w-64 mb-2">
            <p>53ANW</p>
            <p className="font-bold">33</p>
          </div>
          <div className="flex justify-between w-64 mb-2">
            <p>53ARW</p>
            <p className="font-bold">20</p>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="w-full md:w-1/2 h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
