import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useParams } from "react-router-dom";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import { Toggle } from "@/components/ui/toggle";
import useApiJson from "../../hooks/useApiJson";


import { HiCalendarDays, HiPencil, HiTableCells } from "react-icons/hi2";
import AllEventsFullCalendar from "../../components/EventManagement/ZooEventHomePage/AllZooEventsFullCalendar";

import ViewPublicEventSessionDetails from "../../components/EventManagement/PublicEventSessionDetails";
import beautifyText from "../../hooks/beautifyText";
import { useAuthContext } from "../../hooks/useAuthContext";
import PublicEventSession from "../../models/PublicEventSession";
import ZooEvent from "../../models/ZooEvent";

function PublicEventSessionHomePage() {
  const apiJson = useApiJson();
  const [isDatatableView, setIsDatatableView] = useState<boolean>(true);
  const employee = useAuthContext().state.user?.employeeData;
  const navigate = useNavigate();
  const { publicEventSessionId } = useParams<{ publicEventSessionId: string }>();
  const [publicEventSession, setPublicEventSession] = useState<PublicEventSession>({});
  const [zooEventList, setZooEventList] = useState<
    ZooEvent[]
  >([]);

  useEffect(() => {
    const fetchPublicEventSessions = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/zooEvent/getPublicEventSessionById/${publicEventSessionId}`
        );
        console.log("PublicEventSessionHomePage", responseJson)
        setPublicEventSession(responseJson.publicEventSession)
        setZooEventList(responseJson.publicEventSession.zooEvents.map(ze => { return { ...ze, eventType: beautifyText(ze.eventType) } }));
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchPublicEventSessions();
  }, []);

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
        {/* Title Header and back button */}
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">
            <Button
              onClick={() => navigate(-1)}
              variant={"outline"}
              type="button"
              className=""
            >
              Back
            </Button>
            <span className=" self-center text-title-xl font-bold">
              All Scheduled Events
            </span>
            <Button className="invisible">Back</Button>
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
              <span>Details</span>
            ) : (
              <span>Calendar View</span>
            )}
          </div>
        </div>
        {isDatatableView ? (
          <ViewPublicEventSessionDetails
            publicEventSession={publicEventSession}
          />
        ) : (
          <AllEventsFullCalendar
            zooEventsList={zooEventList}
            setRefresh={setZooEventList}
          />
        )}
      </div>
    </div >
  );
}

export default PublicEventSessionHomePage;
