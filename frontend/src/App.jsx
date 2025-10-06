import React from 'react'
import LeftSidebar from './features/left_side_bar/LeftSidebar'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainPage from './features/pages/MianPage'
import Dashboard from './features/dasboard/Dasboard'
import Division from './features/location/division/Division'
import Rack from './features/location/rack/Rack'
import Zone from './features/location/zone/Zone'
import Station from './features/location/station/Station'
import UserLevel from './features/user/user_level/UserLevel'
import UserRole from './features/user/user_role/UserRole'
import UserType from './features/user/user_type/UserType'
import AlramCreation from './features/asset/alarm_creation/AlramCreation'
import AlarmSetup from './features/asset/alarm_setup/AlarmSetup'
import AssetAttributes from './features/asset/asset_attributes/AssetAttributes'
import AssetMaster from './features/asset/asset_master/AssetMaster'
import AssetInventry from './features/asset/asset_invetory/AssetInventry'
import Users from './features/user/users/Users'
import ReportAlarm from './features/reports/report_alarm/ReportAlarm'
import ReportAnalaysis from './features/reports/report_analaysis/ReportAnalaysis'
import Report_Asset from './features/reports/report_asset/Report_Asset'
import ReportPlaner from './features/reports/report_planner/ReportPlaner'
import ReportSystem from './features/reports/system/ReportSystem'
import Asset_Information from './features/asset/asset_master/asset_information/Asset_Information'
import Asset_History_Card from './features/asset/asset_master/asset_history_card/Asset_History_Card'
import Asset_Parameters_Trend from './features/asset/asset_master/asset_parameters_trend/Asset_Parameters_Trend'
import Asset_Downtime_History from './features/asset/asset_master/asset_downtime_history/Asset_Downtime_History'
import Asset_MTBF_MTTR from './features/asset/asset_master/asset_mtbf_mttr.jsx/Asset_MTBF_MTTR'
import AssetPerformance from './features/asset/asset_master/asset_performance/AssetPerformance'
import Entity from './features/location/entity/Entity'


export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainPage />,
      children: [
      {
      index: true,  
      element: <Dashboard />
       },
        {
          path: "/dashboard",
          element: <Dashboard />
        },
        {
          path:"/location/divison",
          element:<Division></Division>

        },
        {
          path:"/location/rack",
          element:<Rack></Rack>
        },
        {
          path:"/location/entity",
          element:<Entity></Entity>
        },
        {
          path:"/location/zone",
          element:<Zone></Zone>
        },
        {
          path:"/location/station",
         element:<Station></Station>
        },
        {
          path:"/user/userlevel",
          element:<UserLevel></UserLevel>
        },
        {
          path:"/user/userrole",
          element:<UserRole></UserRole>
        },
        {
          path:"/user/usertype",
          element:<UserType></UserType>
        },
        {
          path:"/user/user",
          element:<Users></Users>

        },
        {
          path:"/alarm/alarmcreation",
          element:<AlramCreation></AlramCreation>
        },
        {
          path:"alarm/alarmsetup",
          element:<AlarmSetup></AlarmSetup>
        },
        {
          path:"alarm/assetattribute",
          element:<AssetAttributes></AssetAttributes>
        },
        {
          path:"alarm/assetmaster",
          element:<AssetMaster></AssetMaster>,
          
        },
         {
              path:"/alarm/assetmaster/assetinformation",
              element:<Asset_Information></Asset_Information>
            },
            {
              path:"/alarm/assetmaster/assethistorycard",
              element:<Asset_History_Card></Asset_History_Card>

            },
            {
               path:"/alarm/assetmaster/asset_performance",
               element:<AssetPerformance></AssetPerformance>

            },
            {
              path:"/alarm/assetmaster/asset_parameters_trend",
              element:<Asset_Parameters_Trend></Asset_Parameters_Trend>

            },
            {
              path:"/alarm/assetmaster/asset_downtime_history",
              element:<Asset_Downtime_History></Asset_Downtime_History>

            },
            {
              path:"/alarm/assetmaster/asset_mtbf_mttr",
              element:<Asset_MTBF_MTTR></Asset_MTBF_MTTR>
            },


        {
          path:"alarm/inventory",
          element:<AssetInventry></AssetInventry>
        },
        {
          path:"/report/alarm",
          element:<ReportAlarm></ReportAlarm>
        },
        {
          path:"/report/analaysis",
          element:<ReportAnalaysis></ReportAnalaysis>
        },
        {
          path:"/report/asset",
          element:<Report_Asset></Report_Asset>
        },
        {
          path:"/report/planer",
          element:<ReportPlaner></ReportPlaner>
        },
        {
          path:"/report/system",
          element:<ReportSystem></ReportSystem>
        }
      ]
    }
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}
