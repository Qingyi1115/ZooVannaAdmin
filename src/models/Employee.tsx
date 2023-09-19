interface Employee {
  employeeId: number;
  employeeName: string;
  employeeEmail: string;
  employeeAddress: string;
  employeePhoneNumber: string;
  employeeEducation: string;
  hasAdminPrivileges: boolean;
  employeePasswordHash: string;
  employeeSalt: string;
  employeeDoorAccessCode: string;
  
}

export default Employee;
