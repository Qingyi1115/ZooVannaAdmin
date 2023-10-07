import React from "react";
import AllAnimalActivitiesDatatable from "../../components/AnimalManagement/AnimalActivityHomePage/AllAnimalActivitiesDatatable";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HiPlus } from "react-icons/hi";
import { Separator } from "@/components/ui/separator";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!

function AnimalActivityHomePage() {
  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
        {/* <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" /> */}
        {/* Title Header and back button */}
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">
            <NavLink to={"/animal/createanimalactivity"}>
              <Button className="mr-2 flex items-center">
                <HiPlus className="mr-2" />
                Add Animal Activity
              </Button>
            </NavLink>
            <span className=" self-center text-title-xl font-bold">
              All Animal Activities
            </span>
            <Button className="invisible">I love animals</Button>
          </div>
          <Separator />
        </div>
        <AllAnimalActivitiesDatatable />
      </div>
    </div>
  );
}

export default AnimalActivityHomePage;
