import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.jpeg';

export default function LeftSidebar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openConfigSub, setOpenConfigSub] = useState(null);
  const location = useLocation();

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
    if (menu !== 'configuration' && menu !== 'planner') setOpenConfigSub(null);
  };

  const toggleConfigSub = (menu) => {
    setOpenConfigSub(openConfigSub === menu ? null : menu);
  };

  const dashboardItems = [{ name: 'Overview', path: '/dashboard' }];

  const plannerItems = [
    {
      name: 'Schedule Creation',
      key: 'scheduleCreation',
      subItems: [
        { name: 'Task Assign', path: '/maitenance/taskassgn' },
        { name: 'Task Closer', path: '/maitenance/taskclose' }
      ],
    },
    { name: 'Roster', path: '/maintenance/roster' },
    { name: 'Task Assign', path: '/planner/taskassign' },
    { name: 'Feedback', path: '/planner/taskfeedback' },
  ];

  const reportsItems = [
    { name: 'Alarm', path: '/report/alarm' },
    { name: 'Analysis', path: '/report/analaysis' },
    { name: 'Asset', path: '/report/asset' },
    { name: 'Planner', path: '/report/planer' },
    { name: 'System', path: '/report/system' },
  ];

  const locationItems = [
    { name: 'Zone', path: '/location/zone' },
    { name: 'Division', path: '/location/divison' },
    { name: 'Station', path: '/location/station' },
    { name: 'Entity', path: '/location/entity' },
    { name: 'Junction Box', path: '/location/rack' },
    { name: 'Unit of Measurement', path: '/location/uom' },
    { name: 'Severity Master', path: '/location/severitymaster'}
  ];

  const assetItems = [
    { name: 'Asset Master', path: '/alarm/assetmaster' },
    { name: 'Asset Inventory', path: '/alarm/inventory' },
    { name: 'Asset Attributes Master', path: '/alarm/assetattribute' },
    { name: 'Asset Attribute Link', path: '/alarm/alarmsetup' },
    { name: 'Alarm Creation', path: '/alarm/alarmcreation' },
  ];

  const userItems = [
    { name: 'Type', path: '/user/usertype' },
    { name: 'Level', path: '/user/userlevel' },
    { name: 'Role', path: '/user/userrole' },
    { name: 'User', path: '/user/user' },
  ];

  const configurationItems = [
    { name: 'Location Setup', key: 'locationSetup', subItems: locationItems },
    { name: 'Assets', key: 'assets', subItems: assetItems },
    { name: 'User', key: 'userMenu', subItems: userItems },
    {
      name: 'Maintenance',
      key: 'maintenance',
      subItems: [
        { name: 'Task Master', path: '/maintenance/taskmaster' },
        { name: 'Type Master', path: '/maintenance/typemaster' },
        { name: 'Status Master', path: '/maintenance/statusmaster' },
      ],
    },
  ];

  const ArrowIcon = ({ open }) => (
    <svg
      className={`w-4 h-4 transform transition-transform duration-200`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={open ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
      />
    </svg>
  );

  return (
    <div className="left-side-bar-main h-full w-[300px] text-black flex flex-col">
      {/* Logo Section */}
      <div className="logo p-6 border-b" style={{ backgroundColor: "#d8eefc" }}>
        <img
          src="https://effimon.com/images/26e6235b944c409c7f47003ebfb2b6f4.png"
          alt="Logo"
        />
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1" style={{ backgroundColor: "#d8eefc" }}>
        
        {/* Dashboard */}
        <div>
          <div
            className="p-3 rounded-lg hover:bg-fuchsia-900 cursor-pointer flex items-center justify-between"
            onClick={() => toggleDropdown('dashboard')}
          >
            <span>Dashboard</span>
            <ArrowIcon open={openDropdown === 'dashboard'} />
          </div>
          {openDropdown === 'dashboard' &&
            dashboardItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                className={`block ml-6 mt-1 p-2 rounded-lg ${
                  location.pathname === item.path
                    ? 'bg-fuchsia-900 text-white'
                    : 'bg-fuchsia-200 hover:bg-fuchsia-900'
                }`}
              >
                {item.name}
              </Link>
            ))}
        </div>

        {/* Reports */}
        <div>
          <div
            className="p-3 rounded-lg hover:bg-fuchsia-900 cursor-pointer flex items-center justify-between"
            onClick={() => toggleDropdown('reports')}
          >
            <span>Reports</span>
            <ArrowIcon open={openDropdown === 'reports'} />
          </div>
          {openDropdown === 'reports' &&
            reportsItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                className={`block ml-6 mt-1 p-2 rounded-lg ${
                  location.pathname === item.path
                    ? 'bg-fuchsia-900 text-white'
                    : 'bg-fuchsia-200 hover:bg-fuchsia-900'
                }`}
              >
                {item.name}
              </Link>
            ))}
        </div>

        {/* Planner */}
        <div>
          <div
            className="p-3 rounded-lg hover:bg-fuchsia-900 cursor-pointer flex items-center justify-between"
            onClick={() => toggleDropdown('planner')}
          >
            <span>Planner</span>
            <ArrowIcon open={openDropdown === 'planner'} />
          </div>
          {openDropdown === 'planner' &&
            plannerItems.map((item, idx) => (
              <div key={idx}>
                {item.subItems ? (
                  <>
                    <div
                      className="block ml-6 mt-1 p-2 rounded-lg hover:bg-fuchsia-900 cursor-pointer flex items-center justify-between"
                      onClick={() => toggleConfigSub(item.key)}
                    >
                      {item.name} <ArrowIcon open={openConfigSub === item.key} />
                    </div>

                    {openConfigSub === item.key &&
                      item.subItems.map((sub, i) => (
                        <Link
                          key={i}
                          to={sub.path}
                          className={`block ml-12 mt-1 p-2 rounded-lg ${
                            location.pathname === sub.path
                              ? 'bg-fuchsia-900 text-white'
                              : 'bg-fuchsia-200 hover:bg-fuchsia-900'
                          }`}
                        >
                          {sub.name}
                        </Link>
                      ))}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={`block ml-6 mt-1 p-2 rounded-lg ${
                      location.pathname === item.path
                        ? 'bg-fuchsia-900 text-white'
                        : 'bg-fuchsia-200 hover:bg-fuchsia-900'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
        </div>

        {/* Configuration */}
        <div>
          <div
            className="p-3 rounded-lg hover:bg-fuchsia-900 cursor-pointer flex items-center justify-between"
            onClick={() => toggleDropdown('configuration')}
          >
            <span>Configuration</span>
            <ArrowIcon open={openDropdown === 'configuration'} />
          </div>
          {openDropdown === 'configuration' &&
            configurationItems.map((item, idx) => (
              <div key={idx}>
                {item.subItems ? (
                  <>
                    <div
                      className="block ml-6 mt-1 p-2 rounded-lg hover:bg-fuchsia-900 cursor-pointer flex items-center justify-between"
                      onClick={() => toggleConfigSub(item.key)}
                    >
                      {item.name} <ArrowIcon open={openConfigSub === item.key} />
                    </div>
                    {openConfigSub === item.key &&
                      item.subItems.map((sub, i) => (
                        <Link
                          key={i}
                          to={sub.path}
                          className={`block ml-12 mt-1 p-2 rounded-lg ${
                            location.pathname === sub.path
                              ? 'bg-fuchsia-900 text-white'
                              : 'bg-fuchsia-200 hover:bg-fuchsia-900'
                          }`}
                        >
                          {sub.name}
                        </Link>
                      ))}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={`block ml-6 mt-1 p-2 rounded-lg ${
                      location.pathname === item.path
                        ? 'bg-fuchsia-900 text-white'
                        : 'bg-fuchsia-200 hover:bg-fuchsia-900'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
        </div>
      </nav>

      {/* Logout */}
      <div className="logout p-4 border-t" style={{ backgroundColor: "#d8eefc" }}>
        <div className="p-3 rounded-lg hover:bg-fuchsia-900 cursor-pointer transition duration-200 flex items-center">
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
}
