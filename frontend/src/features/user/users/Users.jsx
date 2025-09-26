import React from "react";
import { Plus } from "lucide-react";

export default function Users() {
  return (
    <div className="min-h-screen mt-30 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="w-full bg-white shadow-2xl rounded-2xl p-8">
        <h1 className="text-3xl font-semibold text-gray-800 text-center mb-8">
          Add User
        </h1>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left Side */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                User Type
              </label>
              <div className="flex items-center gap-2">
                <select className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-400">
                  <option>Admin</option>
                  <option>User</option>
                </select>
                <button className="p-2 rounded-full bg-green-600 hover:bg-green-700 text-white transition">
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Phone
              </label>
              <input
                type="text"
                placeholder="Enter phone number"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                User Role
              </label>
              <input
                type="text"
                placeholder="Enter role"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* User Type Options */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium mb-1">
                User Category
              </label>
              <div className="flex items-center gap-3">
                <input type="radio" name="userType" /> Zone User
                <select className="border border-gray-300 rounded-lg p-2">
                  <option>Northen Railway</option>
                  <option>Southern Railway</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input type="radio" name="userType" /> Division User
              </div>
              <div className="flex items-center gap-3">
                <input type="radio" name="userType" /> Station User
                <input
                  type="text"
                  placeholder="Enter station"
                  className="flex-1 border border-gray-300 rounded-lg p-2"
                />
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                User Level
              </label>
              <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-400">
                <option>1</option>
                <option>2</option>
                <option>3</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Designation
              </label>
              <input
                type="text"
                placeholder="Enter designation"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm password"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter email"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Alert Recipient
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input type="radio" name="alert" /> Yes
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="alert" /> No
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-8">
          <button className="w-full py-3 px-6 bg-fuchsia-700 hover:bg-fuchsia-800 text-white font-semibold rounded-lg shadow-md transition">
            Add User
          </button>
        </div>
      </div>
    </div>
  );
}
