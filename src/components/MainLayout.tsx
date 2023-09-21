import React from "react";
import Sidebar from "./Deprecated/Sidebar";
import { Outlet } from "react-router-dom";
import Header from "./Deprecated/Header";
import HeaderNew from "./Header/HeaderNew";
import SidebarNew from "./Sidebar/SidebarNew";

import { Toaster } from "@/components/ui/toaster";

interface PropsType {
  children: React.ReactNode;
  sidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

function MainLayout(props: PropsType) {
  const { sidebarOpen, setSidebarOpen } = props;
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarNew sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="no-scrollbar relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <HeaderNew sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {props.children}
      </div>
      <Toaster />
    </div>
  );
}

export default MainLayout;
