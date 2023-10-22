import { useEffect, useState } from "react";

import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HiPlus } from "react-icons/hi";
import { Separator } from "@/components/ui/separator";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import { Toggle } from "@/components/ui/toggle";
import useApiJson from "../../hooks/useApiJson";

import ZooEvent from "../../models/ZooEvent";

import { HiCalendarDays, HiTableCells } from "react-icons/hi2";

import AllEventsDatatable from "../../components/EventManagement/ZooEventHomePage/AllZooEventsDatatable";
import AllEventsFullCalendar from "../../components/EventManagement/ZooEventHomePage/AllZooEventsFullCalendar";

function ZooEventHomePage() {
  const apiJson = useApiJson();
  const [isDatatableView, setIsDatatableView] = useState<boolean>(true);

  const [zooEventsList, setZooEventsList] = useState<
    ZooEvent[]
  >([]);

  useEffect(() => {
    apiJson.post(
      "http://localhost:3000/api/zooEvent/getAllZooEvents", {
        startDate: new Date("1970-01-01").getTime(),
        endDate: new Date("2200-12-31").getTime(),
        includes: ["planningStaff",
          "keepers",
          "enclosure",
          "animal",
          "inHouse",
          "animalActivity"]
      }
    ).then(responseJson=>{
      setZooEventsList(responseJson["zooEvents"] as ZooEvent[])
    }).catch(error=>{
      console.log(error);
    });
  }, []);

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
        {/* Title Header and back button */}
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">
            
            <NavLink to={"/zooevent/createzooevent"}>
              <Button className="mr-2 flex items-center">
                <HiPlus className="mr-2" />
                Add Event
              </Button>
            </NavLink>

            <span className=" self-center text-title-xl font-bold">
              All Events
            </span>
          </div>
          <Separator />
        </div>
        <div className="flex w-full flex-col items-center gap-4 rounded-md bg-whiten/50 p-4">
          <div className="h-max w-max">
            {/* View Selector */}
            <Toggle
              id="toggleDatatable"
              aria-label="Toggle View Datatable"
              pressed={isDatatableView}
              onPressedChange={setIsDatatableView}
              className={`h-min w-min rounded-l-lg rounded-r-none px-3 py-2 transition-all data-[state=off]:bg-gray data-[state=on]:bg-primary data-[state=off]:text-whiten`}
            >
              <HiTableCells
                className={`${!isDatatableView && "fill-graydark/50"} h-6 w-6`}
              />
            </Toggle>
            <Toggle
              id="toggleCalendar"
              aria-label="Toggle View Calendar"
              pressed={!isDatatableView}
              onPressedChange={() => setIsDatatableView(!isDatatableView)}
              className={`group h-min w-min rounded-l-none rounded-r-lg px-3 py-2 transition-all data-[state=off]:bg-gray data-[state=on]:bg-primary data-[state=off]:text-whiten`}
            >
              <HiCalendarDays
                className={`${isDatatableView && "fill-graydark/50"} h-6 w-6`}
              />
            </Toggle>
          </div>
          <div className="text-2xl font-medium">
            {isDatatableView ? (
              <span>Datatable View</span>
            ) : (
              <span>Calendar View</span>
            )}
          </div>
        </div>
        {isDatatableView ? (
            <AllEventsDatatable
              zooEventsList={zooEventsList}
              setZooEventsList={setZooEventsList}
            />
          ) : (
          <AllEventsFullCalendar
            zooEventsList={zooEventsList}
            setZooEventsList={setZooEventsList}
          />
        )}
      </div>
    </div>
  );
}

export default ZooEventHomePage;
