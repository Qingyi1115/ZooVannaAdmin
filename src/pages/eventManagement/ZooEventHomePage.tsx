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
import { useAuthContext } from "../../hooks/useAuthContext";
import beautifyText from "../../hooks/beautifyText";


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
  const [selEventGroupList, setSelEventGroupList] = useState<any[]>([]);

  const [titleGroupList, setTitleGroupList] = useState<any>([]);
  const [selTitleGroupList, setSelTitleGroupList] = useState<any[]>([]);

  const [refresh, setRefresh] = useState<any>(0);
  const [zooEventsList, setZooEventsList] = useState<
    ZooEvent[]
  >([]);
  const [filteredZooEventsList, setFilteredZooEventsList] = useState<
    ZooEvent[]
  >([]);
  const navigate = useNavigate();

  const employee = useAuthContext().state.user?.employeeData;

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
      const allTitleGroups: any[] = [];

      const a = responseJson["zooEvents"].map((ze: ZooEvent) => {
        return { ...ze, eventType: beautifyText(ze.eventType) }
      });

      a.forEach((ze: ZooEvent) => {

        if (ze.animalActivity) {
          if (ze.animalActivity?.title !== undefined && !allTitleGroups.find(title => title == ze.animalActivity?.title)) {
            allTitleGroups.push(ze.animalActivity?.title);
          }
        } else if (ze.feedingPlanSessionDetail) {
          if (ze.feedingPlanSessionDetail?.feedingPlan?.title !== undefined && !allTitleGroups.find(title => title == ze.feedingPlanSessionDetail?.feedingPlan?.title)) {
            allTitleGroups.push(ze.feedingPlanSessionDetail?.feedingPlan?.title);
          }
        } else if (ze) {

        }


        if (!allEventGroup.find(et => et == ze.eventType)) {
          allEventGroup.push(ze.eventType);
        }

      });
      setEventGroupList(allEventGroup);
      setTitleGroupList(allTitleGroups);

      const newGp = allEventGroup.filter(gp => selEventGroupList.includes(gp));
      if (selEventGroupList.length == 0 || newGp.length == 0) {
        setSelEventGroupList(allEventGroup);
      } else {
        setSelEventGroupList(newGp);
      }

      const newTi = allTitleGroups.filter(ti => selTitleGroupList.includes(ti));
      console.log("newTi", newTi)
      if (selTitleGroupList.length == 0 || newTi.length == 0) {
        setSelTitleGroupList(allTitleGroups);
      } else {
        setSelTitleGroupList(newTi);
      }

      setFilteredZooEventsList(a);
      return setZooEventsList(a);

    }).catch(error => {
      console.log(error);
    });
  }, [refresh]);

  useEffect(() => {
    setFilteredZooEventsList(
      zooEventsList.filter(ze => {
        // if (ze.animalActivity) {
        //   return selEventGroupList.find(group => group.groupId == ze.animalActivity?.animalActivityId && group.groupType == "animalActivity");
        // } else if (ze.feedingPlanSessionDetail) {
        //   return selEventGroupList.find(group => group.groupId == ze.feedingPlanSessionDetail?.feedingPlanSessionDetailId && group.groupType == "feedingPlanSessionDetail");
        // } else if (ze) {
        // }

        return selEventGroupList.find(et => ze.eventType == et);
      }).filter(ze => {
        if (ze.animalActivity) {
          return selTitleGroupList.find(ti => ti == ze.animalActivity?.title);
        } else if (ze.feedingPlanSessionDetail) {
          return selTitleGroupList.find(ti => ti == ze.feedingPlanSessionDetail?.feedingPlan?.title);
        } else if (ze) {

        }
      })
    )
  }, [selEventGroupList, selTitleGroupList]);

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
          label: 'Feeding Plan',
          command: () => {
            navigate(`/zooevent/viewallzooevents/`, { replace: true })
            navigate(`/animal/viewallanimals/`)
          }
        }
      ]
    },
    // {
    //   label: 'Public',
    //   items: [{
    //     label: 'None',
    //     icon: '',
    //     command: () => { }
    //   }]
    // },
  ];

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
        {/* Title Header and back button */}
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">

            <Menu model={items} popup ref={menuLeft} id="popup_menu_right" popupAlignment="left" />
            {(employee.superAdmin || employee.planningStaff?.plannerType == "CURATOR") ?
              <Button className="mr-2" onClick={(event) => menuLeft.current?.toggle(event)} aria-controls="popup_menu_right" aria-haspopup >
                <HiPlus className="mr-2" />
                Add Event
              </Button>
              : <Button className="mr-2 invisible" disabled aria-controls="popup_menu_right" aria-haspopup >
                <HiPlus className="mr-2" />
                Add Event
              </Button>
            }

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
          <div className="flex gap-8 p-4 items-center">
            <div className="whitespace-no-wrap min-w-max text-lg">
              Event Type
            </div>
            <MultiSelect
              id={"eventGroupFilter"}
              value={selEventGroupList}
              onChange={(e: MultiSelectChangeEvent) => setSelEventGroupList(e.value)}
              options={eventGroupList}
              optionLabel=""
              filter
              display="chip"
              placeholder="Filter Type"
              className="w-full md:w-20rem overflow-hidden" />
          </div>

          <div className="flex gap-8 p-4 items-center">
            <div className="whitespace-no-wrap min-w-max text-lg">
              Title
            </div>
            <MultiSelect
              id={"eventTitleFilter"}
              value={selTitleGroupList}
              onChange={(e: MultiSelectChangeEvent) => setSelTitleGroupList(e.value)}
              options={titleGroupList}
              optionLabel=""
              filter
              display="chip"
              placeholder="Filter Title"
              className="w-full md:w-20rem overflow-hidden" />
          </div>
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
