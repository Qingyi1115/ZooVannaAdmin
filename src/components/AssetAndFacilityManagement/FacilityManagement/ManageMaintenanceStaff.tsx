import { Toast } from "primereact/toast";
import React, { useEffect, useState, useRef, forwardRef } from "react";
import { DataTable } from "primereact/datatable";
import useApiJson from "../../../hooks/useApiJson";
import Employee from "../../../models/Employee";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import { NavLink, useNavigate } from "react-router-dom";
import { HiCheck, HiClipboard, HiEye, HiPencil, HiTrash, HiX } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog } from "primereact/dialog";
import GeneralStaff from "../../../models/GeneralStaff";
import { Toolbar } from "primereact/toolbar";
import { Separator } from "@/components/ui/separator";

interface ManageMaintenanceStaffProps {
  facilityId: number;
  employeeList: Employee[];
}

function manageMaintenanceStaff(props: ManageMaintenanceStaffProps) {
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
  const [employeeAssignmentDialog, setAssignmentDialog] = useState<boolean>(false);
  const [employeeRemovalDialog, setEmployeeRemovalDialog] = useState<boolean>(false);
  const [assigned, setAssigned] = useState<boolean>(false);
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();

  const hideEmployeeAssignmentDialog = () => {
    setAssignmentDialog(false);
  }

  const hideEmployeeRemovalDialog = () => {
    setEmployeeRemovalDialog(false);
  }

  const exportCSV = () => {
    dt.current?.exportCSV();
  };


  const rightToolbarTemplate = () => {
    return <Button onClick={exportCSV}>Export to .csv</Button>;
  };

  const assignEmployee = async () => {
    const selectedEmployeeName = selectedEmployee.employeeName;

    try {
      const responseJson = await apiJson.put(
        `http://localhost:3000/api/assetFacility/assignMaintenanceStaffToFacility/${facilityId}`, { employeeIds: [selectedEmployee.employeeId,] });

      toastShadcn({
        // variant: "destructive",
        title: "Assignment Successful",
        description:
          "Successfully assigned maintenance staff: " + selectedEmployeeName,
      });
      setSelectedEmployee(employee);
      setAssignmentDialog(false);
      // window.location.reload();
      setAssigned(true);
    } catch (error: any) {
      // got error
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while assigning maintenance staff: \n" + apiJson.error,
      });
    }

  }

  const employeeAssignmentDialogFooter = (
    <React.Fragment>
      <Button variant={"destructive"} onClick={hideEmployeeAssignmentDialog}>
        <HiX />
        No
      </Button>
      <Button onClick={assignEmployee}>
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>
  );

  const removeMaintenanceStaff = async () => {
    const selectedEmployeeName = selectedEmployee.employeeName;

    try {
      const responseJson = await apiJson.put(
        `http://localhost:3000/api/assetFacility/removeMaintenanceStaffFromFacility/${facilityId}`, { employeeIds: [selectedEmployee.employeeId,] });

      toastShadcn({
        // variant: "destructive",
        title: "Removal Successful",
        description:
          "Successfully removed maintenance staff: " + selectedEmployeeName,
      });
      setSelectedEmployee(employee);
      setEmployeeRemovalDialog(false);
      setAssigned(false);
      // window.location.reload();
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

  const employeeRemovalDialogFooter = (
    <React.Fragment>
      <Button onClick={hideEmployeeRemovalDialog}>
        <HiX />
        No
      </Button>
      <Button variant={"destructive"} onClick={removeMaintenanceStaff}>
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>
  );

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Manage Maintenance Staff</h4>
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

  const confirmAssignment = (employee: Employee) => {
    setSelectedEmployee(employee);
    setAssignmentDialog(true);
  };

  const confirmEmployeeRemoval = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEmployeeRemovalDialog(true);
  };

  const actionBodyTemplate = (employee: Employee) => {
    console.log(employee.dateOfResignation);
    return (
      <React.Fragment>
        <div className="mb-4 flex">
          <NavLink to={`/employeeAccount/viewEmployeeDetails/${employee.employeeId}`}>
            <Button
              variant={"outline"}
              className="mb-1 mr-1">
              <HiEye className="mr-1" />

            </Button>
          </NavLink>
          {employee.dateOfResignation ?
            <span>Removed</span>
            : <div>
              <Button
                disabled={assigned}
                name="assignButton"
                variant={"default"}
                className="mr-2"
                onClick={() => confirmAssignment(employee)}
              >
                <HiClipboard className="mr-1" />

              </Button>
              <Button
                disabled={!assigned}
                name="removeButton"
                variant={"destructive"}
                className="mr-2"
                onClick={() => confirmEmployeeRemoval(employee)}
              >
                <HiTrash className="mr-1" />

              </Button>
            </div>

          }
        </div>
      </React.Fragment>
    );
  };

  return (
    <div>
      <div>
        <Toast ref={toast} />
        <div className="rounded-lg bg-white p-4">
          {/* Title Header and back button */}
          <div className="flex flex-col">
            <div className="mb-4 flex justify-between">
              <Button disabled className="invisible">
                Back
              </Button>
              <span className=" self-center text-title-xl font-bold">
                Manage Maintenance Staff
              </span>
              <Button onClick={exportCSV}>Export to .csv</Button>
            </div>
            <Separator />
          </div>

          {/* <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar> */}
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
              field="employeeId"
              header="ID"
              sortable
              style={{ minWidth: "4rem" }}
            ></Column>
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
              body={actionBodyTemplate}
              header="Actions"
              exportable={false}
              style={{ minWidth: "18rem" }}
            ></Column>
          </DataTable>
        </div>
        <Dialog
          visible={employeeAssignmentDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Confirm"
          modal
          footer={employeeAssignmentDialogFooter}
          onHide={hideEmployeeAssignmentDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            {selectedEmployee && (
              <span>
                Are you sure you want to assign this facility to{" "}
                <b>{selectedEmployee.employeeName}?</b>
              </span>
            )}
          </div>
        </Dialog>
        <Dialog
          visible={employeeRemovalDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Confirm"
          modal
          footer={employeeRemovalDialogFooter}
          onHide={hideEmployeeRemovalDialog}
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

export default manageMaintenanceStaff;
