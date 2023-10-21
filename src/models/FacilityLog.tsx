import { FacilityLogType } from "src/enums/FacilityLogType";
import Facility from "./Facility";
import InHouse from "./InHouse";
import Employee from "./Employee";
interface FacilityLog {
  facilityLogId: number;
  dateTime: Date;
  isMaintenance: Boolean;
  title: string;
  details: string;
  remarks: string;
  staffName: string;
  facilityLogType: FacilityLogType;
  inHouse: InHouse;
  generalStaffs: Employee[];
}

export default FacilityLog;
