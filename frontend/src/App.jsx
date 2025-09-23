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
