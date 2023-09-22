import GeneralStaff from "./GeneralStaff";
import Keeper from "./Keeper";
import PlanningStaff from "./PlanningStaff";

interface Employee {
  employeeId: number;
  employeeName: string;
  employeeEmail: string;
  employeeAddress: string;
  employeePhoneNumber: string;
  employeeDoorAccessCode: string;
  employeeEducation: string;
  employeeBirthDate: Date | null;
  isAccountManager: boolean;
  dateOfResignation: Date | null;
  employeeProfileUrl: string | null;
  keeper?: Keeper | null;
  planningStaff?: PlanningStaff | null;
  generalStaff?: GeneralStaff | null;
}

export default Employee;
