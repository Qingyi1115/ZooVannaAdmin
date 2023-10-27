import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import useApiJson from "../../../../hooks/useApiJson";
import Facility from "../../../../models/Facility";
import EditFacilityLogForm from "../../../../components/AssetAndFacilityManagement/FacilityManagement/viewFacilityDetails/FacilityLog/EditFacilityLogForm";
import FacilityLog from "../../../../models/FacilityLog";
import { FacilityLogType } from "../../../../enums/FacilityLogType";
import InHouse from "../../../../models/InHouse";
import { FacilityType } from "../../../../enums/FacilityType";

function EditFacilityLogPage() {
  const apiJson = useApiJson();
  const { facilityLogId } = useParams<{ facilityLogId: string }>();
  let emptyFacility: Facility = {
    facilityId: -1,
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
    apiJson.get(`http://localhost:3000/api/assetFacility/getFacilityLog/${facilityLogId}`).then(res => {
      setCurFacilityLog(res.facilityLog as FacilityLog);
    });
  }, []);

  return (
    <div className="p-10">
      {curFacilityLog && curFacilityLog.facilityLogId != -1 && (
        <EditFacilityLogForm curFacilityLog={curFacilityLog} />
      )}
    </div>
  );
}

export default EditFacilityLogPage;
