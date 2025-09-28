import React from 'react'
import { Outlet ,Link} from 'react-router-dom'

export default function Report_Asset() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      {/* Station Info Card */}
      <div
        className="w-full mt-30 shadow-2xl rounded-2xl p-8 mb-8"
        style={{ backgroundColor: "#d8eefc" }}
      >
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <p className="font-bold text-lg">Station : Pt Ram Prasad Bismil (PRPM)</p>
          <p className="font-bold text-lg">Division : Moradabad</p>
          <p className="font-bold text-lg">Zone : Northern Railway</p>
        </div>
      </div>

      {/* Asset Menu Card */}
      <div className="w-full shadow-2xl rounded-2xl p-8 bg-white">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Asset Reports</h2>
        <ul className="list-disc list-inside space-y-3 text-gray-700 font-medium">
         <Link to="/alarm/assetmaster/assetinformation"> <li className="hover:text-blue-600 transition cursor-pointer">Asset Information</li></Link>
         <Link to="/alarm/assetmaster/assethistorycard"> <li className="hover:text-blue-600 transition cursor-pointer">Asset History Card</li></Link>
         <Link to="/alarm/assetmaster/asset_performance"><li className="hover:text-blue-600 transition cursor-pointer">Asset Performance</li></Link> 
         <Link to="/alarm/assetmaster/asset_parameters_trend"> <li className="hover:text-blue-600 transition cursor-pointer">Asset Parameters Trend</li></Link>
         <Link to="/alarm/assetmaster/asset_downtime_history"><li className="hover:text-blue-600 transition cursor-pointer">Asset Downtime History</li></Link>
         <Link to="/alarm/assetmaster/asset_mtbf_mttr"><li className="hover:text-blue-600 transition cursor-pointer">Asset MTBF & MTTR</li></Link>
        </ul>
      </div>

      <Outlet></Outlet>
      
    </div>
  )
}
