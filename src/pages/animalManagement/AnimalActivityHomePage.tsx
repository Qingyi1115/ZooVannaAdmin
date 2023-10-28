import React, { useEffect, useState, useRef } from "react";

import AllAnimalActivitiesDatatable from "../../components/AnimalManagement/AnimalActivityHomePage/AllAnimalActivitiesDatatable";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HiPlus } from "react-icons/hi";
import { Separator } from "@/components/ui/separator";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import { Toggle } from "@/components/ui/toggle";
import useApiJson from "../../hooks/useApiJson";

import AnimalActivity from "../../models/AnimalActivity";

import { HiCalendarDays, HiTableCells } from "react-icons/hi2";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import AllAnimalActivitiesFullCalendar from "../../components/AnimalManagement/AnimalActivityHomePage/AllAnimalActivitiesFullCalendar";
import { useAuthContext } from "../../hooks/useAuthContext";

function AnimalActivityHomePage() {
  const apiJson = useApiJson();
  const [isDatatableView, setIsDatatableView] = useState<boolean>(true);
  const employee = useAuthContext().state.user?.employeeData;
  const navigate = useNavigate();

  const [animalActivitiesList, setAnimalActivitiesList] = useState<
    AnimalActivity[]
  >([]);

  useEffect(() => {
    const fetchAnimalActivities = async () => {
      try {
        const responseJson = await apiJson.get(
          "http://localhost:3000/api/animal/getAllAnimalActivities"
        );
        setAnimalActivitiesList(responseJson as AnimalActivity[]);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchAnimalActivities();
  }, []);

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
        {/* Title Header and back button */}
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">
            {(employee.superAdmin || employee.planningStaff?.plannerType == "CURATOR") ?
              <Button
                onClick={() => {
                  navigate(`/animal/animalactivities`, { replace: true })
                  navigate(`/animal/createanimalactivity`)
                }}
                className="mr-2 flex items-center">
                <HiPlus className="mr-2" />
                Add Animal Activity
              </Button>
              : <Button className="invisible">I love animals</Button>
            }
            <span className=" self-center text-title-xl font-bold">
              All Animal Activities
            </span>
            <Button className="invisible">I love animals</Button>
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
          animalActivitiesList.length != 0 && (
            <AllAnimalActivitiesDatatable
              animalActivitiesList={animalActivitiesList}
              setAnimalActivitiesList={setAnimalActivitiesList}
            />
          )
        ) : (
          <AllAnimalActivitiesFullCalendar
            animalActivitiesList={animalActivitiesList}
            setAnimalActivitiesList={setAnimalActivitiesList}
          />
        )}
      </div>
    </div >
  );
}

export default AnimalActivityHomePage;
