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

{/*const toast = useRef<Toast>(null);*/}

function AllEmployeesDatatable() {
    const apiJson = useApiJson();

    let employee: Employee = {
        employeeId: -1,
        employeeName: "",
        employeeEmail: "",
        employeeAddress: "",
        employeePhoneNumber: "",
        employeePasswordHash: "",
        employeeSalt: "",
        employeeDoorAccessCode: "",
        employeeEducation: "",
        employeeDateOfResignation: new Date(),
        employeeBirthDate: new Date(),
        isAccountManager: false,
    };

    const toast = useRef<Toast>(null);
      
    const [employeeList, setEmployeeList] = useState<Employee[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee>(employee);
    const dt = useRef<DataTable<Employee[]>>(null);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const request = {
      "includes": "",
    }

    useEffect(() => {
      apiJson.get("http://localhost:3000/api/employee/getAllEmployees");
    }, []);

    useEffect(() => {
      const employeeData = apiJson.result as Employee[];
      setEmployeeList(employeeData);
      console.log("employee data in");
    }, [apiJson.loading]);

    const header = (
        <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="m-1">Manage Employees</h4>
            <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
                type="search"
                placeholder="Search..."
                onInput={(e) => {
                const target = e.target as HTMLInputElement;
                setGlobalFilter(target.value);
                }}
            />
            </span>
        </div>
    );

    {/*const actionBodyTemplate = (employee: Employee) => {
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
      };*/}

    return (
        <div>
            <div>
                <Toast ref={toast} />
                <div>
                    <DataTable
                        ref={dt}
                        value={employeeList}
                        selection={selectedEmployee}
                        onSelectionChange={(e) => {
                        if (Array.isArray(e.value)) {
                            setSelectedEmployee(e.value);
                        }
                        }}
                        dataKey="employeeId"
                        paginator
                        rows={10}
                        selectionMode={"single"}
                        rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} facility"
                        header={header}
                    >
                        <Column
                        field="employeeName"
                        header="Name"
                        sortable
                        style={{ minWidth: "12rem" }}
                        ></Column>
                        <Column
                        field="employeeEmail"
                        header="Email"
                        sortable
                        style={{ minWidth: "12rem" }}
                        ></Column>
                        <Column
                        field="employeeAddress"
                        header="Employee Address"
                        sortable
                        style={{ minWidth: "12rem" }}
                        ></Column>
                        <Column
                        field="employeePhoneNumber"
                        header="Phone Number"
                        sortable
                        style={{ minWidth: "12rem" }}
                        ></Column>
                        <Column
                        field="employeeEducation"
                        header="Education"
                        sortable
                        style={{ minWidth: "12rem" }}
                        ></Column>
                        <Column
                        field="employeeBirthDate"
                        header="Birthday"
                        sortable
                        style={{ minWidth: "12rem" }}
                        ></Column>
                        {/*<Column
                        body={actionBodyTemplate}
                        header="Actions"
                        exportable={false}
                        style={{ minWidth: "18rem" }}
                    ></Column>*/}
                    </DataTable>
                </div>
            </div>
        </div>
    )
}

export default AllEmployeesDatatable;