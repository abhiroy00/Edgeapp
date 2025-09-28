import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.jpeg'

export default function LeftSidebar() {
  const [openDropdown, setOpenDropdown] = useState(null)

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu)
  }

  const dashboardItems = [
    { name: 'Overview', path: '/dashboard' },
    
  ]

  const reportsItems = [
    { name: 'Alarm', path: '/report/alarm' },
    { name: 'Analaysis', path: '/report/analaysis' },
    { name: 'Asset', path: '/report/asset' },
    { name: 'Planer', path: '/report/planer' },
    { name: 'System', path: '/report/system' },
  
  ]

  const locationItems = [
    { name: 'Division', path: '/location/divison' },
    { name: 'Zone', path: '/location/zone' },
    { name: 'Track', path: '/location/track' },
    { name: 'Rack', path: '/location/rack' },
    {name:'Station',path:'/location/station'}
  ]

  const assetItems = [
    { name: 'Asset Master', path: 'alarm/assetmaster' },
    { name: 'Asset Inventory', path: 'alarm/inventory' },
    { name: 'Asset Attributes', path: 'alarm/assetattribute' },
    { name: 'Alarm Setup', path: 'alarm/alarmsetup' },
    { name: 'Alarm Creation', path: '/alarm/alarmcreation' }
  ]

  const userItems = [
    { name: 'Type', path: '/user/userlevel' },
    { name: 'Level', path: '/user/userrole' },
    { name: 'Role', path: '/user/usertype' },
    { name: 'User', path: '/user/user' }
  ]

  return (
    <div className="left-side-bar-main h-full w-[300px] text-black flex flex-col">
      {/* Logo Section */}
      <div className="logo p-6 border-b" style={{backgroundColor:"#d8eefc"}}>
        <img src="https://effimon.com/images/26e6235b944c409c7f47003ebfb2b6f4.png" alt="" />
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1 " style={{backgroundColor:"#d8eefc"}}>
        {/* Dashboard with Dropdown */}
        <div>
          <div 
            className="dashboard p-3 rounded-lg hover:bg-fuchsia-900 cursor-pointer transition duration-200 flex items-center justify-between"
            onClick={() => toggleDropdown('dashboard')}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-black">Dashboard</span>
            </div>
            <svg 
              className={`w-4 h-4 transform transition-transform duration-200 text-black ${
                openDropdown === 'dashboard' ? 'rotate-180' : ''
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {/* Dashboard Dropdown Items */}
          {openDropdown === 'dashboard' && (
            <div className="ml-6 mt-1 space-y-1 border-l-2 border-fuchsia-900 pl-3">
              {dashboardItems.map((item, index) => (
                <Link 
                  key={index} 
                  to={item.path}
                  className="block p-2  bg-fuchsia-200 rounded-lg hover:bg-fuchsia-900 cursor-pointer transition duration-200 text-black hover:text-white"

                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Location with Dropdown */}
        <div>
          <div 
            className="location p-3 rounded-lg hover:bg-fuchsia-900 cursor-pointer transition duration-200 flex items-center justify-between"
            onClick={() => toggleDropdown('location')}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-black">Location</span>
            </div>
            <svg 
              className={`w-4 h-4 transform transition-transform duration-200 text-black ${
                openDropdown === 'location' ? 'rotate-180' : ''
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {/* Location Dropdown Items */}
          {openDropdown === 'location' && (
            <div className="ml-6 mt-1 space-y-1 border-l-2 border-fuchsia-900 pl-3">
              {locationItems.map((item, index) => (
                <Link 
                  key={index} 
                  to={item.path}
                  className="block p-2  bg-fuchsia-200 rounded-lg hover:bg-fuchsia-900 cursor-pointer transition duration-200 text-black hover:text-white"
                 
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Asset Management with Dropdown */}
        <div>
          <div 
            className="asset-management p-3 rounded-lg hover:bg-fuchsia-900 cursor-pointer transition duration-200 flex items-center justify-between"
            onClick={() => toggleDropdown('asset')}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="text-black">Asset Management</span>
            </div>
            <svg 
              className={`w-4 h-4 transform transition-transform duration-200 text-black ${
                openDropdown === 'asset' ? 'rotate-180' : ''
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {/* Asset Management Dropdown Items */}
          {openDropdown === 'asset' && (
            <div className="ml-6 mt-1 space-y-1 border-l-2 border-fuchsia-900 pl-3">
              {assetItems.map((item, index) => (
                <Link 
                  key={index} 
                  to={item.path}
                  className="block p-2  bg-fuchsia-200 rounded-lg hover:bg-fuchsia-900 cursor-pointer transition duration-200 text-black hover:text-white"
                  
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* User Management with Dropdown */}
        <div>
          <div 
            className="user-management p-3 rounded-lg hover:bg-fuchsia-900 cursor-pointer transition duration-200 flex items-center justify-between"
            onClick={() => toggleDropdown('user')}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-black">Users</span>
            </div>
            <svg 
              className={`w-4 h-4 transform transition-transform duration-200 text-black ${
                openDropdown === 'user' ? 'rotate-180' : ''
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {/* User Management Dropdown Items */}
          {openDropdown === 'user' && (
            <div className="ml-6 mt-1 space-y-1 border-l-2 border-fuchsia-900 pl-3">
              {userItems.map((item, index) => (
                <Link 
                  key={index} 
                  to={item.path}
                  className="block p-2  bg-fuchsia-200 rounded-lg hover:bg-fuchsia-900 cursor-pointer transition duration-200 text-black hover:text-white"
                  
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>
        
        {/* Reports with Dropdown */}
        <div>
          <div 
            className="reports p-3 rounded-lg hover:bg-fuchsia-900 cursor-pointer transition duration-200 flex items-center justify-between"
            onClick={() => toggleDropdown('reports')}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-black">Reports</span>
            </div>
            <svg 
              className={`w-4 h-4 transform transition-transform duration-200 text-black ${
                openDropdown === 'reports' ? 'rotate-180' : ''
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {/* Reports Dropdown Items */}
          {openDropdown === 'reports' && (
            <div className="ml-6 mt-1 space-y-1 border-l-2 border-fuchsia-900 pl-3">
              {reportsItems.map((item, index) => (
                <Link 
                  key={index} 
                  to={item.path}
                  className="block p-2  bg-fuchsia-200 rounded-lg hover:bg-fuchsia-900 cursor-pointer transition duration-200 text-black hover:text-white"
                 
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>
        
        {/* Planner */}
        <div className="planner p-3 rounded-lg hover:bg-fuchsia-900 cursor-pointer transition duration-200 flex items-center">
          <svg className="w-5 h-5 mr-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-black">Planner</span>
        </div>
        
        {/* Configuration */}
        <div className="configuration  rounded-lg hover:bg-fuchsia-900 cursor-pointer transition duration-200 flex items-center">
          <svg className="w-5 h-5 mr-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-black">Configuration</span>
        </div>
      </nav>
      
      {/* Logout Section */}
      <div className="logout p-4 border-t" style={{backgroundColor:"#d8eefc"}}>
        <div className="p-3 rounded-lg hover:bg-fuchsia-900 cursor-pointer transition duration-200 flex items-center">
          <svg className="w-5 h-5 mr-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="text-black">Logout</span>
        </div>
      </div>
    </div>
  )
}