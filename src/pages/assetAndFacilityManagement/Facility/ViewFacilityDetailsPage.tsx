import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useApiJson from "../../../hooks/useApiJson";
import Facility from "../../../models/Facility";
import Species from "../../../models/Species";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ViewFacilityDetails from "../../../components/AssetAndFacilityManagement/FacilityManagement/viewFacilityDetails/ViewFacilityDetails";
import ViewThirdPartyDetails from "../../../components/AssetAndFacilityManagement/FacilityManagement/viewFacilityDetails/ViewThirdPartyDetails";



function ViewFacilityDetailsPage() {
    const apiJson = useApiJson();
    let facility: Facility = {
      facilityId: -1,
      facilityName: "",
      xCoordinate: 0,
      yCoordinate: 0,
      facilityDetail: "",
      facilityDetailJson: undefined
    };

    const { facilityId } = useParams<{ facilityId: string}>();
    const [curFacility, setCurFacility] = useState<Facility>(facility);
    const [refreshSeed, setRefreshSeed] = useState<number>(0);

    const curThirdParty = curFacility.facilityDetail=="thirdParty" ? curFacility.facilityDetailJson : undefined;
    const curInHouse = curFacility.facilityDetail=="inHouse" ? curFacility.facilityDetailJson : undefined;

    useEffect(() => {
        const fetchFacilities = async () => {
          try {
            const responseJson = await apiJson.post(
              `http://localhost:3000/api/assetFacility/getFacility/${facilityId}`,
              {includes:[]}
            );
            console.log(responseJson);
            setCurFacility(responseJson.facility as Facility);
          } catch (error: any) {
            console.log(error);
          }
        };
    
        fetchFacilities();
    }, [refreshSeed]);

      return (
        <div className="my-4 flex justify-start gap-6">
          <NavLink to={`/species/editspecies/${facilityId}`}>
            <Button>Edit Basic Information</Button>
          </NavLink>
        <ViewFacilityDetails curFacility={curFacility}></ViewFacilityDetails>
        <ViewThirdPartyDetails curThirdParty={curThirdParty}></ViewThirdPartyDetails>
        </div>
      );
    }

export default ViewFacilityDetailsPage;