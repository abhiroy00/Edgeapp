import React, { useState } from 'react'

export default function AssetMaster() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    assetName: '',
    assetPrefix: '',
    assetStatus: 'Active'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    setIsFormOpen(false);
    setFormData({ assetName: '', assetPrefix: '', assetStatus: 'Active' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br  from-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Asset Master</h1>
            <p className="text-gray-600 mt-2">Manage your assets efficiently</p>
          </div>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-gradient-to-r from-fuchsia-700 to-purple-600 hover:from-fuchsia-800 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Asset</span>
          </button>
        </div>

        {/* Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
              {/* Header */}
              <div className="bg-gradient-to-r from-fuchsia-700 to-purple-600 p-6 rounded-t-xl">
                <h2 className="text-2xl font-bold text-white">Add New Asset</h2>
                <p className="text-fuchsia-100 mt-1">Enter asset details below</p>
              </div>
              
              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label htmlFor="assetName" className="block text-sm font-medium text-gray-700 mb-2">
                    Asset Name
                  </label>
                  <input
                    type="text"
                    id="assetName"
                    name="assetName"
                    value={formData.assetName}
                    onChange={handleInputChange}
                   
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="assetPrefix" className="block text-sm font-medium text-gray-700 mb-2">
                    Asset Prefix
                  </label>
                  <input
                    type="text"
                    id="assetPrefix"
                    name="assetPrefix"
                    value={formData.assetPrefix}
                    onChange={handleInputChange}
               
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="assetStatus" className="block text-sm font-medium text-gray-700 mb-2">
                    Asset Status
                  </label>
                  <select
                    id="assetStatus"
                    name="assetStatus"
                    value={formData.assetStatus}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-fuchsia-700 to-purple-600 hover:from-fuchsia-800 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Add Asset
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isFormOpen && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center mt-8">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-fuchsia-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-fuchsia-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Assets Added Yet</h3>
              <p className="text-gray-600 mb-6">Get started by adding your first asset to the system.</p>
              <button 
                onClick={() => setIsFormOpen(true)}
                className="bg-gradient-to-r from-fuchsia-700 to-purple-600 hover:from-fuchsia-800 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Add Your First Asset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}