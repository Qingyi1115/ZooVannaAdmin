import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import ViewCameraFeeds from "../../../components/AssetAndFacilityManagement/AssetManagement/Sensor/ViewCameraFeeds";
import useApiJson from "../../../hooks/useApiJson";

function ViewCameraFeedsPage() {
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const { facilityId } = useParams<{ facilityId: string }>();
  const [authorizations, setAuthorizations] = useState<any[]>([]);

  useEffect(() => {
    apiJson.get(
      `http://localhost:3000/api/assetFacility/getAuthorizationForCameraByFacilityId/${facilityId}`).then(res => {
        console.log("ViewCameraFeedsPage", res)
        setAuthorizations(res.data);
      }).catch(e => console.log(e));
  }, []);

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
        <div className="flex justify-between">
          <Button variant={"outline"} type="button" onClick={() => navigate(-1)} className="">
            Back
          </Button>
          <span className="self-center text-title-xl font-bold">
            View Camera Feeds
          </span>
          <Button disabled className="invisible">
            Back
          </Button>
        </div>
        <hr className="bg-stroke opacity-20" />
        {authorizations && (
          <ViewCameraFeeds authorizations={authorizations} />
        )}
      </div>
    </div>
  );
}

export default ViewCameraFeedsPage;
