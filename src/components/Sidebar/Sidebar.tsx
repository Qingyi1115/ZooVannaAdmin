import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { NavLink, useLocation } from "react-router-dom";

import * as Accordion from "@radix-ui/react-accordion";
import { HiChevronDown } from "react-icons/hi";

// import SidebarLinkGroup from "./SidebarLinkGroup";
interface PropsType {
  sidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

interface Props {
  children: React.ReactNode;
}

// other mini components
const AccordionTrigger = ({ children }: Props) => (
  <Accordion.Header className="w-gull mt-4 flex h-full items-center rounded px-2 py-1 transition-all hover:bg-zoovanna-green-dark">
    <Accordion.Trigger className="group flex w-full items-center justify-between text-left text-sm font-bold text-zoovanna-cream lg:text-base">
      {children}
      {/* <TriangleDownIcon className="transition-all duration-100 group-data-[state=open]:rotate-180" /> */}
      <HiChevronDown
        size={"1.5rem"}
        className="transition-all duration-100 group-data-[state=open]:rotate-180"
      />
    </Accordion.Trigger>
  </Accordion.Header>
);

const AccordionContentBox = ({ children }: Props) => (
  <Accordion.Content className="mt-2 bg-zoovanna-green pl-6 data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
    <div className="flex flex-col gap-2">{children}</div>
  </Accordion.Content>
);

const SidebarButton = ({ children }: Props) => (
  <div className="text-sm text-zoovanna-cream hover:font-medium lg:text-base">
    {children}
  </div>
);

// main
function Sidebar(props: PropsType) {
  const { sidebarOpen, setSidebarOpen } = props;

  return (
    <div
      id="sidebar"
      className={`no-scrollbar relative left-0 top-0 z-40 flex h-screen flex-col overflow-y-auto bg-zoovanna-green transition-all duration-200 ease-in-out ${
        sidebarOpen
          ? "w-40 translate-x-0 px-2 py-4 lg:w-64"
          : "w-0 -translate-x-56"
      }`}
    >
      {/* Sidebar header */}
      <div className="mb-10 flex w-full justify-between pr-3 sm:px-2">
        <div className="w-full">
          <Link to="/">
            <img
              src="/logos/cream-ZOOVANNA.png"
              alt="Zoovanna Logo"
              className="m-auto mb-8 mt-4 w-11/12"
            />
          </Link>
          <Accordion.Root className="w-full rounded-lg" type="multiple">
            <Accordion.Item className="w-full overflow-hidden" value="item-1">
              <AccordionTrigger>System Accounts</AccordionTrigger>
              <AccordionContentBox>
                <Link to="/">
                  <SidebarButton>View All Employee Accounts</SidebarButton>
                </Link>
                <Link to="/">
                  <SidebarButton>Create New Account</SidebarButton>
                </Link>
              </AccordionContentBox>
            </Accordion.Item>

            <Accordion.Item className="w-full overflow-hidden" value="item-2">
              <AccordionTrigger>Species Management</AccordionTrigger>
              <AccordionContentBox>
                <Link to="/viewallspecies">
                  <SidebarButton>View All Species</SidebarButton>
                </Link>
                <Link to="/createspecies">
                  <SidebarButton>Create New Species</SidebarButton>
                </Link>
              </AccordionContentBox>
            </Accordion.Item>

            {/* When you copy paste, remember to change the value */}
            <Accordion.Item className="w-full overflow-hidden" value="item-3">
              <AccordionTrigger>Test 2</AccordionTrigger>
              <AccordionContentBox>
                <Link to="/">
                  <SidebarButton>Bla 2</SidebarButton>
                </Link>
                <Link to="/">
                  <SidebarButton>Bla bla 2</SidebarButton>
                </Link>
              </AccordionContentBox>
            </Accordion.Item>

            <Accordion.Item className="w-full overflow-hidden" value="item-4">
              <AccordionTrigger>Test 3</AccordionTrigger>
              <AccordionContentBox>
                <Link to="/">
                  <SidebarButton>Bla 3</SidebarButton>
                </Link>
                <Link to="/">
                  <SidebarButton>Bla bla 3</SidebarButton>
                </Link>
              </AccordionContentBox>
            </Accordion.Item>
          </Accordion.Root>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
