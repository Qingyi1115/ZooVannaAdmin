import { GeneralStaffType } from "../enums/Enumurated";
import Employee from "./Employee";

interface GeneralStaff {
    employee : Employee | null;
    generalStaffType: GeneralStaffType;
    operatedFacility : any | null;
    maintainedFacilities : any[] | null;
    sensors : any[] | null;
    isDisabled: boolean; 
}

export default GeneralStaff;
