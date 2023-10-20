import { FacilityLogType } from "src/enums/FacilityLogType";
import Facility from "./Facility";
interface FacilityLog {
  facilityLogId: number;
  dateTime: Date;
  isMaintenance: Boolean;
  title: string;
  details: string;
  remarks: string;
  facility: Facility;
  staffName: string;
  facilityLogType: FacilityLogType;
}

export default FacilityLog;
