import React, { useState } from "react";
import Sidebar from "../components/Deprecated/Sidebar";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FatAnimalsCard from "../components/HomePage/FatAnimalsCard";
import MaintenanceNotificationCard from "../components/HomePage/MaintenanceNotificationCard";
import { useAuthContext } from "../hooks/useAuthContext";
import AllEventsFullCalendar from "../components/EventManagement/ZooEventHomePage/AllZooEventsFullCalendar";
import ZooEvent from "../models/ZooEvent";


function HomePage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const { state } = useAuthContext();
  const employee = state.user?.employeeData;
  const [filteredZooEventsList, setFilteredZooEventsList] = useState<
    ZooEvent[]
  >([]);
  
  return (
    <div className="h-screen w-full p-10">
      <div className="flex h-5/6 w-full gap-10">
        
      <AllEventsFullCalendar
            zooEventsList={filteredZooEventsList}
            setRefresh={()=>{}}
          />
        <FatAnimalsCard />
        {/* <div className="flex flex-col gap-10">
          <Card className="h-1/2 w-full flex-grow p-10">
            <Skeleton className="h-[20px] w-[100px] rounded-full" />
          </Card>
          <div className="flex gap-10">
            <Card className="h-full w-full p-10">
              <Skeleton className="h-[20px] w-[100px] rounded-full" />
            </Card>
            <Card className="h-full w-full p-10">
              <Skeleton className="h-[20px] w-[100px] rounded-full" />
            </Card>
          </div>
        </div> */}
        {

        (employee.planningStaff || employee.generalStaff) &&
        <MaintenanceNotificationCard/>
        }
        

      </div>
    </div>
  );
}

export default HomePage;
