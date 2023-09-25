import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useApiJson from "../../../hooks/useApiJson";
import Hub from "../../../models/Hub";
import { Button } from "@/components/ui/button";
import { HubStatus } from "../../../enums/HubStatus";
import ViewHubDetails from "../../../components/AssetAndFacilityManagement/AssetManagement/Hub/ViewHubDetails";
import Facility from "../../../models/Facility";

function ViewHubDetailsPage() {
  const apiJson = useApiJson();
  const { hubProcessorId } = useParams<{ hubProcessorId: string }>();
  const { facilityId } = useParams<{ facilityId: string }>();
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  let emptyHub: Hub = {
    hubProcessorId: -1,
    processorName: "",
    ipAddressName: "",
    lastDataUpdate: null,
    hubSecret: "",
    hubStatus: HubStatus.PENDING,
    facilityId: -1
  };


  const [curHub, setCurHub] = useState<Hub>(emptyHub);

  useEffect(() => {
    const fetchHub = async () => {
      try {
        const responseJson = await apiJson.post(
          `http://localhost:3000/api/assetFacility/getHub/${hubProcessorId}`,
          { includes: ["sensors", "facility"] });
        setCurHub(responseJson.hubProcessor as Hub);
        console.log(curHub);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchHub();
  }, [refreshSeed]);

  useEffect(() => {
    const hub = apiJson.result as Hub;
    setCurHub(hub);
  }, [apiJson.loading]);

  return (
    <div className="p-10">

      <div className="relative flex flex-col">
        <ViewHubDetails pageFacilityId={facilityId} curHub={curHub} refreshSeed={refreshSeed}
          setRefreshSeed={setRefreshSeed}></ViewHubDetails>
      </div>
    </div>

  );
}

export default ViewHubDetailsPage;