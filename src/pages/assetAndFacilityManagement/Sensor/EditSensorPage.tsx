import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import EditSensorForm from "../../../components/AssetAndFacilityManagement/AssetManagement/Sensor/EditSensorForm";
import useApiJson from "../../../hooks/useApiJson";
import Sensor from "../../../models/Sensor";

function EditSensorPage() {
  const apiJson = useApiJson();

  let emptySensor: Sensor = {
    sensorId: -1,
    sensorName: "",
    sensorDetail: "",
    sensorDetailJson: "",
    xCoordinate: 0,
    yCoordinate: 0
  };

  const { sensorId } = useParams<{ sensorId: string }>();
  const [curSensor, setCurSensor] = useState<Sensor>(emptySensor);

  useEffect(() => {
    apiJson.get(`http://localhost:3000/api/assetfacility/getSensor/${sensorId}`);
  }, []);

  useEffect(() => {
    const sensor = apiJson.result as Sensor;
    setCurSensor(sensor);
  }, [apiJson.loading]);

  return (
    <div className="p-10">
      {curSensor && curSensor.sensorId != -1 && (
        <EditSensorForm curSensor={curSensor} />
      )}
    </div>
  );
}

export default EditSensorPage;
