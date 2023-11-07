import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useApiJson from "../../hooks/useApiJson";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";


import { Accordion, AccordionTab } from "primereact/accordion";
import { Tag } from "primereact/tag";
import { BsBroadcast, BsCalendarWeek, BsHouseExclamation } from "react-icons/bs";
import ZooEvent from "src/models/ZooEvent";
import { useAuthContext } from "../../hooks/useAuthContext";
import Animal from "../../models/Animal";
import Species from "../../models/Species";


function MaintenanceNotificationCard() {
  const apiJson = useApiJson();
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useAuthContext();
  const employee = state.user?.employeeData;
  const YEAR_IN_MILLISECONDS = 1000 * 60 * 60 * 24 * 365

  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [animalList, setAnimalList] = useState<Animal[]>([]);
  const [facilityList, setFacilityList] = useState<any[]>([]);
  const [facilityReportList, setFacilityReportList] = useState<any[]>([]);
  const [sensorList, setSensorList] = useState<any[]>([]);
  const [refreshSeed, setRefreshSeed] = useState<any>(0);
  const [eventList, setEventList] = useState<any[]>([]);

  useEffect(() => {
    apiJson.get(
      "http://localhost:3000/api/species/getallspecies"
    ).then(responseJson => {
      setSpeciesList(responseJson as Species[]);

    }).catch(err => console.log(err));
  }, []);

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/animal/getAllAbnormalWeights/`
        );
        console.log("test");
        setAnimalList(responseJson as Animal[]);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchAnimal();
  }, []);

  useEffect(() => {
    if (
      !(
        employee.superAdmin ||
        employee.planningStaff?.plannerType == "OPERATIONS_MANAGER"
      ) &&
      !employee.generalStaff
    )
      return;
    apiJson
      .get(
        "http://localhost:3000/api/assetFacility/getFacilityMaintenanceSuggestions"
      )
      .catch((error) => {
        console.log(error);
      })
      .then((responseJson) => {
        if (responseJson === undefined) return;
        let facility = responseJson["facilities"];
        facility = facility.filter((f: any) => {
          return (
            f.predictedMaintenanceDate &&
            compareDates(new Date(f.predictedMaintenanceDate), new Date()) <= 0
          );
        });
        setFacilityList(facility);
      });
  }, [refreshSeed]);

  useEffect(() => {
    if (
      !(
        employee.superAdmin ||
        employee.planningStaff?.plannerType == "OPERATIONS_MANAGER"
      ) &&
      !employee.generalStaff
    )
      return;
    apiJson
      .get(
        "http://localhost:3000/api/assetFacility/getSensorMaintenanceSuggestions"
      )
      .catch((error) => {
        console.log(error);
      })
      .then((responseJson) => {
        let sensors = responseJson["sensors"];
        sensors = sensors.filter((sensor: any) => {
          return (
            sensor.predictedMaintenanceDate &&
            compareDates(
              new Date(sensor.predictedMaintenanceDate),
              new Date()
            ) <= 0
          );
        });
        setSensorList(sensors);
      });
  }, [refreshSeed]);

  useEffect(() => {
    if (
      !(
        employee.superAdmin ||
        employee.planningStaff?.plannerType == "SALES" ||
        employee.planningStaff?.plannerType == "OPERATIONS_MANAGER"
      ) &&
      !employee.keeper
    )
      return;
    apiJson
      .post(
        "http://localhost:3000/api/zooEvent/getAllZooEvents", {
        startDate: new Date(Date.now() - YEAR_IN_MILLISECONDS),
        endDate: new Date(Date.now() + YEAR_IN_MILLISECONDS),
        includes: [
          "planningStaff",
          "keepers"
        ]
      }
      )
      .catch((error) => {
        console.log(error);
      })
      .then((responseJson) => {
        const assignedEvents: ZooEvent[] = []
        responseJson["zooEvents"].forEach((ze: ZooEvent) => {
          if (ze.keepers?.find((k: any) => k.employeeId == employee.employeeId) ||
            ze.planningStaff?.employeeId == employee.employeeId) {
            assignedEvents.push(ze);
          };
        });
        setEventList(assignedEvents);
        console.log(assignedEvents)
      });
  }, [refreshSeed]);

  useEffect(() => {
    if (
      !(
        employee.superAdmin ||
        employee.planningStaff?.plannerType == "OPERATIONS_MANAGER" || 
        employee.generalStaff 
      )
    )
      return;
    apiJson
      .get(
        "http://localhost:3000/api/assetFacility/getAllNonViewedCustomerReportLogs")
      .catch((error) => {
        console.log(error);
      })
      .then((responseJson) => {
        console.log("getAllNonViewedCustomerReportLogs", responseJson)
        setFacilityReportList(responseJson.customerReportLogs);
      });
  }, [refreshSeed]);

  function compareDates(d1: Date, d2: Date): number {
    let date1 = d1.getTime();
    let date2 = d2.getTime();
    return date1 - date2;
  };

  const statusBodyTemplate = (asset: any) => {
    return <Tag value={isNaN(Date.parse(asset.predictedMaintenanceDate)) ? new Date(asset.predictedMaintenanceDate).toLocaleString() : new Date(asset.predictedMaintenanceDate).toLocaleString()}
      severity={isNaN(Date.parse(asset.predictedMaintenanceDate)) ? "info" :
        (compareDates(new Date(asset.predictedMaintenanceDate), new Date()) <= -1000 * 60 * 60 * 24 * 3) ? "danger"
          : (compareDates(new Date(asset.predictedMaintenanceDate), new Date()) <= 0) ? "warning" : "success"} />;
  };

  return (
    <Card className=" shrink h-max w-max">
      {" "}
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Maintenance Suggestions and Zoo Events
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Accordion multiple activeIndex={[0, 1, 2]}>

          {(employee.superAdmin || employee.generalStaff || employee.planningStaff) && (

          <AccordionTab
          header={(employee.superAdmin || employee.generalStaff || employee.planningStaff) &&
            <Link
              className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
              to="/assetfacility/maintenance/facilityMaintenance"
            >
              {facilityList.length ? (
                <div className="flex flex-row gap-2 text-m">
                  <BsHouseExclamation className="text-xl font-bold" />
                  <div>
                    <b>{facilityList.length}</b> Facilities to maintain
                  </div>
                </div>
              ) : (
                <div className="flex flex-row gap-2 text-green-700 text-m">
                  <BsHouseExclamation className="text-xl font-bold" />
                  <p className="font-bold">
                    Facilities are all maintained!
                  </p>
                </div>
              )}

            </Link>

          }>
          {(employee.superAdmin || employee.generalStaff || employee.planningStaff) && facilityList &&
            facilityList.map((facility) => {
              return (
                <ul className="space-y-2" >
                  <li key={facility.facilityId}>
                    <Link
                      className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                      to="/assetfacility/maintenance/facilityMaintenance"
                    >
                      <div className="flex flex-col gap-1 text-m">
                        <div className="flex flex-row gap-2 text-m font-semibold">
                          <BsHouseExclamation />
                          <p className="text-sm">
                            <span>
                              {facility.facilityName}
                            </span>
                          </p>
                        </div>
                        <p className="text-sm text-amber-500 font-bold">
                          {new Date(
                            facility.predictedMaintenanceDate
                          ).toLocaleDateString()}
                          {/* <br />
                        {statusBodyTemplate(facility)} */}
                        </p>
                        <p className="text-xs">Suggested Maintenance Date</p>
                      </div>
                    </Link>
                  </li>
                </ul>
              );
            })
          }
          </AccordionTab>
          )}

          {(employee.superAdmin || employee.generalStaff || employee.planningStaff) && (

            <AccordionTab header={(employee.superAdmin || employee.generalStaff || employee.planningStaff) && (
              <Link
                className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                to="/assetfacility/maintenance/sensorMaintenance"
              >
                {sensorList.length ? (
                  <div className="flex flex-row gap-2 text-m">
                    <BsBroadcast className="text-xl font-bold" />
                    <p>
                      <b>{sensorList.length}</b> Sensors to maintain
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-row gap-2 text-green-700 text-m">
                    <BsBroadcast className="text-xl font-bold" />
                    <p className="font-bold">
                      Sensors are all maintained!
                    </p>
                  </div>
                )}
              </Link>
            )}>
              {
                sensorList && sensorList.map((sensor) => {
                  return (
                    <ul className="space-y-2" >
                      <li key={sensor.sensorId}>
                        <Link
                          className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                          to="/assetfacility/maintenance/sensorMaintenance"
                        >
                          <div className="flex flex-col gap-1 text-m">
                            <div className="flex flex-row gap-2 text-m font-semibold">
                              <BsBroadcast />
                              <p className="text-sm">
                                <span className="text-sm">
                                  {sensor.sensorName}
                                </span>
                              </p>
                            </div>
                            <p className="text-sm text-amber-500 font-bold">
                              {new Date(
                                sensor.predictedMaintenanceDate
                              ).toLocaleDateString()}
                              {/* <br />
                            {statusBodyTemplate(sensor)} */}
                            </p>
                            <p className="text-xs">Suggested Maintenance Date</p>
                          </div>
                        </Link>
                      </li>
                    </ul>
                  );
                })}
            </AccordionTab>
          )}

          {(employee.superAdmin || employee.generalStaff || employee.planningStaff) && (

            <AccordionTab header={(employee.superAdmin || employee.generalStaff || employee.planningStaff) && (
              <Link
                className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                to="/assetfacility/maintenance/sensorMaintenance"
              >
                {facilityReportList.length ? (
                  <div className="flex flex-row gap-2 text-m">
                    <BsBroadcast className="text-xl font-bold" />
                    <p>
                      <b>{facilityReportList.length}</b> Customer Report Logs
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-row gap-2 text-green-700 text-m">
                    <BsBroadcast className="text-xl font-bold" />
                    <p className="font-bold">
                      No Customer Reports!
                    </p>
                  </div>
                )}
              </Link>
            )}>
              {
                facilityReportList && facilityReportList.map((report) => {
                  return (
                    <ul className="space-y-2" >
                      <li key={report.customerReportLogId}>
                        <Link
                          className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                          to="/assetfacility/maintenance/sensorMaintenance"
                        >
                          <div className="flex flex-col gap-1 text-m">
                            <div className="flex flex-row gap-2 text-m font-semibold">
                              <BsBroadcast />
                              <p className="text-sm">
                                <span className="text-sm">
                                  {report.title}
                                </span>
                              </p>
                            </div>
                            <p className="text-sm font-bold">
                              {new Date(
                                report.dateTime
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </Link>
                      </li>
                    </ul>
                  );
                })}
            </AccordionTab>
          )}

          {(employee.superAdmin || employee.keeper || employee.planningStaff)
              && eventList && (

                <AccordionTab header={(employee.superAdmin || employee.keeper || employee.planningStaff) &&
                  <Link
                    className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                    to="/zooevent/viewallzooevents"
                  >
                    {eventList.length ? (
                      <div className="flex flex-row gap-2 text-m">
                        <BsCalendarWeek className="text-xl font-bold" />
                        <div>
                          Assigned to <b>{eventList.length}</b> events
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-row gap-2 text-green-700 text-m">
                        <BsCalendarWeek className="text-xl font-bold" />
                        <p className="font-bold">
                          No assigned events!
                        </p>
                      </div>
                    )}
                    <p className="text-xs">Today</p>
                  </Link>
                }>
                  {eventList.map((event) => {
                      return (
                        <ul className="space-y-2" >
                          <li key={event.zooEventId}>
                            <Link
                              className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                              to={`zooevent/viewzooeventdetails/${event.zooEventId}`}
                            >
                              <div className="flex flex-col gap-1 text-m">
                                <div className="flex flex-row gap-2 text-m font-semibold">
                                  <BsCalendarWeek />
                                  <p className="text-sm">
                                    <span>
                                      {event.eventName}
                                    </span>
                                  </p>
                                </div>
                                <p className="text-sm text-amber-500 font-bold">
                                  {new Date(
                                    event.eventStartDateTime
                                  ).toLocaleDateString()}
                                </p>
                                <p className="text-xs">Start Date</p>
                              </div>
                            </Link>
                          </li>
                        </ul>
                      );
                    })}
                </AccordionTab>
              )}
        </Accordion>
        <div>
        </div>
      </CardContent>
      {/* <CardFooter>
        <Button className="w-full"></Button>
      </CardFooter> */}
    </Card >
  );
}

export default MaintenanceNotificationCard;
