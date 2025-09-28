import React from 'react'

export default function Asset_Downtime_History() {
  return (
    <div>
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

      <div className="w-full p-6 space-y-6 bg-white shadow-lg rounded-xl">

  {/* Row 1: Asset Type and Physical Asset */}

  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
    <div className="w-full md:w-1/2">
      <label className="block text-gray-700 font-medium mb-1 pl-1">
        Asset Type
      </label>
      <select className="w-full border border-gray-300 rounded-lg py-2 pl-1 pr-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500">
        <option>Point Machine</option>
        <option>LED SIGNAL</option>
        <option>AXLE COUNT</option>
      </select>
    </div>


<div className="w-full md:w-1/2 mt-4 md:mt-0 md:pl-6">

  <label className="block text-gray-700 font-medium mb-1 pl-1">Physical Asset</label>

  <select className="w-full border border-gray-300 rounded-lg py-2 pl-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500">
    <option value="PM53A">PM53A</option>
    <option value="PM53B">PM53B</option>
    <option value="PM53C">PM53C</option>
    <option value="PM53D">PM53D</option>
  </select>
</div>


  </div>

  {/* Row 2: Date From and Date To */}
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

    <div className="w-full md:w-1/2">

      <label className="block text-gray-700 font-medium mb-1 pl-1">Date From</label>


      <select className="w-full border border-gray-300 rounded-lg py-2 pl-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option>25/01/2024</option>
        <option>26/01/2024</option>
        <option>27/01/2024</option>
      </select>
    </div>

    <div className="w-full md:w-1/2">
      <label className="block text-gray-700 font-medium mb-1 pl-1">
        Date To
      </label>
      <select className="w-full border border-gray-300 rounded-lg py-2 pl-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option>26/01/2024</option>
        <option>27/01/2024</option>
        <option>28/01/2024</option>
      </select>
    </div>
  </div>

  {/* Row 3: Problem Occurrence / Down Time List */}
  <div className='flex justify-between'>
    <p>Problem</p>
    <p>Occurence</p>
    <p>Downtime</p>
  </div>



</div>



      

      
    </div>
  )
}
