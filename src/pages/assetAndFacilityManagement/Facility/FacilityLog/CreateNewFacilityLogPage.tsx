import React, { useEffect, useState } from "react";
import CreateNewFacilityLogForm from "../../../../components/AssetAndFacilityManagement/FacilityManagement/viewFacilityDetails/FacilityLog/CreateNewFacilityLogForm";
import { useParams } from "react-router-dom";
import useApiJson from "../../../../hooks/useApiJson";
import Facility from "../../../../models/Facility";
import { FacilityLogType } from "../../../../enums/FacilityLogType";

function CreateNewFacilityLogPage() {
  const apiJson = useApiJson();
  const [refreshSeed, setRefreshSeed] = useState<number>(0);
  const { facilityId } = useParams<{ facilityId: string }>();
  const { facilityLogType } = useParams<{ facilityLogType: string }>();

  let emptyFacility: Facility = {
    facilityId: -1,
    facilityName: "",
    xCoordinate: 0,
    yCoordinate: 0,
    facilityDetail: "",
    facilityDetailJson: undefined,
    isSheltered: false,
    hubProcessors: [],
    showOnMap: false
  };

  const [curFacility, setCurFacility] = useState<Facility>(emptyFacility);
  const [curFacilityLogType, setCurFacilityLogType] = useState<FacilityLogType>(facilityLogType as FacilityLogType);

  useEffect(() => {
    apiJson.post(`http://localhost:3000/api/assetFacility/getFacility/${facilityId}`, { includes: [] }).then(res => {
      setCurFacility(res.facility as Facility);
    });
  }, [refreshSeed]);


  return (
    <div className="p-10">
      <CreateNewFacilityLogForm curFacility={curFacility} curFacilityLogType={curFacilityLogType} />
    </div>
  );
}

export default CreateNewFacilityLogPage;
