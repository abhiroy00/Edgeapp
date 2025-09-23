import React from 'react'
import LeftSidebar from './features/left_side_bar/LeftSidebar'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainPage from './features/pages/MianPage'
import Dashboard from './features/dasboard/Dasboard'

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainPage />,
      children: [
        {
          path: "/dashboard",
          element: <Dashboard />
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
