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
import { useAuthContext } from "src/hooks/useAuthContext";

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
    employeeBirthDate: new Date(),
    isAccountManager: false,
    dateOfResignation: new Date(),
    employeeProfileUrl: "",
  };
  
  const { state, dispatch } = useAuthContext();
  const { user } = state;

  const [curEmployee, setCurEmployee] = useState<Employee>(emptyEmployee);
  const request = { includes: [] };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const responseJson = await apiJson.post(
          "http://localhost:3000/api/employee/getEmployee",
          request
        );
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

  {
    /*const actionBodyTemplate = (employee: Employee) => {
        return (
          <React.Fragment>
            <NavLink to={`/facility/editfacility/${employee.employeeName}`}>
              <Button className="mr-2">
                <HiPencil />
                <span>Edit</span>
              </Button>
            </NavLink>
            <Button
              variant={"destructive"}
              className="mr-2"
              onClick={() => confirmDeletefacility(facility)}
            >
              <HiTrash />
              <span>Delete</span>
            </Button>
          </React.Fragment>
        );
      };*/
  }

  return (
    <div>
      <div>
        <div>
          
        </div>
      </div>
    </div>
  );
}

export default Profile;
