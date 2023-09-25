import Facility from "./Facility";
import InHouse from "./InHouse";

interface FacilityLog {
  logId: number;
  dateTime: Date;
  isMaintenance: Boolean;
  title: string;
  details: string;
  remark: string;
  facility: Facility;
}

export default FacilityLog;
