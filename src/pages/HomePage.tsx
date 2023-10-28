import React, { useEffect, useState } from "react";
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
import beautifyText from "../hooks/beautifyText";
import useApiJson from "../hooks/useApiJson";


function HomePage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const { state } = useAuthContext();
  const employee = state.user?.employeeData;

  const apiJson = useApiJson();
  const [eventGroupList, setEventGroupList] = useState<any>([]);
  const [refresh, setRefresh] = useState<any>(0);
  const [selEventGroupList, setSelEventGroupList] = useState<any[]>([]);
  const [zooEventsList, setZooEventsList] = useState<
    ZooEvent[]
  >([]);
  const [filteredZooEventsList, setFilteredZooEventsList] = useState<
    ZooEvent[]
  >([]);

  // Greeting things
  const hours = new Date().getHours();
  const timeOfDay = hours < 12 ? "morning" : hours < 18 ? "afternoon" : "evening";

  // Get assigned events (someday)
  useEffect(() => {
    apiJson.post(
      "http://localhost:3000/api/zooEvent/getAllZooEvents", {
      startDate: new Date("2010-10-02"),
      endDate: new Date("2030-10-02"),
      includes: [
        "planningStaff",
        "keepers",
        "enclosure",
        "animal",
        "inHouse",
        "animalActivity",
        "feedingPlanSessionDetail",
      ]
    }
    ).then(responseJson => {

      console.log("responseJson", responseJson)

      const allEventGroup: any[] = [];


      const a = responseJson["zooEvents"].map(ze => {
        return { ...ze, eventType: beautifyText(ze.eventType) }
      });

      a.forEach((ze: ZooEvent) => {
        if (!allEventGroup.find(et => et == ze.eventType)) {
          allEventGroup.push(ze.eventType);
        }

      });
      setEventGroupList(allEventGroup);

      const newGp = allEventGroup.filter(gp => selEventGroupList.includes(gp));
      if (selEventGroupList.length == 0 || newGp.length == 0) {
        setSelEventGroupList(allEventGroup);
      } else {
        setSelEventGroupList(newGp);
      }
      setFilteredZooEventsList(a);
      return setZooEventsList(a);

    }).catch(error => {
      console.log(error);
    });
  }, [refresh]);

  useEffect(() => {
    setFilteredZooEventsList(
      zooEventsList.filter(ze => {
        return selEventGroupList.find(et => ze.eventType == et);
      })
    )
  }, [selEventGroupList]);

  return (
    <div className="h-screen max-w-screen p-10">
      <div className="flex shrink h-5/6 w-full gap-10">
        <Card className="h-max w-max">
          {" "}
          <CardHeader>
            <CardTitle>Good {timeOfDay}, {employee.employeeName}</CardTitle>
            <CardDescription className="w-[25vw]">
              Here are your events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AllEventsFullCalendar
              zooEventsList={filteredZooEventsList}
              setRefresh={() => { }}
            />
          </CardContent>
        </Card>
        <div className="flex flex-col gap-4">
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
          {(employee.superAdmin || employee.planningStaff || employee.generalStaff) &&
            <MaintenanceNotificationCard />}

        </div>
      </div>
    </div>
  );
}

export default HomePage;
