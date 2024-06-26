import { Toast } from "primereact/toast";
import React, { useEffect, useState, useRef, forwardRef } from "react";
import { DataTable } from "primereact/datatable";
import useApiJson from "../../../../../hooks/useApiJson";
import Employee from "../../../../../models/Employee";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import { NavLink, useNavigate } from "react-router-dom";
import {
  HiCheck,
  HiClipboard,
  HiEye,
  HiMinus,
  HiPencil,
  HiPlus,
  HiTrash,
  HiX,
} from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog } from "primereact/dialog";
import GeneralStaff from "../../../../../models/GeneralStaff";
import { Toolbar } from "primereact/toolbar";
import { Separator } from "@/components/ui/separator";
import Sensor from "../../../../../models/Sensor";

interface AddSensorMaintenanceStaffProps {
  sensorId: number;
}

function AddSensorMaintenanceStaff(props: AddSensorMaintenanceStaffProps) {
  const apiJson = useApiJson();

  const { sensorId } = props;

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
  };

  const toast = useRef<Toast>(null);

  const [selectedEmployee, setSelectedEmployee] = useState<Employee>(employee);
  const dt = useRef<DataTable<Employee[]>>(null);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [employeeAssignmentDialog, setAssignmentDialog] =
    useState<boolean>(false);
  const [employeeRemovalDialog, setEmployeeRemovalDialog] =
    useState<boolean>(false);
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();

  const [employeeList, setEmployeeList] = useState<Employee[]>([]);
  const [refreshSeed, setRefreshSeed] = useState<any>(0);

  useEffect(() => {
    apiJson
      .post("http://localhost:3000/api/employee/getAllGeneralStaffs", {
        includes: [
          "maintainedFacilities",
          "operatedFacility",
          "sensors",
          "employee",
        ],
      })
      .catch((e) => console.log(e))
      .then((res) => {
        const allStaffs: Employee[] = [];
        for (const staff of res["generalStaffs"]) {
          if (staff.generalStaffType == "ZOO_MAINTENANCE") {
            let emp = staff.employee;
            staff.employee = undefined;
            emp["generalStaff"] = staff;
            emp.currentlyAssigned = (emp.generalStaff.sensors as Sensor[]).find(
              (sensor) => Number(sensor.sensorId) == sensorId
            );
            allStaffs.push(emp);
          }
        }
        setEmployeeList(allStaffs);
      });
  }, [refreshSeed]);

  const hideEmployeeAssignmentDialog = () => {
    setAssignmentDialog(false);
  };

  const hideEmployeeRemovalDialog = () => {
    setEmployeeRemovalDialog(false);
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const assignEmployee = async () => {
    const selectedEmployeeName = selectedEmployee.employeeName;

    try {
      const responseJson = await apiJson
        .put(
          `http://localhost:3000/api/assetFacility/assignMaintenanceStaffToSensor/${sensorId}`,
          { employeeId: selectedEmployee.employeeId }
        )
        .then((res) => {
          setRefreshSeed([]);
        })
        .catch((err) => console.log("err", err));

      toastShadcn({
        // variant: "destructive",
        title: "Assignment Successful",
        description:
          "Successfully assigned general staff: " + selectedEmployeeName,
      });
      setSelectedEmployee(employee);
      setAssignmentDialog(false);
      // window.location.reload();
    } catch (error: any) {
      // got error
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while assigning general staff: \n" +
          apiJson.error,
      });
    }
  };

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

  const removeGeneralStaff = async () => {
    const selectedEmployeeName = selectedEmployee.employeeName;

    try {
      const responseJson = await apiJson.put(
        `http://localhost:3000/api/assetFacility/removeMaintenanceStaffFromSensor/${sensorId}`,
        { employeeId: selectedEmployee.employeeId }
      );

      setRefreshSeed([]);
      toastShadcn({
        // variant: "destructive",
        title: "Removal Successful",
        description:
          "Successfully removed general staff: " + selectedEmployeeName,
      });
      setSelectedEmployee(employee);
      setEmployeeRemovalDialog(false);
      // window.location.reload();
    } catch (error: any) {
      // got error
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while removing general staff: \n" +
          apiJson.error,
      });
    }
  };

  const employeeRemovalDialogFooter = (
    <React.Fragment>
      <Button onClick={hideEmployeeRemovalDialog}>
        <HiX />
        No
      </Button>
      <Button variant={"destructive"} onClick={removeGeneralStaff}>
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
      <Button onClick={exportCSV}>Export to .csv</Button>
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

  const actionBodyTemplate = (employee: any) => {
    return (
      <React.Fragment>
        <div className="mb-4 flex">
          <Button
            variant={"outline"}
            className="mr-2"
            onClick={() => {
              navigate(
                `/assetfacility/viewsensordetails/${sensorId}/generalStaff`,
                { replace: true }
              );
              navigate(
                `/employeeAccount/viewEmployeeDetails/${employee.employeeId}`
              );
            }}
          >
            <HiEye className="mx-auto" />
          </Button>
          {employee.dateOfResignation ? (
            <span>Removed</span>
          ) : (
            <div>
              <Button
                name="assignButton"
                variant={"default"}
                className="mr-2"
                disabled={employee.currentlyAssigned}
                onClick={() => confirmAssignment(employee)}
              >
                <HiPlus className="mx-auto" />
              </Button>
              <Button
                name="removeButton"
                variant={"destructive"}
                className="mx-auto"
                disabled={!employee.currentlyAssigned}
                onClick={() => confirmEmployeeRemoval(employee)}
              >
                <HiMinus className="mx-auto" />
              </Button>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  };

  return (
    <div>
      <div>
        <Toast ref={toast} />
        <div className="">
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
            scrollable
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
              frozen
              alignFrozen="right"
              exportable={false}
              style={{ minWidth: "12rem" }}
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

export default AddSensorMaintenanceStaff;
