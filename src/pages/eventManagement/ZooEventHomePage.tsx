import { useEffect, useRef, useState } from "react";

import { NavLink, useNavigate } from "react-router-dom";
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
import { SplitButton } from "primereact/splitbutton";
import { Toast } from 'primereact/toast';

const YEAR_IN_MILLISECONDS = 1000 * 60 * 60 * 24 * 365
interface eventGroup {
  groupId: number;
  groupType: string;
}

function ZooEventHomePage() {
  const apiJson = useApiJson();
  const [isDatatableView, setIsDatatableView] = useState<boolean>(true);

  const [calendarStartDate, setCalendarStartDate] = useState<Date>(new Date(Date.now() - YEAR_IN_MILLISECONDS));
  const [calendarEndDate, setCalendarEndDate] = useState<Date>(new Date(Date.now() + YEAR_IN_MILLISECONDS));
  const [eventGroupList, setEventGroupList] = useState<eventGroup[] | null>(null);
  const toast = useRef(null);
  const [zooEventsList, setZooEventsList] = useState<
    ZooEvent[]
  >([]);
  const navigate = useNavigate();

  useEffect(() => {
    apiJson.post(
      "http://localhost:3000/api/zooEvent/getAllZooEvents", {
      startDate: calendarStartDate,
      endDate: calendarEndDate,
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
      if (eventGroupList === null) {
        setEventGroupList(responseJson["zooEvents"].map((ze: ZooEvent) => {
          if (ze.animalActivity) {
            return { groupId: ze.animalActivity.animalActivityId, groupType: "animalActivity" }
          } else if (ze.feedingPlanSessionDetail) {
            return { groupId: ze.feedingPlanSessionDetail.feedingPlanSessionDetailId, groupType: "feedingPlanSessionDetail" }
          } else if (ze) {

          }
        }))
        return setZooEventsList(responseJson["zooEvents"] as ZooEvent[])
      }

      const filteredEvents = [] as any[];
      for (const ze of responseJson["zooEvents"]) {
        if (
          eventGroupList.find(eventGroup => {
            if (eventGroup.groupType == "animalActivity") {
              return eventGroup.groupId == ze.animalActivity?.animalActivityId;
            } else if (eventGroup.groupType == "feedingPlanSessionDetail") {
              return eventGroup.groupId == ze.feedingPlanSessionDetail?.feedingPlanSessionDetailId;
            } else if (eventGroup.groupType == "public") {

            }
          })
        ) {
          filteredEvents.push(ze);
        }
      }
      return setZooEventsList(filteredEvents);

    }).catch(error => {
      console.log(error);
    });
  }, []);

  const items = [
    {
      label: 'Add Animal Activity',
      command: () => {
        navigate(`/zooevent/viewallzooevents/`, { replace: true })
        navigate(`/animal/createanimalactivity`)
      }
    },
    {
      label: 'Add Animal Observation',
      command: () => {
        navigate(`/zooevent/viewallzooevents/`, { replace: true })
        navigate(`/animal/createanimalobservation`)
      }
    },
    {
      label: 'Add Feeding Plan',
      command: () => {
        navigate(`/zooevent/viewallzooevents/`, { replace: true })
        navigate(`/animal/createfeedingplan`)
      }
    }
  ];

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
        {/* Title Header and back button */}
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">
            <SplitButton
              label="Add Internal Event"
              className="mr-2 my-3 flex items-center"
              model={items}
              onClick={() => {
                navigate(`/zooevent/viewallzooevents/`, { replace: true })
                navigate(`/zooevent/createnewzooevent/`)
              }}
            >
              <HiPlus className="mr-2" />
              Add Internal Event
            </SplitButton>

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
