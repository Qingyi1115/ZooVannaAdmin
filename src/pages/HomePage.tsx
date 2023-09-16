import React from "react";
import Sidebar from "../components/Deprecated/Sidebar";

import { Calendar } from "@/components/ui/calendar";

function HomePage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="h-screen p-4">
      <div className="m-4 h-4 rounded-xl border border-[#12FF45] p-3 text-center font-bold">
        sadasdaa das da sd asd asd a da das da
      </div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border text-red-500"
      />
    </div>
  );
}

export default HomePage;
