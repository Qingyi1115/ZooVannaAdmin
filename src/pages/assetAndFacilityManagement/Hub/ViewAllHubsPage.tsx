import React, { useEffect, useState } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import AllHubDatatable from "../../../components/AssetAndFacilityManagement/AssetManagement/Hub/AllHubDatatable";
import Facility from "../../../models/Facility";
import useApiJson from "../../../hooks/useApiJson";
import { useParams } from "react-router-dom";

function ViewAllHubPage() {
  const apiJson = useApiJson();
  const { facilityId } = useParams<{ facilityId: string }>();
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
  return (
    <div className="flex w-full flex-col gap-6 rounded-lg bg-white p-5 text-black">
      <AllHubDatatable curFacility={curFacility} refreshSeed={0} setRefreshSeed={function (value: React.SetStateAction<number>): void {
        throw new Error("Function not implemented.");
      }} />
    </div>
  );
}

export default ViewAllHubPage;
