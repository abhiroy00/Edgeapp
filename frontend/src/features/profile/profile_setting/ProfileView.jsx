import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileView() {
  const navigate = useNavigate();

  // Example profile data (replace later with API data)
  const user = {
    name: "Abhishek Kumar",
    email: "admin@effimon.com",
    phone: "+91 9876543210",
    role: "Administrator",
    address: "Noida, Uttar Pradesh, India",
    joined: "January 10, 2023",
    avatar: "https://effimon.com/images/26e6235b944c409c7f47003ebfb2b6f4.png",
  };

  return (
    <div className="mt-30 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200 w-full max-w-3xl p-8 transition-all hover:shadow-3xl">
        
        {/* Profile Header */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={user.avatar}
              alt="Profile Avatar"
              className="w-28 h-28 rounded-2xl shadow-md border-4 border-white object-contain"
            />
            <span className="absolute bottom-2 right-2 w-5 h-5 bg-green-400 border-2 border-white rounded-full"></span>
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-blue-600 text-sm font-semibold bg-blue-50 px-3 py-1 rounded-full mt-2">
            {user.role}
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
          <div className="space-y-1">
            <p className="text-sm text-gray-400">Full Name</p>
            <p className="font-semibold text-lg">{user.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-400">Email Address</p>
            <p className="font-semibold text-lg">{user.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-400">Phone Number</p>
            <p className="font-semibold text-lg">{user.phone}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-400">Role</p>
            <p className="font-semibold text-lg">{user.role}</p>
          </div>
          <div className="space-y-1 sm:col-span-2">
            <p className="text-sm text-gray-400">Address</p>
            <p className="font-semibold text-lg">{user.address}</p>
          </div>
          <div className="space-y-1 sm:col-span-2">
            <p className="text-sm text-gray-400">Joined On</p>
            <p className="font-semibold text-lg">{user.joined}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
          >
            ← Back
          </button>
          <button
            onClick={() => navigate("/user/profile")}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
