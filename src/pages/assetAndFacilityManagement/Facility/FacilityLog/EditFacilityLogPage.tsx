import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import useApiJson from "../../../../hooks/useApiJson";
import Facility from "../../../../models/Facility";
import EditFacilityLogForm from "../../../../components/AssetAndFacilityManagement/FacilityManagement/viewFacilityDetails/FacilityLog/EditFacilityLogForm";
import FacilityLog from "../../../../models/FacilityLog";

function EditFacilityLogPage() {
  const apiJson = useApiJson();
  const { facilityLogId } = useParams<{ facilityLogId: string }>();
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
    facilityLogId: -1,
    dateTime: new Date(),
    isMaintenance: false,
    title: "",
    details: "",
    remarks: "",
    facility: emptyFacility,
    staffName: ""
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
