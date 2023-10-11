import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import EditSensorForm from "../../../components/AssetAndFacilityManagement/AssetManagement/Sensor/EditSensorForm";
import useApiJson from "../../../hooks/useApiJson";
import { Button } from "@/components/ui/button";
import { HiPencil } from "react-icons/hi";
import ViewCamera from "../../../components/AssetAndFacilityManagement/AssetManagement/Sensor/ViewCamera";

function ViewCameraPage() {
  const apiJson = useApiJson();
const navigate = useNavigate();
  const { sensorId } = useParams<{ sensorId: string }>();
  const [authorization, setAuthorization] = useState<any>(undefined);

  useEffect(() => {
    apiJson.get(
      `http://localhost:3000/api/assetFacility/getAuthorizationForCamera/${sensorId}`).then(res => {
        const newAuth = {
            userId: res.userId,
            hubId: res.hubId,
            date: res.date,
            ipAddressName: res.ipAddressName,
            signature: res.signature,
            sensorName: res.sensorName
        }
        setAuthorization(newAuth);
      }).catch(e => console.log(e));
  }, []);

  return (
    <div className="p-10">
        
        <Button variant={"outline"} type="button" onClick={() => navigate(-1)} className="">
            Back
          </Button>
        <h1>{authorization?.sensorName}</h1>
      {authorization && (
        <ViewCamera authorization={authorization} />
      )}
    </div>
  );
}

export default ViewCameraPage;
