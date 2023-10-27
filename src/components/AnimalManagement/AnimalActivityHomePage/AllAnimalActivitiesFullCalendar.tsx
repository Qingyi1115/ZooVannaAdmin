import React, { useEffect, useState, useRef } from "react";
import Animal from "../../../models/Animal";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import useApiJson from "../../../hooks/useApiJson";
import { useNavigate } from "react-router-dom";

import { Chart } from "primereact/chart";
import { useToast } from "@/components/ui/use-toast";
import PhysiologicalReferenceNorms from "../../../models/PhysiologicalReferenceNorms";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

// import "@fullcalendar/common/main.css";
// import "@fullcalendar/daygrid/main.css";
// import "@fullcalendar/timegrid/main.css";

import AnimalActivity from "../../../models/AnimalActivity";
import { HiChevronLeft } from "react-icons/hi";
import { EventContentArg, EventInput } from "@fullcalendar/core";
import ZooEvent from "../../../models/ZooEvent";

interface AllAnimalActivitiesFullCalendarProps {
  animalActivitiesList: AnimalActivity[];
  setAnimalActivitiesList: any;
}
function AllAnimalActivitiesFullCalendar(
  props: AllAnimalActivitiesFullCalendarProps
) {
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const calendarRef = useRef<FullCalendar>(null);

  const { animalActivitiesList, setAnimalActivitiesList } = props;

  const [animalActivities, setAnimalActivities] = useState<AnimalActivity[]>(
    []
  );

  const [zooEvents, setZooEvents] = useState<any[]>([]);

  // Full Calendar stuff
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Update the calendar view when the month or year changes
  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      const newDate = new Date(currentYear, currentMonth, 1);
      calendarApi.gotoDate(newDate);
    }
  }, [currentMonth, currentYear]);

  function calculateSessionTimes(session: string, activityDate: Date) {
    // Define session start and end times
    const sessionTimes: Record<string, { start: string; end: string }> = {
      MORNING: { start: "07:00", end: "11:59" },
      AFTERNOON: { start: "12:00", end: "17:59" },
      EVENING: { start: "18:00", end: "21:59" },
    };

    // Get the start and end times for the session
    const sessionStart = sessionTimes[session].start;
    const sessionEnd = sessionTimes[session].end;

    // Convert session start and end times to Date objects
    const startTime = new Date(
      activityDate.getFullYear(),
      activityDate.getMonth(),
      activityDate.getDate(),
      parseInt(sessionStart.split(":")[0], 10), // Hours
      parseInt(sessionStart.split(":")[1], 10) // Minutes
    );

    const endTime = new Date(
      activityDate.getFullYear(),
      activityDate.getMonth(),
      activityDate.getDate(),
      parseInt(sessionEnd.split(":")[0], 10), // Hours
      parseInt(sessionEnd.split(":")[1], 10) // Minutes
    );

    return { startTime, endTime };
  }

  // const events = animalActivitiesList.map((animalActivity) => {
  //   const curZooEvents = animalActivity.zooEvents;

  //   const eventsToReturn = curZooEvents!.map((zooEvent) => {
  //     const { startTime, endTime } = calculateSessionTimes(
  //       animalActivity.eventTimingType,
  //       new Date(zooEvent.eventStartDateTime)
  //     );

  //     return {
  //       title: animalActivity.title,
  //       start: startTime, // Convert dateInMilliseconds to a Date object
  //       end: endTime, // Convert dateInMilliseconds to a Date object
  //       allDay: false,
  //       // url: `http://localhost:5173/animal/viewanimalactivitydetails/${animalActivity.animalActivityId}`,
  //       extendedProps: {
  //         animalActivityUrl: `/animal/viewanimalactivitydetails/${animalActivity.animalActivityId}`,
  //         activityType: animalActivity.activityType,
  //         details: animalActivity.details,
  //         durationInMinutes: animalActivity.durationInMinutes,
  //       },
  //     };
  //   });
  //   console.log(eventsToReturn);
  //   return eventsToReturn;
  // });

  useEffect(() => {
    // const allZooEvents = animalActivitiesList.map(
    //   (activity) => activity.zooEvents
    // );
    const combinedZooEvents = animalActivitiesList.map((animalActivity) => {
      const curZooEvents = animalActivity.zooEvents;

      const eventsToReturn = curZooEvents!.map((zooEvent) => {
        const { startTime, endTime } = calculateSessionTimes(
          animalActivity.eventTimingType,
          new Date(zooEvent.eventStartDateTime)
        );

        const curActivityType = animalActivity.activityType;

        return {
          title: animalActivity.title,
          start: startTime, // Convert dateInMilliseconds to a Date object
          end: endTime, // Convert dateInMilliseconds to a Date object
          allDay: false,
          // url: `http://localhost:5173/animal/viewanimalactivitydetails/${animalActivity.animalActivityId}`,
          extendedProps: {
            animalActivityUrl: `/animal/viewanimalactivitydetails/${animalActivity.animalActivityId}`,
            activityType: animalActivity.activityType,
            details: animalActivity.details,
            durationInMinutes: animalActivity.durationInMinutes,
          },
          classNames:
            curActivityType == "TRAINING"
              ? ["training overflow-hidden"]
              : curActivityType == "ENRICHMENT"
              ? ["enrichment overflow-hidden"]
              : curActivityType == "OBSERVATION"
              ? ["observation overflow-hidden"]
              : [],
        };
      });
      return eventsToReturn;
    });

    setZooEvents(combinedZooEvents.flat(1));
  }, []);

  interface CustomEventProps {
    event: EventInput;
  }
  function CustomEventContent({ event }: CustomEventProps) {
    // Customize the event pill content here
    return (
      <div>
        <strong>{event.title}</strong>
        <p>Type: {event.extendedProps?.activityType}</p>
        <p>Duration: {event.extendedProps?.durationInMinutes}</p>
        <p>Details: {event.extendedProps?.details}</p>
      </div>
    );
  }

  const handleEventContent = ({ event, view }: EventContentArg) => {
    // Check if it's in Week view
    if (view.type === "timeGridWeek" || view.type === "timeGridDay") {
      // Apply custom style for Week view

      return (
        <div className="p-2">
          <strong>{event.title}</strong>
          <p>
            <span className="font-medium">Type:</span>{" "}
            {event.extendedProps?.activityType}
          </p>
          <p>
            <span className="font-medium">Duration:</span>{" "}
            {event.extendedProps?.durationInMinutes} minutes
          </p>
          <p>
            <span className="font-medium">Details</span>: <br />
            {event.extendedProps?.details}
          </p>
        </div>
      );
    }

    // Default styling for other views (e.g., month view)
    return (
      <div>
        <div className="px-2 text-primary-foreground">{event.title}</div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex w-full justify-center">
        <div className="w-full">
          <div className="flex justify-between">
            <div className="mb-1 flex items-center gap-4 rounded border border-strokedark/20 px-4 text-sm">
              <span>Legend: </span>
              <div className="flex items-center gap-2 text-[#0f3360]">
                <div className="h-5 w-5 rounded bg-[#0f3360]" />
                <span className="font-bold">Observation</span>
              </div>
              <div className="flex items-center gap-2 text-[#6c0063]">
                <div className="h-5 w-5 rounded bg-[#6c0063]" />
                <span className="font-bold">Training</span>
              </div>
              <div className="flex items-center gap-2 text-[#976405]">
                <div className="h-5 w-5 rounded bg-[#976405]" />
                <span className="font-bold">Enrichment</span>
              </div>
            </div>
            {/* Month selection control */}
            <div className="mb-2 flex justify-end gap-2">
              <Select
                value={currentMonth.toString()}
                onValueChange={(value) => setCurrentMonth(parseInt(value))}
              >
                <SelectTrigger className="w-36 border-none bg-primary text-primary-foreground">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Months</SelectLabel>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {new Date(currentYear, i, 1).toLocaleDateString(
                          "default",
                          {
                            month: "long",
                          }
                        )}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {/* Year selection control */}
              <Select
                value={currentYear.toString()}
                onValueChange={(value) => setCurrentYear(parseInt(value))}
              >
                <SelectTrigger className="w-36 border-none bg-primary text-primary-foreground">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Months</SelectLabel>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {new Date(currentYear, i, 1).toLocaleDateString(
                          "default",
                          {
                            month: "long",
                          }
                        )}
                      </SelectItem>
                    ))}
                    {Array.from({ length: 10 }, (_, i) => (
                      <SelectItem
                        key={i}
                        value={(new Date().getFullYear() + i).toString()}
                      >
                        {new Date().getFullYear() + i}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <FullCalendar
            ref={calendarRef}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            editable={false}
            selectable
            selectMirror
            dayMaxEvents
            events={zooEvents}
            height={"80vh"}
            eventClick={(clickInfo) =>
              navigate(clickInfo.event.extendedProps.animalActivityUrl)
            }
            eventContent={handleEventContent}
          />
        </div>
      </div>
    </div>
  );
}

export default AllAnimalActivitiesFullCalendar;
