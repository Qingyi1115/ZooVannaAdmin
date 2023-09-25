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
import AllHubDatatable from "../../../components/AssetAndFacilityManagement/AssetManagement/Hub/AllHubDatatable";
import ViewAllFacilityLogsPage from "./ViewAllFacilityLogsPage";
import AllCustomerReportsDatatable from "../../../components/AssetAndFacilityManagement/FacilityManagement/viewFacilityDetails/CustomerReport/AllCustomerReportsDatatable";
import ThirdParty from "src/models/ThirdParty";
import InHouse from "src/models/InHouse";
import { FacilityType } from "src/enums/FacilityType";
import AllFacilityLogsDatatable from "../../../components/AssetAndFacilityManagement/FacilityManagement/viewFacilityDetails/FacilityLog/AllFacilityLogsDatatable";
import FacilityLog from "../../../models/FacilityLog";
import ViewFacilityLogDetails from "../../../components/AssetAndFacilityManagement/FacilityManagement/viewFacilityDetails/FacilityLog/ViewFacilityLogDetails";



function ViewFacilityDetailsPage() {
  const apiJson = useApiJson();
  const [refreshSeed, setRefreshSeed] = useState<number>(0);
  const { logId } = useParams<{ logId: string }>();
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

  let emptyFacilityLog: FacilityLog = {
    logId: -1,
    dateTime: new Date(),
    isMaintenance: false,
    title: "",
    details: "",
    remarks: "",
    facility: emptyFacility
  }

  const [curFacilityLog, setCurFacilityLog] = useState<FacilityLog>(emptyFacilityLog);

  useEffect(() => {
    apiJson.post(`http://localhost:3000/api/assetFacility/getFacilityLog/${logId}`, { includes: [] }).then(res => {
      setCurFacilityLog(res.facilityLog as FacilityLog);
    });
  }, [refreshSeed]);

  return (
    <div className="p-10">
      {curFacilityLog && curFacilityLog.logId != -1 && (
        <ViewFacilityLogDetails curFacilityLog={curFacilityLog} />
      )}
    </div>
  );
}

export default ViewFacilityDetailsPage;