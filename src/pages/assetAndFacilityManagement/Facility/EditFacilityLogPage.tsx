import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import useApiJson from "../../../hooks/useApiJson";
import Facility from "../../../models/Facility";
import EditFacilityLogForm from "../../../components/AssetAndFacilityManagement/FacilityManagement/viewFacilityDetails/FacilityLog/EditFacilityLogForm";

function EditFacilityPage() {
  const apiJson = useApiJson();
  const [refreshSeed, setRefreshSeed] = useState<number>(0);
  const { facilityId } = useParams<{ facilityId: string }>();
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

  const [curFacility, setCurFacility] = useState<Facility>(emptyFacility);

  useEffect(() => {
    apiJson.post(`http://localhost:3000/api/assetFacility/getFacility/${facilityId}`, { includes: [] }).then(res => {
      setCurFacility(res["facility"]);
    });
  }, [refreshSeed]);

  return (
    <div className="p-10">
      {curFacility && curFacility.facilityId != -1 && (
        <EditFacilityLogForm curFacility={curFacility} />
      )}
    </div>
  );
}

export default EditFacilityPage;
