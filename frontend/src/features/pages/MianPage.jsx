import React from 'react'
import LeftSidebar from '../left_side_bar/LeftSidebar'
import { Link,Outlet } from 'react-router-dom'
import './mainpage.css'
import Header from '../../comman/Header'

export default function MianPage() {
  return (
    <div>
      
      <div className="main">
      
      <div className="left-side-bar">
        <LeftSidebar></LeftSidebar>
      </div>
      
      <div className="right-side-bar">
        <Header></Header>
        <Outlet></Outlet>
      </div>

      </div>
 
    </div>
  )
}
