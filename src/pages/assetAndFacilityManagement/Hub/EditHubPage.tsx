import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import EditHubForm from "../../../components/AssetAndFacilityManagement/AssetManagement/Hub/EditHubForm";
import useApiJson from "../../../hooks/useApiJson";
import Hub from "src/models/Hub";
import { HubStatus } from "../../../enums/HubStatus";
import Facility from "../../../models/Facility";


function EditHubPage() {
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
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchHub();
  }, [refreshSeed]);


  return (
    <div className="p-10">
      {curHub && curHub.hubProcessorId != -1 && (
        <EditHubForm
          pageFacilityId={facilityId}
          curHub={curHub}
          refreshSeed={refreshSeed}
          setRefreshSeed={setRefreshSeed} />
      )}
    </div>
  );
}

export default EditHubPage;