import { Toast } from "primereact/toast";
import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import useApiJson from "../../hooks/useApiJson";
import Employee from "src/models/Employee";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import * as Form from "@radix-ui/react-form";
import { HiCheck, HiPencil, HiTrash, HiX } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "../../hooks/useAuthContext";
import { NavLink } from "react-router-dom";

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
      
    <Form.Root
      className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
      onSubmit={()=>{}}
      encType="multipart/form-data"
    >
        <div>
        <h1> Welcome {curEmployee.employeeName}!</h1>
        </div>
        <br />

        <Form.Field
      name=""
      className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
    >
        <Form.Control
        type="text"
        required={true}
        placeholder={`Email : ${curEmployee.employeeEmail}`}
        value={`Email : ${curEmployee.employeeEmail}`}
        step={0.5}
        pattern=""
        onChange={(e) => {}}
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium shadow outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
        />
        </Form.Field>
        
        <Form.Field
      name=""
      className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
    >
        <Form.Control
        type="text"
        required={true}
        placeholder={`Address : ${curEmployee.employeeAddress}`}
        value={`Address : ${curEmployee.employeeAddress}`}
        step={0.5}
        pattern=""
        onChange={(e) => {}}
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium shadow outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
        />
        </Form.Field>
        
        <Form.Field
      name=""
      className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
    >
        <Form.Control
        type="text"
        required={true}
        placeholder={`Access Code : ${curEmployee.employeeDoorAccessCode}`}
        value={`Access Code : ${curEmployee.employeeDoorAccessCode}`}
        step={0.5}
        pattern=""
        onChange={(e) => {}}
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium shadow outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
        />
        </Form.Field>
        
        <Form.Field
      name=""
      className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
    >
        <Form.Control
        type="text"
        required={true}
        placeholder={`Phone Number : ${curEmployee.employeePhoneNumber}`}
        value={`Phone Number : ${curEmployee.employeePhoneNumber}`}
        step={0.5}
        pattern=""
        onChange={(e) => {}}
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium shadow outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
        />
        </Form.Field>
        
        <Form.Field
      name=""
      className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
    >
        <Form.Control
        type="text"
        required={true}
        placeholder={`Education : ${curEmployee.employeeEducation}`}
        value={`Education : ${curEmployee.employeeEducation}`}
        step={0.5}
        pattern=""
        onChange={(e) => {}}
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium shadow outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
        />
        </Form.Field>
      <React.Fragment>
        <NavLink to={"/updateProfile"}>
          <Button className="mr-2">
            <HiEye className="mr-auto" />
          </Button>
        </NavLink>
      </React.Fragment>
      
    </Form.Root>
    </div>
  );
}

export default Profile;
