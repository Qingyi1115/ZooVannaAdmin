import { PlannerType, Specialization} from "src/enums/Enumurated";

interface PlanningStaff {
    id: number;
    plannerType: PlannerType;
    specialization: Specialization;
    isDisabled: boolean;
    employeeId: number;
    //   keeper?: Keeper | null;
    //   planningStaff?: PlanningStaff | null;
    //   generalStaff?: GeneralStaff | null; */
  }
  
  export default PlanningStaff;