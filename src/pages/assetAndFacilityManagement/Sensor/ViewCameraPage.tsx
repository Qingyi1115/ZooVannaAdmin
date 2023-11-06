import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import ViewCamera from "../../../components/AssetAndFacilityManagement/AssetManagement/Sensor/ViewCamera";
import useApiJson from "../../../hooks/useApiJson";

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
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
        <div className="flex justify-between">
          <Button variant={"outline"} type="button" onClick={() => navigate(-1)} className="">
            Back
          </Button>
          <span className="self-center text-lg text-graydark">
            View Camera
          </span>
          <Button disabled className="invisible">
            Back
          </Button>
        </div>
        <hr className="bg-stroke opacity-20" />
        <span className=" self-center text-title-xl font-bold">
          {authorization?.sensorName}
        </span>
        {authorization && (
          <ViewCamera authorization={authorization} />
        )}
      </div>
    </div>
  );
}

export default ViewCameraPage;
