interface Employee {
  employeeId: number;
  employeeName: string;
  employeeEmail: string;
  employeeAddress: string;
  employeePhoneNumber: string;
  employeePasswordHash: string;
  employeeSalt: string;
  employeeDoorAccessCode: string;
  employeeEducation: string;
  isAccountManager: boolean;
  employeeBirthDate: Date;
  employeeDateOfResignation: Date;

  //   keeper?: Keeper | null;
  //   planningStaff?: PlanningStaff | null;
  //   generalStaff?: GeneralStaff | null; */
}

export default Employee;
