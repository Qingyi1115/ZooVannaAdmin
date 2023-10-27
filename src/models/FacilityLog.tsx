import { FacilityLogType } from "src/enums/FacilityLogType";
import InHouse from "./InHouse";
import GeneralStaff from "./GeneralStaff";
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
