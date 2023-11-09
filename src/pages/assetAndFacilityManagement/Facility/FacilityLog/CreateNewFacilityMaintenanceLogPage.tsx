import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CreateNewFacilityMaintenanceLogForm from "../../../../components/AssetAndFacilityManagement/FacilityManagement/viewFacilityDetails/FacilityLog/CreateNewFacilityMaintenanceLogForm";
import { FacilityLogType } from "../../../../enums/FacilityLogType";
import { FacilityType } from "../../../../enums/FacilityType";
import useApiJson from "../../../../hooks/useApiJson";
import Facility from "../../../../models/Facility";
import FacilityLog from "../../../../models/FacilityLog";
import InHouse from "../../../../models/InHouse";

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
    facility: {} as any
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

  // const [curFacility, setCurFacility] = useState<Facility>(emptyFacility);

  // useEffect(() => {
  //   apiJson.post(`http://localhost:3000/api/assetFacility/getFacility/${facilityId}`, { includes: [] }).then(res => {
  //     setCurFacility(res.facility as Facility);
  //   });
  // }, []);


  const [curFacilityLog, setCurFacilityLog] = useState<FacilityLog>(emptyFacilityLog);

  useEffect(() => {
    apiJson.post(`http://localhost:3000/api/assetFacility/getFacilityLog/${facilityLogId}`, { includes: ["inHouse", "generalStaffs"] }).then(res => {
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
