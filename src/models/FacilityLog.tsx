import { FacilityLogType } from "src/enums/FacilityLogType";
import GeneralStaff from "./GeneralStaff";
import InHouse from "./InHouse";
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
  generalStaffs: GeneralStaff[];
}

export default FacilityLog;
