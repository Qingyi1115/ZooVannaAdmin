import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import EditSensorForm from "../../../components/AssetAndFacilityManagement/AssetManagement/Sensor/EditSensorForm";
import useApiJson from "../../../hooks/useApiJson";
import Sensor from "../../../models/Sensor";
import { SensorType } from "../../../enums/SensorType";
import Hub from "../../../models/Hub";
import Facility from "../../../models/Facility";
import { HubStatus } from "../../../enums/HubStatus";

function EditSensorPage() {
  const apiJson = useApiJson();

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

  const { sensorId } = useParams<{ sensorId: string }>();
  const [curSensor, setCurSensor] = useState<Sensor>(emptySensor);

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
      {curSensor && curSensor.sensorId != -1 && (
        <EditSensorForm curSensor={curSensor} />
      )}
    </div>
  );
}

export default EditSensorPage;
