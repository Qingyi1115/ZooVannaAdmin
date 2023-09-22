import { Toast } from "primereact/toast";
import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import useApiJson from "../../../hooks/useApiJson";
import Employee from "../../../models/Employee";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import { NavLink } from "react-router-dom";
import { HiCheck, HiEye, HiPencil, HiTrash, HiX } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog } from "primereact/dialog";
import GeneralStaff from "../../../models/GeneralStaff";

{
  /*const toast = useRef<Toast>(null);*/
}
interface RemoveMaintenanceStaffProps {
    facilityId: number;
    employeeList: Employee[];
}

function RemoveMaintenanceStaff(props: RemoveMaintenanceStaffProps) {
  const apiJson = useApiJson();

  const { facilityId, employeeList } = props;

  let employee: Employee = {
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

  const toast = useRef<Toast>(null);

  const [selectedEmployee, setSelectedEmployee] = useState<Employee>(employee);
  const dt = useRef<DataTable<Employee[]>>(null);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [employeeResignationDialog, setEmployeeResignationDialog] = useState<boolean>(false);
  const toastShadcn = useToast().toast;

  const hideEmployeeResignationDialog = () => {
    setEmployeeResignationDialog(false);
  }

  const resignEmployee = async () => { 
    const selectedEmployeeName = selectedEmployee.employeeName;

    try {
      const responseJson = await apiJson.put(
        `http://localhost:3000/api/assetFacility/removeMaintenanceStaffFromFacility/${facilityId}`, {employeeIds:[selectedEmployee.employeeId,]});

      toastShadcn({
        // variant: "destructive",
        title: "Deletion Successful",
        description:
          "Successfully disabled employee: " + selectedEmployeeName,
      });
      setSelectedEmployee(employee);
      setEmployeeResignationDialog(false);
      window.location.reload();
    } catch (error: any) {
      // got error
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while removing maintenance staff: \n" + apiJson.error,
      });
    }

  }

  const employeeResignationDialogFooter = (
    <React.Fragment>
      <Button onClick={hideEmployeeResignationDialog}>
        <HiX />
        No
      </Button>
      <Button variant={"destructive"} onClick={resignEmployee}>
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>
  );

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

  const confirmEmployeeResignation = (employee:Employee) => {
    setSelectedEmployee(employee);
    setEmployeeResignationDialog(true);
  };

  const actionBodyTemplate = (employee: Employee) => {
    console.log(employee.dateOfResignation);
    return (
      <React.Fragment>
        <NavLink to={`/employeeAccount/viewEmployeeDetails/${employee.employeeId}`}>
          <Button className="mb-1 mr-1">
            <HiEye className="mr-1" />
            <span>View Details</span>
          </Button>
        </NavLink>
        {employee.dateOfResignation ?
        <span>Removed</span>
        :
        <Button
        variant={"destructive"}
        className="mr-2"
        onClick={() => confirmEmployeeResignation(employee)}
        >
          <HiTrash className="mr-1" />
          <span>Remove</span>
        </Button>
        } 
      </React.Fragment>
    );
  };

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
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} employees"
            globalFilter={globalFilter}
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
            <Column
                        body={actionBodyTemplate}
                        header="Actions"
                        exportable={false}
                        style={{ minWidth: "18rem" }}
                    ></Column>
          </DataTable>
        </div>
        <Dialog
          visible={employeeResignationDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Confirm"
          modal
          footer={employeeResignationDialogFooter}
          onHide={hideEmployeeResignationDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            {selectedEmployee && (
              <span>
                Are you sure you want to remove{" "}
                <b>{selectedEmployee.employeeName}</b>?
              </span>
            )}
          </div>
        </Dialog>
      </div>
    </div>
  );
}

export default RemoveMaintenanceStaff;
