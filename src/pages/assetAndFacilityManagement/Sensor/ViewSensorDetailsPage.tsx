import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useApiJson from "../../../hooks/useApiJson";
import Facility from "../../../models/Facility";

import { Button } from "@/components/ui/button";

import ViewSensorDetails from "../../../components/AssetAndFacilityManagement/AssetManagement/Sensor/ViewSensorDetails";
import Hub from "../../../models/Hub";
import { HubStatus } from "../../../enums/HubStatus";
import { SensorType } from "../../../enums/SensorType";
import Sensor from "../../../models/Sensor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";




function ViewSensorDetailsPage() {
  const apiJson = useApiJson();
  const navigate = useNavigate();

  let emptyFacility: Facility = {
    facilityId: -1,
    facilityName: "",
    xCoordinate: 0,
    yCoordinate: 0,
    facilityDetail: "",
    facilityDetailJson: undefined,
    isSheltered: false,
    hubProcessors: []
  };

  let emptyHub: Hub = {
    hubProcessorId: -1,
    processorName: "",
    ipAddressName: "",
    lastDataUpdate: null,
    hubSecret: "",
    hubStatus: HubStatus.PENDING,
    facility: emptyFacility,
    sensors: []
  };

  let emptySensor: Sensor = {
    sensorId: -1,
    sensorName: "",
    dateOfActivation: new Date(),
    dateOfLastMaintained: new Date(),
    sensorType: SensorType.CAMERA,
    hub: emptyHub
  };


  const { sensorId } = useParams<{ sensorId: string }>();
  const [curSensor, setCurSensor] = useState<Sensor>(emptySensor);
  const { tab } = useParams<{ tab: string }>();

  useEffect(() => {
    apiJson.post(
      `http://localhost:3000/api/assetFacility/getSensor/${sensorId}`,
      { includes: [] }).then(res => {
        setCurSensor(res.sensor as Sensor);
        console.log(curSensor);
      }).catch(e => console.log(e));
  }, []);

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
        <div className="flex justify-between">
          <Button variant={"outline"} type="button" onClick={() => navigate(-1)} className="">
            Back
          </Button>
          <span className="self-center text-lg text-graydark">
            View Sensor Details
          </span>
          <Button disabled className="invisible">
            Back
          </Button>
        </div>
        <hr className="bg-stroke opacity-20" />
        <span className=" self-center text-title-xl font-bold">
          {curSensor.sensorName}
        </span>

        <Tabs
          defaultValue={tab ? `${tab}` : "sensorDetails"}
          className="w-full"
        ><TabsList className="no-scrollbar w-full justify-around overflow-x-auto px-4 text-xs xl:text-base">
            <TabsTrigger value="sensorDetails">Hub Details</TabsTrigger>
            <TabsTrigger value="sensorReadings">Sensor Readings</TabsTrigger>
            <TabsTrigger value="maintenanceLogs">Maintenance Logs</TabsTrigger>
            <TabsTrigger value="generalStaff">General Staff</TabsTrigger>
          </TabsList>
          <TabsContent value="sensorDetails">
            <ViewSensorDetails curSensor={curSensor}></ViewSensorDetails>
          </TabsContent>
          <TabsContent value="sensorReadings">
          </TabsContent>
          <TabsContent value="maintenanceLogs">
          </TabsContent>
          <TabsContent value="generalStaff">
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}

export default ViewSensorDetailsPage;