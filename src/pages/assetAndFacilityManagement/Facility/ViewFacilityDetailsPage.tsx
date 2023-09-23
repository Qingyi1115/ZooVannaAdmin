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
import ViewInHouseDetails from "../../../components/AssetAndFacilityManagement/FacilityManagement/viewFacilityDetails/ViewInHouseDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ViewAllSensorPage from "../Sensor/ViewAllSensorsPage";
import ManageMaintenanceStaff from "../../../components/AssetAndFacilityManagement/FacilityManagement/ManageMaintenanceStaff";
import Employee from "../../../models/Employee";
import { Separator } from "@/components/ui/separator";
import ManageMaintenanceStaffPage from "./ManageMaintenanceStaffPage";



function ViewFacilityDetailsPage() {
  const apiJson = useApiJson();
  const { facilityId } = useParams<{ facilityId: string }>();
  const [assignedStaffIds, setAssignedStaffIds] = useState<number[]>([]);
  const [allStaffs, setAllStaffs] = useState<Employee[]>([]);
  const [empList, setEmpList] = useState<Employee[]>([]);

  let facility: Facility = {
    facilityId: -1,
    facilityName: "",
    xCoordinate: 0,
    yCoordinate: 0,
    facilityDetail: "",
    facilityDetailJson: undefined,
    isSheltered: false
  };

  const [curFacility, setCurFacility] = useState<Facility>(facility);
  const [refreshSeed, setRefreshSeed] = useState<number>(0);
  const { tab } = useParams<{ tab: string }>();

  const curThirdParty = curFacility.facilityDetail == "thirdParty" ? curFacility.facilityDetailJson : undefined;
  const curInHouse = curFacility.facilityDetail == "inHouse" ? curFacility.facilityDetailJson : undefined;

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const responseJson = await apiJson.post(
          `http://localhost:3000/api/assetFacility/getFacility/${facilityId}`,
          { includes: [] }
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
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
        <div className="flex justify-between">
          <NavLink className="flex" to={`/assetfacility/viewallfacilities`}>
            <Button variant={"outline"} type="button" className="">
              Back
            </Button>
          </NavLink>
          <span className="self-center text-lg text-graydark">
            View Facility Details
          </span>
          <Button disabled className="invisible">
            Back
          </Button>
        </div>

        <hr className="bg-stroke opacity-20" />
        <span className=" self-center text-title-xl font-bold">
          {curFacility.facilityName}
        </span>

        <Tabs
          defaultValue={tab ? `${tab}` : "facilityDetails"}
          className="w-full"
        >
          <TabsList className="no-scrollbar w-full justify-around overflow-x-auto px-4 text-xs xl:text-base">
            <span className="invisible">_____</span>
            <TabsTrigger value="facilityDetails">Facility Details</TabsTrigger>
            <TabsTrigger value="sensors">Sensors</TabsTrigger>
            <TabsTrigger value="manageMaintenance">Manage Maintenance Staff</TabsTrigger>
          </TabsList>
          <TabsContent value="facilityDetails">
            <div className="relative flex flex-col">
              <ViewFacilityDetails curFacility={curFacility}></ViewFacilityDetails>
              {curThirdParty && <ViewThirdPartyDetails curThirdParty={curThirdParty}></ViewThirdPartyDetails>}
              {curInHouse && <ViewInHouseDetails curInHouse={curInHouse}></ViewInHouseDetails>}
            </div>
          </TabsContent>
          <TabsContent value="sensors">
            <ViewAllSensorPage />
          </TabsContent>
          <TabsContent value="manageMaintenance">
            <ManageMaintenanceStaffPage />
          </TabsContent>
        </Tabs>

        {/* <div className="relative flex flex-col">
          <ViewFacilityDetails curFacility={curFacility}></ViewFacilityDetails>
          {curThirdParty && <ViewThirdPartyDetails curThirdParty={curThirdParty}></ViewThirdPartyDetails>}
          {curInHouse && <ViewInHouseDetails curInHouse={curInHouse}></ViewInHouseDetails>}
        </div>

        <div className="mb-4 flex justify-start gap-6 self-center">
          <NavLink to={`/assetfacility/editfacility/${facilityId}/managestaff`}>
            <Button>Manage Maintenance Staff</Button>
          </NavLink>
        </div> */}
      </div>
    </div>
  );
}

export default ViewFacilityDetailsPage;