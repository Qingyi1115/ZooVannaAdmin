import { FacilityType } from "../enums/FacilityType"
import CustomerReportLog from "./CustomerReportLog";
import Facility from "./Facility"
import FacilityLog from "./FacilityLog"
import GeneralStaff from "./GeneralStaff";
import ZooEvent from "./ZooEvent";

interface InHouse {
    lastMaintained: Date;
    isPaid: Boolean;
    maxAccommodationSize: number;
    hasAirCon: Boolean;
    facilityType: FacilityType;
    facilityLogs: FacilityLog[];
    facility: Facility;
    maintenanceStaffs?: GeneralStaff[];
    operationStaffs?: GeneralStaff[];
    zooEvents?: ZooEvent[];
    customerReportLogs?: CustomerReportLog[];
}

export default InHouse;
