import React, { useEffect, useState, useRef } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { ProductService } from './service/ProductService';
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import Employee from "../../models/Employee";
import useApiJson from "../../hooks/useApiJson";
import { HiCheck, HiPencil, HiTrash, HiX } from "react-icons/hi";

import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

function AllEmployeeDatatable() {
  const apiJson = useApiJson();

  let emptyEmployee: Employee = {
    employeeId: -1,
    employeeName: "",
    employeeEmail: "",
    employeeAddress: "",
    employeePhoneNumber: "",
    employeeEducation: "",
    hasAdminPrivileges: false,
    employeePasswordHash: "",
    employeeSalt: "",
    employeeDoorAccessCode: ""
  };

  const [employeeList, setEmployeeList] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee>(emptyEmployee);
  const [deleteEmployeeDialog, setDeleteEmployeeDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Employee[]>>(null);

  useEffect(() => {
    apiJson.get("http://localhost:3000/api/employee/getallemployee");
  }, []);

  useEffect(() => {
    const employeeData = apiJson.result as Employee[];
    setEmployeeList(employeeData);
  }, [apiJson.loading]);

  //
  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const rightToolbarTemplate = () => {
    return <Button onClick={exportCSV}>Export to .csv</Button>;
  };

  // const imageBodyTemplate = (rowData: Employee) => {
  //   return (
  //     <img
  //       src={rowData.employeeImageUrl}
  //       alt={rowData.employeeName}
  //       className="border-round shadow-2"
  //       style={{ width: "64px" }}
  //     />
  //   );
  // };

  const navigateEditProduct = (employee: Employee) => {};

  const confirmDeleteEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDeleteEmployeeDialog(true);
  };

  const hideDeleteEmployeeDialog = () => {
    setDeleteEmployeeDialog(false);
  };

  // delete employee stuff
  const deleteEmployee = () => {
    let _employee = employeeList.filter(
      (val) => val.employeeId !== selectedEmployee?.employeeId
    );

    setEmployeeList(_employee);
    setDeleteEmployeeDialog(false);
    setSelectedEmployee(emptyEmployee);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "Employee Deleted",
      life: 3000,
    });
  };

  const deleteEmployeeDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeleteEmployeeDialog}>
        <HiX />
        No
      </Button>
      <Button variant={"destructive"} onClick={deleteEmployee}>
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>
  );
  // end delete employee stuff

  const actionBodyTemplate = (employee: Employee) => {
    return (
      <React.Fragment>
        <NavLink to={`/employee/editemployee/${employee.employeeName + " " + employee.employeeAddress}`}>
          <Button className="mr-2">
            <HiPencil />
            <span>Edit</span>
          </Button>
        </NavLink>
        <Button
          variant={"destructive"}
          className="mr-2"
          onClick={() => confirmDeleteEmployee(employee)}
        >
          <HiTrash />
          <span>Delete</span>
        </Button>
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Manage Employee</h4>
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

  return (
    <div>
      <div>
        <Toast ref={toast} />
        <div className="rounded-lg bg-white p-4">
          <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

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
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} employee"
            globalFilter={globalFilter}
            header={header}
          >
            <Column
              field="employeeName"
              header="Employee Name"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
           
            <Column
              field="employeeEmail"
              header="Employee Email"
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
              header="Employee Phone Number"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="education"
              header="Education"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="hasAdminPrivileges"
              header="Admin?"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            {/* <Column
              field="employeeImageUrl"
              header="Image"
              body={imageBodyTemplate}
            ></Column> */}
            <Column
              body={actionBodyTemplate}
              header="Actions"
              exportable={false}
              style={{ minWidth: "18rem" }}
            ></Column>
          </DataTable>
        </div>
      </div>
      <Dialog
        visible={deleteEmployeeDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteEmployeeDialogFooter}
        onHide={hideDeleteEmployeeDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedEmployee && (
            <span>
              Are you sure you want to delete{" "}
              <b>{selectedEmployee.employeeName}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default AllEmployeeDatatable;
