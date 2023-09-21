interface Employee {
  employeeId: number;
  employeeName: string;
  employeeEmail: string;
  employeeAddress: string;
  employeePhoneNumber: string;
  employeePasswordhash: string;
  employeeSalt: string;
  employeeDoorAccessCode: string;
  employeeEducation: string;
  employeeBirthDate: Date;
  isAccountManager: boolean;
  dateOfResignation: Date | null;
  employeeProfileUrl: string | null;

  //   keeper?: Keeper | null;
  //   planningStaff?: PlanningStaff | null;
  //   generalStaff?: GeneralStaff | null; */
}

export default Employee;
