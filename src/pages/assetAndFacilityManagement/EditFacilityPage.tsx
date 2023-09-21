import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import EditFacilityForm from "../../components/AssetAndFacilityManagement/FacilityManagement/EditFacilityForm";
import useApiJson from "../../hooks/useApiJson";
import Facility from "../../models/Facility";

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
    apiJson.get(`http://localhost:3000/api/assetfacility/getFacility/${facilityId}`);
  }, []);

  useEffect(() => {
    const facility = apiJson.result as Facility;
    setCurFacility(facility);
  }, [apiJson.loading]);

  return (
    <div className="p-10">
      {curFacility && curFacility.facilityId != -1 && (
        <EditFacilityForm curFacility={curFacility} />
      )}
    </div>
  );
}

export default EditFacilityPage;
