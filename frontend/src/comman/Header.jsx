import React from 'react'

export default function Header() {
  return (
    <div className="w-full bg-white shadow-md p-4">
      <div className='flex justify-between items-center'>
        {/* Title */}
        <h1 className="text-xl font-bold text-gray-800">
          Remote Diagnostics and Predictive Maintenance System
        </h1>

        {/* Profile / Logo */}
        <div className="profile flex items-center space-x-3 cursor-pointer relative group">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-semibold">
              A
            </div>
            {/* Online status */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>

          {/* Name and dropdown */}
          <div className="flex flex-col">
            <span className="text-gray-700 font-medium">Admin</span>
            <span className="text-gray-400 text-xs">Administrator</span>
          </div>

          {/* Dropdown arrow */}
          <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}
