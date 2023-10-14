import { Toast } from "primereact/toast";
import React, { useEffect, useState, useRef, forwardRef } from "react";
import { DataTable } from "primereact/datatable";
import useApiJson from "../../../../../hooks/useApiJson";
import Employee from "../../../../../models/Employee";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import { useNavigate } from "react-router-dom";
import { HiCheck, HiClipboard, HiEye, HiMinus, HiPencil, HiPlus, HiTrash, HiX } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog } from "primereact/dialog";
import GeneralStaff from "../../../../../models/GeneralStaff";
import { Toolbar } from "primereact/toolbar";
import { Separator } from "@/components/ui/separator";
import Facility from "../../../../../models/Facility";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";

interface ViewAllFacilityMaintenanceStaffProps {
  facilityId: number;
}

function ViewAllFacilityMaintenanceStaff(props: ViewAllFacilityMaintenanceStaffProps) {
  const apiJson = useApiJson();

  const { facilityId } = props;

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
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const dt = useRef<DataTable<Employee[]>>(null);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [employeeAssignmentDialog, setAssignmentDialog] = useState<boolean>(false);
  const [employeeRemovalDialog, setEmployeeRemovalDialog] = useState<boolean>(false);
  const [employeeBulkAssignmentDialog, setBulkAssignmentDialog] = useState<boolean>(false);
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();

  const [assignedEmployees, setAssignedEmployees] = useState<Employee[]>([]);
  const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([]);
  const [refreshSeed, setRefreshSeed] = useState<any>(0);

  useEffect(() => {
    apiJson.post(
      "http://localhost:3000/api/employee/getAllGeneralStaffs", { includes: ["maintainedFacilities", "operatedFacility", "sensors", "employee"] }
    ).catch(e => console.log(e)).then(res => {
      const assignedStaff: Employee[] = []
      const availableStaff: Employee[] = []
      for (const staff of res["generalStaffs"]) {
        // console.log(staff);
        if (staff.generalStaffType == "ZOO_MAINTENANCE") {
          let emp = staff.employee;
          staff.employee = undefined;
          emp["generalStaff"] = staff
          const maintainedFacility: Facility = emp.generalStaff.maintainedFacilities.find((facility: Facility) => facility.facilityId == facilityId);
          console.log(maintainedFacility);
          if (maintainedFacility !== undefined) {
            emp.currentlyAssigned = true;
            assignedStaff.push(emp);
          }
          else {
            emp.currentlyAssigned = false;
            availableStaff.push(emp);
          }
        }
      }
      setAssignedEmployees(assignedStaff);
      setAvailableEmployees(availableStaff);
    });
  }, [refreshSeed]);

  const assignEmployee = async () => {
    const selectedEmployeeName = selectedEmployee.employeeName;

    try {
      const responseJson = await apiJson.put(
        `http://localhost:3000/api/assetFacility/assignMaintenanceStaffToFacility/${facilityId}`, { employeeIds: [selectedEmployee.employeeId] }).then(res => {
          setRefreshSeed([]);
        }).catch(err => console.log("err", err));

      toastShadcn({
        // variant: "destructive",
        title: "Assignment Successful",
        description:
          "Successfully assigned maintenance staff: " + selectedEmployeeName,
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
          "An error has occurred while assigning maintenance staff: \n" + apiJson.error,
      });
    }

  }

  const removeMaintenanceStaff = async () => {
    const selectedEmployeeName = selectedEmployee.employeeName;

    try {
      const responseJson = await apiJson.del(
        `http://localhost:3000/api/assetFacility/removeMaintenanceStaffFromFacility/${facilityId}`, { employeeIds: [selectedEmployee.employeeId,] });
      setRefreshSeed([]);
      toastShadcn({
        // variant: "destructive",
        title: "Removal Successful",
        description:
          "Successfully removed maintenance staff: " + selectedEmployeeName,
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
          "An error has occurred while removing maintenance staff: \n" + apiJson.error,
      });
    }

  }

  const showBulkAssignment = () => {
    setSelectedEmployees([]);
    setBulkAssignmentDialog(true);
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

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
      <Button onClick={showBulkAssignment}><HiPlus />Assign Maintenance Staff</Button>
      <Button onClick={exportCSV}>Export to .csv</Button>
    </div>
  );

  const confirmAssignment = () => {
    setAssignmentDialog(true);
  };

  const confirmEmployeeRemoval = () => {
    if (selectedEmployees.length != 0) {
      setEmployeeRemovalDialog(true);
    }
  };


  const actionBodyTemplate = (employee: any) => {
    return (
      <React.Fragment>
        <div className="mb-4 flex">
          <Button
            variant={"outline"}
            className="mr-2" onClick={() => {
              navigate(`/assetfacility/viewfacilitydetails/${facilityId}/manageMaintenance`, { replace: true });
              navigate(`/employeeAccount/viewEmployeeDetails/${employee.employeeId}`);
            }}>
            <HiEye className="mx-auto" />
          </Button>
          {employee.dateOfResignation ?
            <span>Removed</span>
            : <div>
              {/* <Button
                name="assignButton"
                variant={"default"}
                disabled={employee.currentlyAssigned}
                className="mr-2"
                onClick={() => confirmAssignment(employee)}
              >
                <HiPlus className="mx-auto" />
              </Button> */}
              {/* <Button
                variant={"destructive"}
                className="mr-2"
                disabled={!employee.currentlyAssigned}
                onClick={() => confirmEmployeeRemoval(employee)}
              >
                <HiMinus className="mx-auto" />
              </Button> */}
            </div>

          }
        </div>
      </React.Fragment>
    );
  };

  const bulkAssignmentHeader = (
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

  const hideEmployeeBulkAssignmentDialog = () => {
    setBulkAssignmentDialog(false);
  }

  const onSelectedEmployeesChange = (e: CheckboxChangeEvent) => {
    let _selectedEmployees = [...selectedEmployees];
    if (e.checked) {
      _selectedEmployees.push(e.value);
    }
    else {
      _selectedEmployees.splice(_selectedEmployees.indexOf(e.value), 1);
    }
    setSelectedEmployees(_selectedEmployees);
  }

  const checkboxTemplate = (employee: any) => {
    return (
      <React.Fragment>
        <div className="mb-4 flex">
          <Checkbox
            name="toAssign"
            value={employee.employeeId}
            onChange={onSelectedEmployeesChange}
            checked={selectedEmployees.includes(employee.employeeId)}>
          </Checkbox>
        </div>
      </React.Fragment>
    );
  };

  const hideEmployeeAssignmentDialog = () => {
    setAssignmentDialog(false);
  }

  const bulkAssignEmployees = async () => {
    selectedEmployees.forEach(async (employeeId) => {
      try {
        const responseJson = await apiJson.put(
          `http://localhost:3000/api/assetFacility/assignMaintenanceStaffToFacility/${facilityId}`, { employeeIds: [employeeId] }).then(res => {
            setRefreshSeed([]);
          }).catch(err => console.log("err", err));

        toastShadcn({
          // variant: "destructive",
          title: "Assignment Successful",
          description:
            "Successfully assigned maintenance staff with IDs: " + selectedEmployees,
        });
        setAssignmentDialog(false);
        setBulkAssignmentDialog(false);
        setSelectedEmployees([]);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while assigning maintenance staff: \n" + apiJson.error,
        });
      }
    });
  }

  const employeeAssignmentDialogFooter = (
    <React.Fragment>
      <Button variant={"destructive"} onClick={hideEmployeeAssignmentDialog}>
        <HiX />
        No
      </Button>
      <Button onClick={bulkAssignEmployees}>
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>
  );

  const bulkRemoveMaintenanceStaff = async () => {
    selectedEmployees.forEach(async (employeeId) => {
      try {
        const responseJson = await apiJson.del(
          `http://localhost:3000/api/assetFacility/removeMaintenanceStaffFromFacility/${facilityId}`, { employeeIds: [employeeId] }).then(res => {
            setRefreshSeed([]);
          }).catch(err => console.log("err", err));

        toastShadcn({
          // variant: "destructive",
          title: "Removal Successful",
          description:
            "Successfully removed maintenance staff: " + selectedEmployees.toString(),
        });
        setEmployeeRemovalDialog(false);
        setBulkAssignmentDialog(false);
        setSelectedEmployees([]);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while removing maintenance staff: \n" + apiJson.error,
        });
      }
    });
  }

  const hideEmployeeRemovalDialog = () => {
    setEmployeeRemovalDialog(false);
  }

  const employeeRemovalDialogFooter = (
    <React.Fragment>
      <Button onClick={hideEmployeeRemovalDialog}>
        <HiX />
        No
      </Button>
      <Button variant={"destructive"} onClick={bulkRemoveMaintenanceStaff}>
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>
  );


  return (
    <div>
      <div>
        <Toast ref={toast} />
        <div className="">

          {/* <Button
            variant={"outline"}
            className="mr-2" onClick={()=>{ 
              navigate(`/assetfacility/viewfacilitydetails/${facilityId}/manageMaintenance`, { replace: true });
              navigate(`/employeeAccount/viewEmployeeDetails/${employee.employeeId}`);
            }}>
            <HiPlus className="mx-auto" />
              Add Maintenance staff
          </Button> */}

          <DataTable
            ref={dt}
            value={assignedEmployees}
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
              body={checkboxTemplate}
            ></Column>
            <Column
              field="employeeId"
              header="ID"
              sortable
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
            ></Column>
          </DataTable>
          <Button variant={"destructive"} onClick={confirmEmployeeRemoval}><HiMinus />Remove Selected Staff</Button>
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
                <b>{selectedEmployees.toString()}?</b>
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
                <b>{selectedEmployees.toString()}</b>?
              </span>
            )}
          </div>
        </Dialog>
        <Dialog
          visible={employeeBulkAssignmentDialog}
          style={{ width: "50rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Assign Maintenance Staff"
          position={"right"}
          footer={<Button onClick={confirmAssignment}>Assign Selected Staff</Button>}
          onHide={hideEmployeeBulkAssignmentDialog}
        >
          <div className="confirmation-content">
            <DataTable
              ref={dt}
              value={availableEmployees}
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
              header={bulkAssignmentHeader}
            >
              <Column
                body={checkboxTemplate}
              ></Column>
              <Column
                field="employeeId"
                header="ID"
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
            </DataTable>
          </div>
        </Dialog >
      </div >
    </div >
  );
}

export default ViewAllFacilityMaintenanceStaff;
