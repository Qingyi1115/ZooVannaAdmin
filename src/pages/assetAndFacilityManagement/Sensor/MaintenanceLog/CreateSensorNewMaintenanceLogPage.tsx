import React, { useEffect, useState } from "react"; import { useParams } from "react-router-dom";
import useApiJson from "../../../../hooks/useApiJson";
import Sensor from "../../../../models/Sensor";
import CreateNewMaintenanceLogForm from "../../../../components/AssetAndFacilityManagement/AssetManagement/Sensor/MaintenanceLogs/CreateNewMaintenanceLogForm";
import { SensorType } from "../../../../enums/SensorType";
import { HubStatus } from "../../../../enums/HubStatus";
import Facility from "../../../../models/Facility";
import Hub from "../../../../models/Hub";

function CreateNewSensorMaintenanceLogPage() {
  const apiJson = useApiJson();
  const [refreshSeed, setRefreshSeed] = useState<number>(0);
  const { sensorId } = useParams<{ sensorId: string }>();

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
    sensors: [],
    radioGroup: null,
  };

  let emptySensor: Sensor = {
    sensorId: -1,
    sensorName: "",
    dateOfActivation: new Date(),
    dateOfLastMaintained: new Date(),
    sensorType: SensorType.CAMERA,
    hub: emptyHub,
    sensorReadings: [],
    maintenanceLogs: [],
    generalStaff: []
  };

  const [curSensor, setCurSensor] = useState<Sensor>(emptySensor);

  useEffect(() => {
    apiJson.post(`http://localhost:3000/api/assetfacility/getSensor/${sensorId}`, {
      includes: ["hubProcessor", "sensorReadings", "maintenanceLogs", "generalStaff"]
    }).then(res => {
      setCurSensor(res.sensor as Sensor);
    });
  }, [refreshSeed]);


  return (
    <div className="p-10">
      <CreateNewMaintenanceLogForm curSensor={curSensor} />
    </div>
  );
}

export default CreateNewSensorMaintenanceLogPage;
