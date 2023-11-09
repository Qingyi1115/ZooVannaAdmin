import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Employee from "src/models/Employee";
import EditEmployeeForm from "../../components/EmployeeAccountManagement/EditEmployeeForm";
import useApiJson from "../../hooks/useApiJson";

function EditEmployeePage() {
  const apiJson = useApiJson();

  let emptyEmployee: Employee = {
    employeeId: -1,
    employeeName: "",
    employeeEmail: "",
    employeePhoneNumber: "",
    employeeAddress: "",
    employeeBirthDate: new Date(),
    employeeEducation: "",
    dateOfResignation: null,
    employeeDoorAccessCode: "",
    isAccountManager: false,
    employeeProfileUrl: "",
  };

  const { employeeId } = useParams<{ employeeId: string }>();
  const [curEmployee, setCurEmployee] = useState<Employee>(emptyEmployee);

  useEffect(() => {
    apiJson.get(`http://localhost:3000/api/employee/getemployee/${employeeId}`);
  }, []);

  return (
    <div className="p-10">
      {curEmployee && curEmployee.employeeId != -1 && (
        <EditEmployeeForm curEmployee={curEmployee} />
      )}
    </div>
  );
}

export default EditEmployeePage;
