import React, { useState } from 'react'

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="w-full bg-gradient-to-r from-white to-gray-50 shadow-lg border-b border-gray-100 p-6">
      <div className='flex justify-between items-center max-w-7xl mx-auto'>
        {/* Title Section */}
        <div className="flex items-center space-x-4">
          {/* Logo Icon */}
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 border-4 border-white rounded-full animate-pulse"></div>
          </div>
          
          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Remote Diagnostics and Predictive Maintenance System
            </h1>
            <p className="text-gray-500 text-sm mt-1 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              System is running optimally
            </p>
          </div>
        </div>

        {/* Profile Section */}
        <div className="relative">
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="profile flex items-center space-x-4 cursor-pointer p-3 rounded-2xl hover:bg-gray-50 transition-all duration-300 group border border-transparent hover:border-gray-200"
          >
            {/* Profile Image */}
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg font-bold shadow-lg group-hover:scale-105 transition-transform duration-300">
                A
              </div>
              {/* Online status */}
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-3 border-white rounded-full shadow-sm"></span>
            </div>

            {/* Name and Role */}
            <div className="flex flex-col items-start mr-2">
              <span className="text-gray-800 font-semibold text-lg">Admin</span>
              <span className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded-full">Administrator</span>
            </div>

            {/* Dropdown arrow */}
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-gray-600' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in-50 slide-in-from-top-2">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Admin User</p>
                    <p className="text-sm text-gray-500">admin@company.com</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <a href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200 group">
                  <svg className="w-5 h-5 text-gray-400 mr-3 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile Settings
                </a>
                
                <a href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200 group">
                  <svg className="w-5 h-5 text-gray-400 mr-3 group-hover:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  System Preferences
                </a>
                
                <a href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200 group">
                  <svg className="w-5 h-5 text-gray-400 mr-3 group-hover:text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Security
                </a>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 pt-2">
                <a href="#" className="flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 group">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}