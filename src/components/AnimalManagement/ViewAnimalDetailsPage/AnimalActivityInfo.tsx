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
import SpeciesCard from "./SpeciesCard";
import EnclosureCard from "./EnclosureCard";
import AnimalWeightDatatable from "./AnimalWeightDatatable";

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

interface AnimalActivityInfoProps {
  curAnimal: Animal;
}

function AnimalActivityInfo(props: AnimalActivityInfoProps) {
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const calendarRef = useRef<FullCalendar>(null);

  const { curAnimal } = props;

  const [animalActivities, setAnimalActivities] = useState<AnimalActivity[]>(
    []
  );

  useEffect(() => {
    const fetchAnimalActivities = async () => {
      try {
        const responseJson = await apiJson.get(
          "http://localhost:3000/api/animal/getAllAnimalActivities"
        );
        const filteredActivities = (responseJson as AnimalActivity[]).filter(
          (activity) =>
            activity.animals?.some(
              (animal) => animal.animalCode === curAnimal.animalCode
            )
        );
        setAnimalActivities(filteredActivities);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchAnimalActivities();
  }, []);

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

  const events = animalActivities.map((animalActivity) => {
    const { startTime, endTime } = calculateSessionTimes(
      animalActivity.session,
      new Date(animalActivity.date)
    );

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
    };
  });

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
          <div className="mb-2 flex justify-end gap-2">
            {/* Month selection control */}
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
            events={events}
            height={"70vh"}
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

export default AnimalActivityInfo;
