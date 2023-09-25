import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import EditSensorForm from "../../../components/AssetAndFacilityManagement/AssetManagement/Sensor/EditSensorForm";
import useApiJson from "../../../hooks/useApiJson";
import Sensor from "../../../models/Sensor";
import { SensorType } from "../../../enums/SensorType";

function EditSensorPage() {
  const apiJson = useApiJson();

  let emptySensor: Sensor = {
    sensorId: -1,
    sensorName: "",
    dateOfActivation: new Date(),
    dateOfLastMaintained: new Date(),
    sensorType: SensorType.CAMERA
  };

  const { sensorId } = useParams<{ sensorId: string }>();
  const [curSensor, setCurSensor] = useState<Sensor>(emptySensor);

  useEffect(() => {
    apiJson.get(`http://localhost:3000/api/assetfacility/getSensor/${sensorId}`);
  }, []);

  return (
    <div className="p-10">
      {curSensor && curSensor.sensorId != -1 && (
        <EditSensorForm curSensor={curSensor} refreshSeed={0} setRefreshSeed={function (value: React.SetStateAction<number>): void {
          throw new Error("Function not implemented.");
        }} />
      )}
    </div>
  );
}

export default EditSensorPage;
