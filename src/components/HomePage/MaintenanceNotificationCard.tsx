import React, { useState, useEffect } from "react";
import useApiJson from "../../hooks/useApiJson";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { DataTable } from "primereact/datatable";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { InputText } from "primereact/inputtext";

import Animal from "../../models/Animal";
import { HiEye } from "react-icons/hi";
import { MultiSelect } from "primereact/multiselect";
import Species from "../../models/Species";
import { BsBroadcast, BsCalendarWeek, BsHouseExclamation } from "react-icons/bs";
import { useAuthContext } from "../../hooks/useAuthContext";
import { compareDates } from "../AssetAndFacilityManagement/MaintenanceOperation/SensorMaintenanceSuggestion";
import ZooEvent from "src/models/ZooEvent";


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
  const [sensorList, setSensorList] = useState<any[]>([]);
  const [refreshSeed, setRefreshSeed] = useState<any>(0);
  const [eventList, setEventList] = useState<any[]>([]);

  useEffect(() => {
     apiJson.get(
        "http://localhost:3000/api/species/getallspecies"
    ).then(responseJson=>{
        setSpeciesList(responseJson as Species[]);

    }).catch(err=>console.log(err));
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

  return (
    <Card className="h-max w-max">
      {" "}
      <CardHeader>
        <CardTitle>Assets and Facility Notification</CardTitle>
        <CardDescription className="w-[25vw]">
          Maintenance suggestions and Zoo Events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between"> <ul className="flex h-auto flex-col overflow-y-auto">
            <li>
              <Link
                className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                to="/assetfacility/maintenance/facilityMaintenance"
              >
                {facilityList.length ? (
                  <div className="text-amber-500">
                    <p className="text-sm">
                      <BsHouseExclamation />
                      Facilities to maintain {facilityList.length}
                    </p>
                  </div>
                ) : (
                  <div className="text-green-700">
                    <p className="text-sm">
                      <BsHouseExclamation />
                      Facilities are all maintained!
                    </p>
                  </div>
                )}

                <p className="text-xs">Today</p>
              </Link>
            </li>

            {facilityList &&
              facilityList.map((facility) => {
                return (
                  <li key={facility.facilityId}>
                    <Link
                      className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                      to="/assetfacility/maintenance/facilityMaintenance"
                    >
                      <div className="text-red-700">
                        <BsHouseExclamation />
                        <p className="text-sm">
                          <span className="text-red-700">
                            {facility.facilityName}
                          </span>{" "}
                        </p>
                        <p className="text-xs">
                          Suggested Date:{" "}
                          {new Date(
                            facility.predictedMaintenanceDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })
            }
            <li>
              <Link
                className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                to="/assetfacility/maintenance/sensorMaintenance"
              >
                {sensorList.length ? (
                  <div className="text-amber-500">
                    <p className="text-sm">
                      <BsBroadcast />
                      Sensors to maintain {sensorList.length}
                    </p>
                  </div>
                ) : (
                  <div className="text-green-700">
                    <p className="text-sm">
                      <BsBroadcast />
                      Sensors are all maintained!
                    </p>
                  </div>
                )}

                <p className="text-xs">Today</p>
              </Link>
            </li>

            {sensorList && sensorList.map((sensor) => {
              return (
                <li key={sensor.sensorId}>
                  <Link
                    className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                    to="/assetfacility/maintenance/sensorMaintenance"
                  >
                    <div className="text-red-700">
                      <BsBroadcast />
                      <p className="text-sm">
                        <span className="text-red-700">
                          {sensor.sensorName}
                        </span>{" "}
                      </p>
                      <p className="text-xs">
                        Suggested Date:{" "}
                        {new Date(
                          sensor.predictedMaintenanceDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}

            <li>
              <Link
                className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                to="/zooevent/viewallzooevents"
              >
                {eventList.length ? (
                  <div className="text-amber-500">
                    <p className="text-sm">
                      <BsCalendarWeek />
                      Assigned to {eventList.length} events
                    </p>
                  </div>
                ) : (
                  <div className="text-green-700">
                    <p className="text-sm">
                      <BsCalendarWeek />
                      No assigned events!
                    </p>
                  </div>
                )}

                <p className="text-xs">Today</p>
              </Link>
            </li>
            {eventList && eventList.map((event) => {
              return (
                <li key={event.zooEventId}>
                  <Link
                    className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                    to={`zooevent/viewzooeventdetails/${event.zooEventId}`}
                  >
                    <div className="text-red-700">
                      <BsCalendarWeek />
                      <p className="text-sm">
                        <span className="text-red-700">
                          {event.eventName}
                        </span>{" "}
                      </p>
                      <p className="text-xs">
                        Start Date:{" "}
                        {new Date(
                          event.eventStartDateTime
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </CardContent>
      {/* <CardFooter>
        <Button className="w-full"></Button>
      </CardFooter> */}
    </Card>
  );
}

export default MaintenanceNotificationCard;
