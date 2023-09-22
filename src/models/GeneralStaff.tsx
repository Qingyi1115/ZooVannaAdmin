import { GeneralStaffType} from "src/enums/Enumurated";

interface GeneralStaff {
    id: number;
    generalStaffType: GeneralStaffType;
    isDisabled: boolean;
    employeeId: number;
    operatedFacilityId: number | null;
    //   keeper?: Keeper | null;
    //   planningStaff?: PlanningStaff | null;
    //   generalStaff?: GeneralStaff | null; */
  }
  
  export default GeneralStaff;