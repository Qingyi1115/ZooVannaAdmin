import { useEffect, useRef, useState } from "react";

import { Separator } from "@/components/ui/separator";

import { HiPlus } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import { Toggle } from "@/components/ui/toggle";
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import useApiJson from "../../hooks/useApiJson";

import ZooEvent from "../../models/ZooEvent";

import { HiCalendarDays, HiTableCells } from "react-icons/hi2";

import { Menu } from "primereact/menu";

import AllEmployeeLeaveDatatable from "../../components/EmployeeAccountManagement/AllEmployeeLeaveDatatable";
import AllEmployeeLeaveFullCalendar from "../../components/EmployeeAccountManagement/AllEmployeeLeaveFullCalendar";
import beautifyText from "../../hooks/beautifyText";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Button } from "../../shadcn/components/ui/button";
import { useToast } from "../../shadcn/components/ui/use-toast";

const YEAR_IN_MILLISECONDS = 1000 * 60 * 60 * 24 * 365
interface eventGroup {
  groupId: number;
  groupType: string;
}

function EmployeeLeaveHomePage() {
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;

  const [isDatatableView, setIsDatatableView] = useState<boolean>(true);

  const [calendarStartDate, setCalendarStartDate] = useState<Date>(new Date(Date.now() - YEAR_IN_MILLISECONDS));
  const [calendarEndDate, setCalendarEndDate] = useState<Date>(new Date(Date.now() + YEAR_IN_MILLISECONDS));

  const [eventGroupList, setEventGroupList] = useState<any>([]);
  const [selEventGroupList, setSelEventGroupList] = useState<any[]>([]);

  const [titleGroupList, setTitleGroupList] = useState<any>([]);
  const [selTitleGroupList, setSelTitleGroupList] = useState<any[]>([]);

  const [newPage, setNewPage] = useState<boolean>(true);

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

      console.log("getAllZooEvents", responseJson)

      const allEventGroup: any[] = [];
      const allTitleGroups: any[] = [];

      const a = responseJson["zooEvents"]
        .filter((zooEvent: ZooEvent) => {
          return zooEvent.eventType == "EMPLOYEE_ABSENCE"
        })
        .map((ze: ZooEvent) => {
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
        } else {
          if (ze.eventName !== undefined && !allTitleGroups.find(title => title == ze.eventName)) {
            allTitleGroups.push(ze.eventName);
          }
        }

        if (!allEventGroup.find(et => et == ze.eventType)) {
          allEventGroup.push(ze.eventType);
        }

      });
      setEventGroupList(allEventGroup);
      setTitleGroupList(allTitleGroups);

      const historySelEventGroup = localStorage.getItem("selEventGroupList");
      let newGp = allEventGroup.filter(gp => selEventGroupList.includes(gp));

      if (selEventGroupList.length == 0 && historySelEventGroup) {
        newGp = allEventGroup.filter(gp => JSON.parse(historySelEventGroup).includes(gp));
      }

      if (newGp.length == 0) {
        setSelEventGroupList(allEventGroup);
      } else {
        setSelEventGroupList(newGp);
      }


      const historySelTitleGroupList = localStorage.getItem("selTitleGroupList");
      let newTi = allTitleGroups.filter(ti => selTitleGroupList.includes(ti));

      if (selEventGroupList.length == 0 && historySelTitleGroupList) {
        newTi = allTitleGroups.filter(ti => JSON.parse(historySelTitleGroupList).includes(ti));
      }

      if (newTi.length == 0) {
        setSelTitleGroupList(allTitleGroups);
      } else {
        setSelTitleGroupList(newTi);
      }
      setNewPage(false);
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
        } else {
          return selTitleGroupList.find(ti => ti == ze.eventName);
        }
      })
    )
    if (!newPage) {
      localStorage.setItem('selEventGroupList', JSON.stringify(selEventGroupList));
      localStorage.setItem('selTitleGroupList', JSON.stringify(selTitleGroupList));
    }
  }, [selEventGroupList, selTitleGroupList]);

  useEffect(() => {
    const ty_all: string[] = [];

    zooEventsList.filter(ze => selEventGroupList.find(et => ze.eventType == et)).forEach(ze => {

      if (ze.animalActivity) {
        if (ze.animalActivity?.title !== undefined && !ty_all.find(title => title == ze.animalActivity?.title)) {
          ty_all.push(ze.animalActivity?.title);
        }
      } else if (ze.feedingPlanSessionDetail) {
        if (ze.feedingPlanSessionDetail?.feedingPlan?.title !== undefined && !ty_all.find(title => title == ze.feedingPlanSessionDetail?.feedingPlan?.title)) {
          ty_all.push(ze.feedingPlanSessionDetail?.feedingPlan?.title);
        }
      } else {
        if (ze.eventName !== undefined && !ty_all.find(title => title == ze.eventName)) {
          ty_all.push(ze.eventName);
        }
      }
    });

    setTitleGroupList(
      ty_all
    );

    setSelTitleGroupList(
      selTitleGroupList.filter(ti => {
        return zooEventsList.filter(ze => selEventGroupList.find(et => ze.eventType == et)).find(ze => {

          if (ze.animalActivity) {
            return ze.animalActivity?.title !== undefined && ze.animalActivity.title == ti;
          } else if (ze.feedingPlanSessionDetail) {
            return ze.feedingPlanSessionDetail?.feedingPlan?.title !== undefined && ze.feedingPlanSessionDetail?.feedingPlan?.title == ti;
          } else {
            return ze.eventName !== undefined && ze.eventName == ti;
          }
        });
      })
    );
  }, [selEventGroupList])

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
    {
      label: 'Public',
      items: [{
        label: 'Public Event',
        icon: '',
        command: () => {
          navigate(`/zooevent/viewallzooevents/`, { replace: true })
          navigate(`/zooevent/createpubliczooevent/`)
        }
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
            {(employee.superAdmin ||
              employee.planningStaff?.plannerType == "CURATOR") ? (
              <Button
                onClick={() => {
                  navigate(
                    `/employeeAccount/allemployeeabsence`,
                    { replace: true }
                  );
                  navigate("/employeeAccount/viewEmployees/");
                }}
                type="button"
              >
                <HiPlus className="mr-auto" />
                Add Leave
              </Button>) : (
              <Button disabled className="invisible">
                Add Leave
              </Button>)}

            <span className=" self-center text-title-xl font-bold">
              All Employee Leave
            </span>
            <Button
              className="invisible mr-2"
              aria-controls="popup_menu_right"
              aria-haspopup
              disabled>
              <HiPlus className="mr-2" />
              Add Leave
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

        </div>

        {isDatatableView ? (
          <AllEmployeeLeaveDatatable
            zooEventsList={filteredZooEventsList}
            setRefresh={setRefresh}
          />
        ) : (
          <AllEmployeeLeaveFullCalendar
            zooEventsList={filteredZooEventsList}
            setRefresh={setRefresh}
          />
        )}
      </div>
    </div>
  );
}

export default EmployeeLeaveHomePage;