import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import EditSensorForm from "../../../components/AssetAndFacilityManagement/AssetManagement/Sensor/EditSensorForm";
import useApiJson from "../../../hooks/useApiJson";
import Sensor from "../../../models/Sensor";
import { SensorType } from "../../../enums/SensorType";
import Hub from "../../../models/Hub";
import Facility from "../../../models/Facility";
import { HubStatus } from "../../../enums/HubStatus";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HiPencil } from "react-icons/hi";
import ViewCamera from "../../../components/AssetAndFacilityManagement/AssetManagement/Sensor/ViewCamera";

function ViewCameraPage() {
  const apiJson = useApiJson();
const navigate = useNavigate();
  const { sensorId } = useParams<{ sensorId: string }>();
  const [authorization, setAuthorization] = useState<any>(undefined);

  useEffect(() => {
    apiJson.post(
      `http://localhost:3000/api/assetFacility/getAuthorizationForCamera`,
      { sensorId:sensorId }).then(res => {
        const newAuth = {
            userId: res.userId,
            hubId: res.hubId,
            date: res.date,
            ipAddressName: res.ipAddressName,
            signature: res.signature,
        }
        setAuthorization(newAuth);
      }).catch(e => console.log(e));
  }, []);

  return (
    <div className="p-10">
        
        <Button variant={"outline"} type="button" onClick={() => navigate(-1)} className="">
            Back
          </Button>
    
      {authorization && (
        <ViewCamera authorization={authorization} />
      )}
    </div>
  );
}

export default ViewCameraPage;
