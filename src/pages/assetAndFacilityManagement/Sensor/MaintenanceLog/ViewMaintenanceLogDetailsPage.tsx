import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useApiJson from "../../../../hooks/useApiJson";
import Facility from "../../../../models/Facility";
import MaintenanceLog from "../../../../models/MaintenanceLog";
import { HubStatus } from "../../../../enums/HubStatus";
import { SensorType } from "../../../../enums/SensorType";
import Hub from "../../../../models/Hub";
import Sensor from "../../../../models/Sensor";
import ViewMaintenanceLogDetails from "../../../../components/AssetAndFacilityManagement/AssetManagement/Sensor/MaintenanceLogs/ViewMaintenanceLogDetails";



function ViewMaintenanceLogDetailsPage() {
  const apiJson = useApiJson();
  const [refreshSeed, setRefreshSeed] = useState<number>(0);
  const { logId } = useParams<{ logId: string }>();

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
    hub: emptyHub,
    sensorReading: [],
    maintenanceLogs: [],
    generalStaff: []
  };

  let emptyMaintenanceLog: MaintenanceLog = {
    logId: 0,
    dateTime: new Date(),
    title: "",
    details: "",
    remarks: "",
    sensor: emptySensor
  };

  const [curMaintenanceLog, setCurMaintenanceLog] = useState<MaintenanceLog>(emptyMaintenanceLog);

  useEffect(() => {
    apiJson.post(`http://localhost:3000/api/assetFacility/getSensorMaintenanceLog/${logId}`, { includes: [] }).then(res => {
      setCurMaintenanceLog(res.facilityLog as MaintenanceLog);
    });
  }, [refreshSeed]);

  return (
    <div className="p-10">
      {curMaintenanceLog && curMaintenanceLog.logId != -1 && (
        <ViewMaintenanceLogDetails curMaintenanceLog={curMaintenanceLog} />
      )}
    </div>
  );
}

export default ViewMaintenanceLogDetailsPage;