import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";

// import SidebarLinkGroup from "./SidebarLinkGroup";
interface PropsType {
  sidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

function Sidebar(props: PropsType) {
  const { sidebarOpen, setSidebarOpen } = props;

  const trigger = useRef<HTMLButtonElement | null>(null);
  const sidebar = useRef<HTMLDivElement | null>(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(
    Boolean(localStorage.getItem("sidebar-expanded"))
  );

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", String(sidebarExpanded));
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <div
      id="sidebar"
      ref={sidebar}
      // lg:left-auto lg:top-auto lg:translate-x-0 shrink-0 lg:sidebar-expanded:!w-64 2xl:!w-64
      className={`no-scrollbar relative left-0 top-0 z-40 flex h-screen flex-col overflow-y-auto bg-zoovanna-green transition-all duration-200 ease-in-out ${
        sidebarOpen ? "w-64 translate-x-0 p-4" : "w-0 -translate-x-64"
      }`}
    >
      {/* Sidebar header */}
      <div className="mb-10 flex justify-between pr-3 sm:px-2">
        {/* Close button */}
        <button
          ref={trigger}
          className="text-slate-500 hover:text-slate-400"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
        >
          <span className="sr-only">Close sidebar</span>
          <svg
            className="h-6 w-6 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
