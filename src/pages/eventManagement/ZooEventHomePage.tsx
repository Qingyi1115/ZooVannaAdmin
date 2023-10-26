import { useEffect, useRef, useState } from "react";

import { NavLink, useNavigate } from "react-router-dom";
import { Button } from 'primereact/button';
import { HiPlus } from "react-icons/hi";
import { Separator } from "@/components/ui/separator";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import { Toggle } from "@/components/ui/toggle";
import useApiJson from "../../hooks/useApiJson";
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';

import ZooEvent from "../../models/ZooEvent";

import { HiCalendarDays, HiTableCells } from "react-icons/hi2";

import AllEventsDatatable from "../../components/EventManagement/ZooEventHomePage/AllZooEventsDatatable";
import AllEventsFullCalendar from "../../components/EventManagement/ZooEventHomePage/AllZooEventsFullCalendar";
import { SplitButton } from "primereact/splitbutton";
import { Toast } from 'primereact/toast';
import { compareDates } from '../../components/AssetAndFacilityManagement/MaintenanceOperation/SensorMaintenanceSuggestion';
import FormFieldSelect from "../../components/FormFieldSelect";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { Menu } from "primereact/menu";

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

  const [eventGroupList, setEventGroupList] = useState<any>([]);
  const [selEventGroupList, setSelEventGroupList] = useState<eventGroup[]>([]);

  const [refresh, setRefresh] = useState<any>(0);
  const [zooEventsList, setZooEventsList] = useState<
    ZooEvent[]
  >([]);
  const [filteredZooEventsList, setFilteredZooEventsList] = useState<
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

      console.log("responseJson", responseJson)

      const allEventGroup: any[] = [];

      responseJson["zooEvents"].forEach((ze: ZooEvent) => {
        if (ze.animalActivity) {
          if (!allEventGroup.find(group => group.groupId == ze.animalActivity?.animalActivityId && group.groupType == "animalActivity")) {
            allEventGroup.push({
              groupId: ze.animalActivity.animalActivityId,
              groupType: "animalActivity",
              groupName: ze.animalActivity.title + " " + ze.animalActivity.eventTimingType
            });
          }
        } else if (ze.feedingPlanSessionDetail) {
          if (!allEventGroup.find(group => group.groupId == ze.feedingPlanSessionDetail?.feedingPlanSessionDetailId && group.groupType == "feedingPlanSessionDetail")) {
            allEventGroup.push({
              groupId: ze.feedingPlanSessionDetail.feedingPlanSessionDetailId,
              groupType: "feedingPlanSessionDetail",
              groupName: ze.feedingPlanSessionDetail.feedingPlan.title + " " + ze.feedingPlanSessionDetail.dayOfWeek +
                " " + ze.feedingPlanSessionDetail.eventTimingType
            })
          }
        } else if (ze) {

        }
      });
      setEventGroupList(allEventGroup);
      setSelEventGroupList(allEventGroup);
      setFilteredZooEventsList(responseJson["zooEvents"]);
      return setZooEventsList(responseJson["zooEvents"]);

    }).catch(error => {
      console.log(error);
    });
  }, [refresh]);

  useEffect(() => {
    setFilteredZooEventsList(
      zooEventsList.filter(ze => {
        if (ze.animalActivity) {
          return selEventGroupList.find(group => group.groupId == ze.animalActivity?.animalActivityId && group.groupType == "animalActivity");
        } else if (ze.feedingPlanSessionDetail) {
          return selEventGroupList.find(group => group.groupId == ze.feedingPlanSessionDetail?.feedingPlanSessionDetailId && group.groupType == "feedingPlanSessionDetail");
        } else if (ze) {

        }
      })
    )
  }, [selEventGroupList]);

  const menuLeft = useRef<Menu>(null);
  let items = [
    {
      label: 'Internal',
      items: [
        {
          label: 'Animal Activity',
          command: () => {
            navigate(`/zooevent/viewallzooevents/`, { replace: true })
            navigate(`/animal/createanimalactivity`);
          }
        },
        {
          label: 'Animal Observation',
          command: () => {
            navigate(`/zooevent/viewallzooevents/`, { replace: true })
            navigate(`/animal/createanimalobservation`)
          }
        },
        {
          label: 'Feeding Plan',
          command: () => {
            navigate(`/zooevent/viewallzooevents/`, { replace: true })
            navigate(`/animal/createfeedingplan`)
          }
        }
      ]
    }, {
      label: 'Public',
      items: [{
        label: 'None',
        icon: '',
        command: () => { }
      }]
    },
  ];

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
        {/* Title Header and back button */}
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">

            <Menu model={items} popup ref={menuLeft} id="popup_menu_right" popupAlignment="left" />
            <Button className="mr-2" onClick={(event) => menuLeft.current?.toggle(event)} aria-controls="popup_menu_right" aria-haspopup >
              <HiPlus className="mr-2" />
              Add Event
            </Button>

            <span className=" self-center text-title-xl font-bold">
              All Events
            </span>
            <Button className="mr-2 invisible" disabled aria-controls="popup_menu_right" aria-haspopup >
              <HiPlus className="mr-2" />
              Add Event
            </Button>
          </div>
          <Separator />
        </div>
        <div>
          <label htmlFor="startDateCalendar" className="self-center mx-3 text-lg text-graydark">Start Date</label>
          <Calendar id="startDateCalendar" showTime hourFormat="12" value={calendarStartDate}
            onChange={(e: CalendarChangeEvent) => {
              if (e && e.value !== null) {
                let selStartDate: Date = e.value as Date;
                setCalendarStartDate(selStartDate);
                // setCalendarStartDate calendarStartDate
                setRefresh([])
              }
            }} />
          <label htmlFor="endDateCalendar" className="self-center mx-3 text-lg text-graydark">End Date</label>
          <Calendar id="endDateCalendar" showTime hourFormat="12" value={calendarEndDate}
            onChange={(e: CalendarChangeEvent) => {
              if (e && e.value !== null) {
                let endD: Date = e.value as Date;
                setCalendarEndDate(endD);
                // setCalendarStartDate calendarStartDate
                setRefresh([])
              }
            }} />
          <div className=" p-4">
            <MultiSelect
              value={selEventGroupList}
              onChange={(e: MultiSelectChangeEvent) => setSelEventGroupList(e.value)}
              options={eventGroupList}
              optionLabel="groupName"
              filter
              display="chip"
              placeholder="Filter Events"
              className="w-full md:w-20rem" />
          </div>
        </div>
        <div className="flex w-full flex-row content-center gap-6 rounded-md bg-whiten/50 p-2 mb-4 justify-between">
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
          <div className="text-2xl font-medium text-center">
            {isDatatableView ? (
              <span>Datatable View</span>
            ) : (
              <span>Calendar View</span>
            )}
          </div>
          <Toggle
            id="toggleDatatable"
            disabled
            aria-label="Toggle View Datatable"
            pressed={isDatatableView}
            onPressedChange={setIsDatatableView}
            className={`invisible h-min w-min rounded-l-lg rounded-r-none px-3 py-2 transition-all data-[state=off]:bg-gray data-[state=on]:bg-primary data-[state=off]:text-whiten`}
          >
            <HiTableCells
              className={`${!isDatatableView && "fill-graydark/50"} h-6 w-6`}
            />
          </Toggle>

        </div>
        {isDatatableView ? (
          <AllEventsDatatable
            zooEventsList={filteredZooEventsList}
            setRefresh={setRefresh}
          />
        ) : (
          <AllEventsFullCalendar
            zooEventsList={filteredZooEventsList}
            setRefresh={setRefresh}
          />
        )}
      </div>
    </div>
  );
}

export default ZooEventHomePage;
