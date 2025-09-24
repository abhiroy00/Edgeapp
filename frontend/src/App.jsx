import React from 'react'
import LeftSidebar from './features/left_side_bar/LeftSidebar'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainPage from './features/pages/MianPage'
import Dashboard from './features/dasboard/Dasboard'
import Division from './features/location/division/Division'
import Rack from './features/location/rack/Rack'
import Track from './features/location/track/Track'
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

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainPage />,
      children: [
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
          path:"/location/track",
          element:<Track></Track>
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
          element:<AssetMaster></AssetMaster>
        },
        {
          path:"alarm/inventory",
          element:<AssetInventry></AssetInventry>
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
