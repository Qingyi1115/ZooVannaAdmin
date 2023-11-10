import { useEffect, useState } from "react";
import { useParams } from "react-router";
import EditFacilityLogForm from "../../../../components/AssetAndFacilityManagement/FacilityManagement/viewFacilityDetails/FacilityLog/EditFacilityLogForm";
import { FacilityLogType } from "../../../../enums/FacilityLogType";
import { FacilityType } from "../../../../enums/FacilityType";
import useApiJson from "../../../../hooks/useApiJson";
import Facility from "../../../../models/Facility";
import FacilityLog from "../../../../models/FacilityLog";
import InHouse from "../../../../models/InHouse";

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
    apiJson.post(`http://localhost:3000/api/assetFacility/getFacilityLog/${facilityLogId}`,
    {includes:["inHouse", "generalStaffs"]}).then(res => {
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
