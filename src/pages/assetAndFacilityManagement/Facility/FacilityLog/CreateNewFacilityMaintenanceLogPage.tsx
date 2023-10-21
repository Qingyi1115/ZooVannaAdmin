import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApiJson from "../../../../hooks/useApiJson";
import Facility from "../../../../models/Facility";
import FacilityLog from "../../../../models/FacilityLog";
import CreateNewFacilityMaintenanceLogForm from "../../../../components/AssetAndFacilityManagement/FacilityManagement/viewFacilityDetails/FacilityLog/CreateNewFacilityMaintenanceLogForm";
import { FacilityLogType } from "../../../../enums/FacilityLogType";

function CreateNewFacilityMaintenanceLogPage() {
  const apiJson = useApiJson();
  // const { facilityId } = useParams<{ facilityId: string }>();
  const { facilityLogId } = useParams<{ facilityLogId: string }>();
  let emptyFacility: Facility = {
    facilityId: -1,
    facilityName: "",
    xCoordinate: 0,
    yCoordinate: 0,
    facilityDetail: "",
    facilityDetailJson: undefined,
    isSheltered: false,
    hubProcessors: [],
    showOnMap: false
  };

  let emptyFacilityLog: FacilityLog = {
    facilityLogId: 0,
    dateTime: new Date(),
    isMaintenance: false,
    title: "",
    details: "",
    remarks: "",
    facility: emptyFacility,
    staffName: "",
    facilityLogType: FacilityLogType.MAINTENANCE_LOG
  }

  // const [curFacility, setCurFacility] = useState<Facility>(emptyFacility);

  // useEffect(() => {
  //   apiJson.post(`http://localhost:3000/api/assetFacility/getFacility/${facilityId}`, { includes: [] }).then(res => {
  //     setCurFacility(res.facility as Facility);
  //   });
  // }, []);


  const [curFacilityLog, setCurFacilityLog] = useState<FacilityLog>(emptyFacilityLog);

  useEffect(() => {
    apiJson.get(`http://localhost:3000/api/assetFacility/getFacilityLog/${facilityLogId}`).then(res => {
      setCurFacilityLog(res.facilityLog as FacilityLog);
    });
  }, []);


  return (
    <div className="p-10">
      <CreateNewFacilityMaintenanceLogForm
        // curFacility={curFacilityLog.facility}
        curFacilityLog={curFacilityLog} />
    </div>
  );
}

export default CreateNewFacilityMaintenanceLogPage;
