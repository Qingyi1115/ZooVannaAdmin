import React from "react";
import Sidebar from "./Deprecated/Sidebar";
import { Outlet } from "react-router-dom";
import Header from "./Deprecated/Header";
import HeaderNew from "./Header/HeaderNew";
import SidebarNew from "./Sidebar/SidebarNew";

import { Toaster } from "@/components/ui/toaster";

import { useAuthContext } from "../hooks/useAuthContext";
interface PropsType {
  children: React.ReactNode;
  sidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

function MainLayout(props: PropsType) {
  const { sidebarOpen, setSidebarOpen } = props;
  const { state } = useAuthContext();
  const { user } = state;
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {user && (
        <SidebarNew sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      )}
      <div className="no-scrollbar relative flex w-full flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {user && (
          <HeaderNew
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        )}
        {props.children}
      </div>
      <Toaster />
    </div>
  );
}

export default MainLayout;
