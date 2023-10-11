import Facility from "./Facility";
import InHouse from "./InHouse";

interface FacilityLog {
  facilityLogId: number;
  dateTime: Date;
  isMaintenance: Boolean;
  title: string;
  details: string;
  remarks: string;
  facility: Facility;
  staffName: string;
}

export default FacilityLog;
