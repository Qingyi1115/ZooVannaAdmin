import React, { useEffect, useState } from "react";
import CreateNewHubForm from "../../../components/AssetAndFacilityManagement/AssetManagement/Hub/CreateNewHubForm";
import Facility from "../../../models/Facility";
import useApiJson from "../../../hooks/useApiJson";
import { useParams } from "react-router-dom";

function CreateNewHubPage() {
  const apiJson = useApiJson();
  const { facilityId } = useParams<{ facilityId: string }>();
  console.log("Facility ID: " + facilityId);
  const { facilityDetail } = useParams<{ facilityDetail: string }>();
  const [refreshSeed, setRefreshSeed] = useState<number>(0);
  const facilityDetailJson = (facilityDetail == "thirdParty" ?
    {
      ownership: "",
      ownerContact: "",
      maxAccommodationSize: "",
      hasAirCon: "",
      facilityType: ""
    } :
    {
      isPaid: "",
      maxAccommodationSize: "",
      hasAirCon: "",
      facilityType: ""
    })

  let emptyFacility: Facility = {
    facilityId: -1,
    facilityName: "",
    xCoordinate: 0,
    yCoordinate: 0,
    facilityDetail: "",
    facilityDetailJson: facilityDetailJson,
    isSheltered: false
  };

  const [curFacility, setCurFacility] = useState<Facility>(emptyFacility);

  useEffect(() => {
    apiJson.post(`http://localhost:3000/api/assetFacility/getFacility/${facilityId}`, { includes: [] }).then(res => {
      setCurFacility(res["facility"]);
    });
  }, [refreshSeed]);
  console.log("Current Facility: " + curFacility.facilityId);
  return (
    <div className="p-10">
      <CreateNewHubForm curFacility={curFacility} refreshSeed={0} setRefreshSeed={function (value: React.SetStateAction<number>): void {
        throw new Error("Function not implemented.");
      }} />
    </div>
  );
}

export default CreateNewHubPage;
