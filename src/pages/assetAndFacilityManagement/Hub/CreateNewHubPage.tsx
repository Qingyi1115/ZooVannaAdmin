import React, { useEffect, useState } from "react";
import CreateNewHubForm from "../../../components/AssetAndFacilityManagement/AssetManagement/Hub/CreateNewHubForm";
import Facility from "../../../models/Facility";
import useApiJson from "../../../hooks/useApiJson";
import { useParams } from "react-router-dom";

function CreateNewHubPage() {
  const apiJson = useApiJson();
  const { facilityId } = useParams<{ facilityId: string }>();
  const [refreshSeed, setRefreshSeed] = useState<number>(0);
  return (
    <div className="p-10">
      <CreateNewHubForm pageFacilityId={facilityId} refreshSeed={0} setRefreshSeed={setRefreshSeed} />
    </div>
  );
}

export default CreateNewHubPage;
