import { Toast } from "primereact/toast";
import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import useApiJson from "../../hooks/useApiJson";
import Employee from "src/models/Employee";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import { NavLink } from "react-router-dom";
import { HiCheck, HiPencil, HiTrash, HiX } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "../../hooks/useAuthContext";

{
  /*const toast = useRef<Toast>(null);*/
}

function Profile() {
  const apiJson = useApiJson();
  
  let emptyEmployee: Employee = {
    employeeId: -1,
    employeeName: "",
    employeeEmail: "",
    employeeAddress: "",
    employeePhoneNumber: "",
    employeeDoorAccessCode: "",
    employeeEducation: "",
    employeeBirthDate: null,
    isAccountManager: false,
    dateOfResignation: null,
    employeeProfileUrl: "",
  };

  const [curEmployee, setCurEmployee] = useState<Employee>(emptyEmployee);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const responseJson = await apiJson.get(
          "http://localhost:3000/api/employee/getEmployee"
        );
        console.log("responseJson", responseJson["employee"])
        setCurEmployee(responseJson["employee"])
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchEmployees();
  }, []);

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Manage Employees</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
      </span>
    </div>
  );

  return (
    <div>
      <div>
        <div>
        <h1> Welcome {curEmployee.employeeName}!</h1>
        </div>
        <br />
        <div>
        <h1> Email : {curEmployee.employeeEmail}!</h1>
        </div>
        <br />
        <div>
        <h1> Address : {curEmployee.employeeAddress}!</h1>
        </div>
        <br />
        <div>
        <h1> Access Code : {curEmployee.employeeDoorAccessCode}!</h1>
        </div>
        <br />
        <div>
        <h1> Phone Number : {curEmployee.employeePhoneNumber}!</h1>
        </div>
        <br />
        <div>
        <h1> Education : {curEmployee.employeeEducation}!</h1>
        </div>
        <br />
        
      <React.Fragment>
        <NavLink to={"/updateProfile"}>
          <Button className="mr-2">
            <HiPencil />
            <span>Edit</span>
          </Button>
        </NavLink>
      </React.Fragment>
      </div>
    </div>
  );
}

export default Profile;
