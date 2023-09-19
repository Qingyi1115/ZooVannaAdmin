import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import useApiJson from "../../hooks/useApiJson";
import Employee from "src/models/Employee";
import { Country } from "../../enums/Country";
import EditEmployeeForm from "../../components/EmployeeAccountManagement/EditEmployeeForm";


function EditEmployeePage() {
  const apiJson = useApiJson();

  let emptyEmployee: Employee = {
    employeeId: -1,
    firstName: "",
    lastName: "",
    email: "",
    contactNo: "",
    birthday: new Date(),
    address: "",
    nationality: Country.Singapore,
    passwordHash: "",
    salt: ""
  };

  const { employeeName } = useParams<{ employeeName: string }>();
  const [curEmployee, setCurEmployee] = useState<Employee>(emptyEmployee);

  useEffect(() => {
    apiJson.get(`http://localhost:3000/api/employee/getemployee/${employeeName}`);
  }, []);

  useEffect(() => {
    const employee = apiJson.result as Employee;
    setCurEmployee(employee);
  }, [apiJson.loading]);

  return (
    <div className="p-10">
      {curEmployee && curEmployee.employeeId != -1 && (
        <EditEmployeeForm curEmployee={curEmployee} />
      )}
    </div>
  );
}

export default EditEmployeePage;