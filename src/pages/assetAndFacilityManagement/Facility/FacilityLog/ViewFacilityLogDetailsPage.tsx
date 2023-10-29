import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useApiJson from "../../../../hooks/useApiJson";
import Facility from "../../../../models/Facility";

import FacilityLog from "../../../../models/FacilityLog";
import ViewFacilityLogDetails from "../../../../components/AssetAndFacilityManagement/FacilityManagement/viewFacilityDetails/FacilityLog/ViewFacilityLogDetails";
import { FacilityLogType } from "../../../../enums/FacilityLogType";
import InHouse from "../../../../models/InHouse";
import { FacilityType } from "../../../../enums/FacilityType";



function ViewFacilityLogDetailsPage() {
  const apiJson = useApiJson();
  const [refreshSeed, setRefreshSeed] = useState<number>(0);
  const { logId } = useParams<{ logId: string }>();
  let emptyFacility: Facility = {
    facilityId: 0,
    facilityName: "",
    xCoordinate: 0,
    yCoordinate: 0,
    facilityDetail: "",
    facilityDetailJson: "",
    isSheltered: false,
    hubProcessors: [],
    showOnMap: false
  };

  let emptyInHouse: InHouse = {
    isPaid: false,
    lastMaintained: new Date(),
    maxAccommodationSize: 0,
    hasAirCon: false,
    facilityType: FacilityType.AED,
    facilityLogs: [],
    facilityId: 0
  };

  let emptyFacilityLog: FacilityLog = {
    facilityLogId: 0,
    dateTime: new Date(),
    isMaintenance: false,
    title: "",
    details: "",
    remarks: "",
    inHouse: emptyInHouse,
    staffName: "",
    facilityLogType: FacilityLogType.MAINTENANCE_LOG,
    generalStaffs: []
  }

  const [curFacilityLog, setCurFacilityLog] = useState<FacilityLog>(emptyFacilityLog);

  useEffect(() => {
    apiJson.post(`http://localhost:3000/api/assetFacility/getFacilityLog/${logId}`, { includes: ["inHouse", "generalStaffs"] }).then(res => {
      setCurFacilityLog(res.facilityLog as FacilityLog);
    });
  }, [refreshSeed]);

  return (
    <div className="p-10">
      {curFacilityLog && curFacilityLog.facilityLogId != -1 && (
        <ViewFacilityLogDetails curFacilityLog={curFacilityLog} />
      )}
    </div>
  );
}

export default ViewFacilityLogDetailsPage;