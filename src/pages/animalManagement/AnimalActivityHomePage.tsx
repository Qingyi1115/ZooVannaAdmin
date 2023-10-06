import React from "react";
import AllAnimalActivitiesDatatable from "../../components/AnimalManagement/AnimalActivityHomePage/AllAnimalActivitiesDatatable";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!

function AnimalActivityHomePage() {
  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
        {/* <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" /> */}
        <AllAnimalActivitiesDatatable />
      </div>
    </div>
  );
}

export default AnimalActivityHomePage;
