import React from "react";
import LeftSidebar from "../left_side_bar/LeftSidebar";
import { Outlet } from "react-router-dom";
import "./mainpage.css";
import Header from "../../comman/Header";

export default function MainPage() {
  return (
    <div className="main">
      {/* Left Sidebar */}
      <div className="left-side-bar">
        <LeftSidebar />
      </div>

      {/* Right Section */}
      <div className="right-side-bar">
        <div className="header-container">
          <Header />
        </div>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
