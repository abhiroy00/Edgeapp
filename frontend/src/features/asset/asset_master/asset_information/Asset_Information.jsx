import React from 'react'

export default function AssetDetails() {
  return (
    <div className="p-8">
      {/* Header Section */}
      <div
        className="w-full mt-10 shadow-2xl rounded-2xl p-8 mb-10"
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

      {/* Asset Details Grid */}
      <div className="grid grid-cols-3 gap-y-6 gap-x-10">
        {/* Row 1 */}
        <p className="text-2xl font-semibold">• Asset Name</p>
        <p className="text-2xl">Point Machine</p>
        <p className="text-2xl">Parameters monitored</p>

        {/* Row 2 */}
        <p className="text-2xl font-semibold">• Asset Railway Code</p>
        <p className="text-2xl">53A</p>
        <p className="text-2xl">Motor Current 53A NW</p>

        {/* Row 3 */}
        <p className="text-2xl font-semibold">• Asset Location</p>
        <p className="text-2xl">LB 13</p>
        <p className="text-2xl">Motor Current 53A RW</p>

        {/* Row 4 */}
        <p className="text-2xl font-semibold">• Location Longitude</p>
        <p className="text-2xl">27.8123749</p>
        <p></p>

        {/* Row 5 */}
        <p className="text-2xl font-semibold">• Location Latitude</p>
        <p className="text-2xl">79.9582450</p>
        <p></p>

        {/* Row 6 */}
        <p className="text-2xl font-semibold">• Manufacturer</p>
        <p className="text-2xl">DEPL</p>
        <p></p>

        {/* Row 7 */}
        <p className="text-2xl font-semibold">• Model Name</p>
        <p className="text-2xl">143 mm</p>
        <p></p>

        {/* Row 8 */}
        <p className="text-2xl font-semibold">• Serial Number</p>
        <p className="text-2xl">078643</p>
        <p></p>

        {/* Row 9 */}
        <p className="text-2xl font-semibold">• Year of Installation</p>
        <p className="text-2xl">March-2021</p>
        <p></p>

        {/* Row 10 */}
        <p className="text-2xl font-semibold">• Warranty up to</p>
        <p className="text-2xl">March-2022</p>
        <p></p>
      </div>
    </div>
  );
}
