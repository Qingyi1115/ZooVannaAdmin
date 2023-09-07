import React from "react";
import Sidebar from "./Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";

interface PropsType {
  children: React.ReactNode;
  sidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

function MainLayout(props: PropsType) {
  const { sidebarOpen, setSidebarOpen } = props;
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex w-full flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {props.children}
      </div>
    </div>
  );
}

export default MainLayout;
