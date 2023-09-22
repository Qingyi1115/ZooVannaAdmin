import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import EditFacilityForm from "../../../components/AssetAndFacilityManagement/FacilityManagement/EditFacilityForm";
import useApiJson from "../../../hooks/useApiJson";
import Facility from "../../../models/Facility";

function EditFacilityPage() {
  const apiJson = useApiJson();

  let emptyFacility: Facility = {
    facilityId: -1,
    facilityName: "",
    facilityDetail: "",
    facilityDetailJson: "",
    xCoordinate: 0,
    yCoordinate: 0
  };

  const { facilityId } = useParams<{ facilityId: string }>();
  const [curFacility, setCurFacility] = useState<Facility>(emptyFacility);

  useEffect(() => {
    apiJson.post(`http://localhost:3000/api/assetFacility/getFacility/${facilityId}`, {includes:[]}).then(res=>{
      setCurFacility(res["facility"]);
    });
  }, []);

  return (
    <div className="p-10">
      {curFacility && curFacility.facilityId != -1 && (
        <EditFacilityForm curFacility={curFacility} refreshSeed={0} setRefreshSeed={()=>undefined}/>
      )}
    </div>
  );
}

export default EditFacilityPage;
