import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useApiJson from "../../../hooks/useApiJson";
import Facility from "../../../models/Facility";

import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ViewFacilityDetails from "../../../components/AssetAndFacilityManagement/FacilityManagement/viewFacilityDetails/ViewFacilityDetails";
import ViewThirdPartyDetails from "../../../components/AssetAndFacilityManagement/FacilityManagement/viewFacilityDetails/ViewThirdPartyDetails";
import ViewInHouseDetails from "../../../components/AssetAndFacilityManagement/FacilityManagement/viewFacilityDetails/ViewInHouseDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Employee from "../../../models/Employee";
import ManageMaintenanceStaffPage from "./ManageMaintenanceStaffPage";
import ViewAllCustomerReportsPage from "./ViewAllCustomerReportsPage";
import AllHubDatatable from "../../../components/AssetAndFacilityManagement/AssetManagement/Hub/AllHubDatatable";
import ViewAllFacilityLogsPage from "./ViewAllFacilityLogsPage";



function ViewFacilityDetailsPage() {
  const apiJson = useApiJson();
  const { facilityId } = useParams<{ facilityId: string }>();
  const [assignedStaffIds, setAssignedStaffIds] = useState<number[]>([]);
  const [allStaffs, setAllStaffs] = useState<Employee[]>([]);
  const [empList, setEmpList] = useState<Employee[]>([]);

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
  const [refreshSeed, setRefreshSeed] = useState<number>(0);
  const { tab } = useParams<{ tab: string }>();

  const curThirdParty = curFacility.facilityDetail == "thirdParty" ? curFacility.facilityDetailJson : undefined;
  const curInHouse = curFacility.facilityDetail == "inHouse" ? curFacility.facilityDetailJson : undefined;

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const responseJson = await apiJson.post(
          `http://localhost:3000/api/assetFacility/getFacility/${facilityId}`,
          { includes: ["hubProcessors"] }
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
            <TabsTrigger value="facilityDetails">Facility Details</TabsTrigger>
            <TabsTrigger value="hubs">Hubs</TabsTrigger>
            <TabsTrigger value="manageMaintenance">Manage Maintenance Staff</TabsTrigger>
            <TabsTrigger value="facilityLog">Facility Logs</TabsTrigger>
            <TabsTrigger value="customerReport">Customer Report</TabsTrigger>
          </TabsList>
          <TabsContent value="facilityDetails">
            <div className="relative flex flex-col">
              <ViewFacilityDetails curFacility={curFacility}></ViewFacilityDetails>
              {curThirdParty && <ViewThirdPartyDetails curThirdParty={curThirdParty}></ViewThirdPartyDetails>}
              {curInHouse && <ViewInHouseDetails curInHouse={curInHouse}></ViewInHouseDetails>}
            </div>
          </TabsContent>
          <TabsContent value="facilityLog">
            <ViewAllFacilityLogsPage />
          </TabsContent>
          <TabsContent value="hubs">
            <AllHubDatatable curFacility={curFacility} />
          </TabsContent>
          <TabsContent value="manageMaintenance">
            <ManageMaintenanceStaffPage />
          </TabsContent>
          <TabsContent value="customerReport">
            <ViewAllCustomerReportsPage />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ViewFacilityDetailsPage;