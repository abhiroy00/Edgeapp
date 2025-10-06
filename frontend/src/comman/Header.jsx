import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className=" w-full bg-gradient-to-r from-white to-gray-50 shadow-lg border-b fixed border-gray-100 p-6 z-50">
      <div className="flex gap-160 items-center max-w-7xl mx-auto">
        {/* Title Section (no change in height/width) */}
        <div className="flex items-center space-x-4 relative right-32">
          <img
            className="h-[60px] w-52"
            src="https://effimon.com/images/26e6235b944c409c7f47003ebfb2b6f4.png"
            alt="Effimon Logo"
          />
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
              <span className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded-full">
                Administrator
              </span>
            </div>

            {/* Dropdown arrow */}
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                isDropdownOpen ? "rotate-180 text-gray-600" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
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
                    <p className="text-sm text-gray-500">admin@effimon.com</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <Link
                  to="/user/profileview"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <svg
                    className="w-5 h-5 text-gray-400 mr-3 group-hover:text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.121 17.804A1 1 0 016 17h12a1 1 0 01.879.516l3 5A1 1 0 0121 24H3a1 1 0 01-.879-1.484l3-5zM12 14a7 7 0 100-14 7 7 0 000 14z"
                    />
                  </svg>
                  View Profile
                </Link>

                <Link
                  to="/user/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <svg
                    className="w-5 h-5 text-gray-400 mr-3 group-hover:text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536M9 11l6 6L21 9l-6-6-6 6zM3 21h6"
                    />
                  </svg>
                  Profile Settings
                </Link>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 pt-2">
                <a
                  href="#"
                  className="flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 group"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign Out
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
