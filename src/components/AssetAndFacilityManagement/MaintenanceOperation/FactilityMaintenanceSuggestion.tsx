import React, { useEffect, useState, useRef } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { ProductService } from './service/ProductService';
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import Sensor from "../../../models/Sensor";
import useApiJson from "../../../hooks/useApiJson";
import { HiCheck, HiEye, HiOutlinePresentationChartLine, HiPencil, HiPlus, HiTrash, HiX } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { SensorType } from "../../../enums/SensorType";
import { Separator } from "@/components/ui/separator";
import { Tag } from "primereact/tag";
import Employee from "../../../models/Employee";
import Facility from "../../../models/Facility";
import { Checkbox, CheckboxChangeEvent, CheckboxClickEvent } from "primereact/checkbox";
import ViewAllFacilityMaintenanceStaff from "../FacilityManagement/viewFacilityDetails/MaintenanceStaff/ViewAllFacilityMaintenanceStaff";
import { useToast } from "@/components/ui/use-toast";

export function compareDates(d1: Date, d2: Date): number {
  let date1 = d1.getTime();
  let date2 = d2.getTime();
  return date1 - date2;
};

interface MaintenanceDetails {
  name: string,
  description: string,
  lastMaintenance: string,
  suggestedMaintenance: string,
  type: string,
  id: number
}

function rowColor(facility: any) {
  return facility.predictedMaintenanceDate && (compareDates(new Date(facility.predictedMaintenanceDate), new Date()) <= 0) ? "text-red-700" : "text-red-700";
}

function FacilityMaintenanceSuggestion() {
  const apiJson = useApiJson();

  const [objectsList, setObjectsList] = useState<MaintenanceDetails[]>([]);
  const [facilityList, setFacilityList] = useState<any[]>([]);
  const [selectedObject, setSelectedObject] = useState<MaintenanceDetails>({ name: "", description: "", lastMaintenance: "", suggestedMaintenance: "", type: "", id: -1 });
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<MaintenanceDetails[]>>(null);
  const dt2 = useRef<DataTable<Employee[]>>(null);
  const toastShadcn = useToast().toast;

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

  const [selectedEmployee, setSelectedEmployee] = useState<Employee>(emptyEmployee);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [selectedMaintenanceDetails, setSelectedMaintenanceDetails] = useState<number[]>([]);
  const [employeeAssignmentDialog, setAssignmentDialog] = useState<boolean>(false);
  const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([]);
  const [employeeBulkAssignmentDialog, setBulkAssignmentDialog] = useState<boolean>(false);
  const [refreshSeed, setRefreshSeed] = useState<any>(0);

  useEffect(() => {
    apiJson.get(
      "http://localhost:3000/api/assetFacility/getFacilityMaintenanceSuggestions"
    ).catch(error => {
      console.log(error);
    }).then(responseJson => {
      setFacilityList(responseJson["facilities"].sort((a: any, b: any) => {
        if (!a.predictedMaintenanceDate) return 1;
        if (!b.predictedMaintenanceDate) return -1;
        return compareDates(new Date(a.predictedMaintenanceDate), new Date(b.predictedMaintenanceDate));
      }));
    });
  }, []);

  useEffect(() => {
    let obj: any = []
    facilityList.forEach((facility: any) => {
      obj.push({
        name: facility.facilityName,
        description: (facility.isSheltered ? "Sheltered " : "Unsheltered ") + (facility.facilityDetail as string).toLocaleLowerCase(),
        lastMaintenance: new Date(facility.facilityDetailJson["lastMaintained"]).toLocaleString(),
        suggestedMaintenance: facility.predictedMaintenanceDate ?
          new Date(facility.predictedMaintenanceDate).toString() : "No suggested date",
        type: "Facility",
        id: facility.facilityId,
      })
    })
    setObjectsList(obj)
  }, [facilityList]);

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const actionBodyTemplate = (objDetails: MaintenanceDetails) => {
    return (
      <React.Fragment>
        <NavLink to={`/assetfacility/viewfacilitydetails/${objDetails.id}`}
          state={{ prev: `/assetfacility/maintenance/facilityMaintenance` }}>
          <Button variant="outline" className="mb-1 mr-1">
            <HiEye className="mx-auto" />
          </Button>
        </NavLink>
        <NavLink to={`/assetfacility/viewFacilityMaintenanceChart/${objDetails.id}`}
          state={{ prev: `/assetfacility/maintenance/facilityMaintenance` }}>
          <Button className="mb-1 mr-1">
            <HiOutlinePresentationChartLine className="mx-auto" />
          </Button>
        </NavLink>
        {/* <Button
          variant={"destructive"}
          className="mr-2"
          onClick={() => confirmDeleteSpecies(species)}
        >
          <HiTrash className="mx-auto" />
          <span>Delete</span>
        </Button> */}
      </React.Fragment>
    );
  };

  const statusBodyTemplate = (rowData: any) => {
    return <Tag value={isNaN(Date.parse(rowData.suggestedMaintenance)) ? rowData.suggestedMaintenance : new Date(rowData.suggestedMaintenance).toLocaleString()}
      severity={isNaN(Date.parse(rowData.suggestedMaintenance)) ? "info" :
        (compareDates(new Date(rowData.suggestedMaintenance), new Date()) <= -1000 * 60 * 60 * 24 * 3) ? "danger"
          : (compareDates(new Date(rowData.suggestedMaintenance), new Date()) <= 0) ? "warning" : "success"} />;
  };

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
          emp["generalStaff"] = staff;
          availableStaff.push(emp);
          // const maintainedFacility: Facility = emp.generalStaff.maintainedFacilities.find((facility: Facility) => facility.facilityId == facilityId);
          // console.log(maintainedFacility);
          // if (maintainedFacility !== undefined) {
          //   emp.currentlyAssigned = true;
          //   assignedStaff.push(emp);
          // }
          // else {
          //   emp.currentlyAssigned = false;
          //   availableStaff.push(emp);
          // }
        }
      }
      // setAssignedEmployees(assignedStaff);
      setAvailableEmployees(availableStaff);
    });
  }, [refreshSeed]);

  const showBulkAssignment = () => {
    setSelectedEmployees([]);
    setBulkAssignmentDialog(true);
  };

  const confirmAssignment = () => {
    setAssignmentDialog(true);
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

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Manage Facility Maintenance</h4>
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
      <Button onClick={showBulkAssignment} disabled={selectedMaintenanceDetails.length == 0}><HiPlus />Assign Maintenance Staff</Button>
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

  const employeeCheckbox = (employee: any) => {
    return (
      <React.Fragment>
        <div className="mb-4 flex">
          <Checkbox
            name="toAssignEmployees"
            value={employee.employeeId}
            onChange={onSelectedEmployeesChange}
            checked={selectedEmployees.includes(employee.employeeId)}>
          </Checkbox>
        </div>
      </React.Fragment>
    );
  };

  const onAllEmployeesOnClick = (e: CheckboxClickEvent) => {
    console.log("b", e.originalEvent)
    if (e.checked) {
      setSelectedEmployees(availableEmployees.map((employee: Employee) => employee.employeeId));
    }
    else {
      setSelectedEmployees([]);
    }
    console.log(selectedEmployees);
  }

  const allEmployeesCheckbox = (employees: any) => {
    return (
      <React.Fragment>
        <div className="mb-4 flex">
          <Checkbox
            name="toAssignEmployees"
            onClick={onAllEmployeesOnClick}
            checked={selectedEmployees.length == availableEmployees.length}>
          </Checkbox>
        </div>
      </React.Fragment>
    );
  };
  const onSelectedMaintenanceDetailsOnClick = (e: CheckboxClickEvent) => {
    let _selectedMaintenanceDetails = [...selectedMaintenanceDetails];
    console.log("a ", e.originalEvent)
    if (e.checked) {
      _selectedMaintenanceDetails.push(e.value);
    }
    else {
      _selectedMaintenanceDetails.splice(_selectedMaintenanceDetails.indexOf(e.value), 1);
    }
    setSelectedMaintenanceDetails(_selectedMaintenanceDetails);
    console.log(selectedMaintenanceDetails);
  }

  const maintenanceDetailsCheckbox = (maintenanceDetails: any) => {
    return (
      <React.Fragment>
        <div className="mb-4 flex">
          <Checkbox
            name="toAssignMaintenanceDetails"
            value={maintenanceDetails.id}
            onClick={onSelectedMaintenanceDetailsOnClick}
            checked={selectedMaintenanceDetails.includes(maintenanceDetails.id)}>
          </Checkbox>
        </div>
      </React.Fragment>
    );
  };

  const onAllMaintenanceDetailsOnClick = (e: CheckboxClickEvent) => {
    console.log("b", e.originalEvent)
    if (e.checked) {
      setSelectedMaintenanceDetails(objectsList.map((maintenanceDetails: MaintenanceDetails) => maintenanceDetails.id));
    }
    else {
      setSelectedMaintenanceDetails([]);
    }
    console.log(selectedMaintenanceDetails);
  }

  const allMaintenanceDetailsCheckbox = (maintenanceDetails: any) => {
    return (
      <React.Fragment>
        <div className="mb-4 flex">
          <Checkbox
            name="toAssignMaintenanceDetails"
            onClick={onAllMaintenanceDetailsOnClick}
            checked={selectedMaintenanceDetails.length == objectsList.length}>
          </Checkbox>
        </div>
      </React.Fragment>
    );
  };

  const hideEmployeeAssignmentDialog = () => {
    setAssignmentDialog(false);
  }

  const bulkAssignEmployees = async () => {
    selectedMaintenanceDetails.forEach(async (facilityId) => {
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
              "Successfully assigned maintenance staff: " + selectedEmployees.toString() + " to facility: " + selectedMaintenanceDetails.toString(),
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
    });
  }

  const employeeAssignmentDialogFooter = (
    <React.Fragment>
      <Button variant={"destructive"} onClick={hideEmployeeAssignmentDialog}>
        <HiX />
        No
      </Button>
      <Button
        onClick={bulkAssignEmployees}
      >
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

          <DataTable
            ref={dt}
            value={objectsList}
            selection={selectedObject}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setSelectedObject(e.value);
              }
            }}
            rowClassName={rowColor}
            dataKey="id"
            paginator
            rows={10}
            scrollable
            selectionMode={"single"}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} facilities"
            globalFilter={globalFilter}
            header={header}
          >
            <Column
              body={maintenanceDetailsCheckbox}
              header={allMaintenanceDetailsCheckbox}
            ></Column>
            <Column
              field="id"
              header="ID"
            ></Column>
            <Column
              field="name"
              header="Name"
              sortable
              style={{ minWidth: "4rem" }}
            ></Column>
            <Column
              field="description"
              header="Description"
              sortable
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="lastMaintenance"
              header="Last Maintained"
              sortable
              style={{ minWidth: "13rem" }}
            ></Column>
            <Column
              field="suggestedMaintenance"
              header="Suggested Date of Maintenance"
              body={statusBodyTemplate}
              sortable
              style={{ minWidth: "13rem" }}
            ></Column>
            <Column
              body={actionBodyTemplate}
              header="Actions"
              frozen
              alignFrozen="right"
              exportable={false}
              style={{ minWidth: "9rem" }}
            ></Column>
          </DataTable>
          <Dialog
            visible={employeeBulkAssignmentDialog}
            style={{ width: "50rem" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            header="Assign Maintenance Staff"
            position={"right"}
            footer={<Button onClick={confirmAssignment} disabled={selectedEmployees.length == 0}>Assign Selected Staff</Button>}
            onHide={hideEmployeeBulkAssignmentDialog}>
            <div className="confirmation-content">
              <DataTable
                ref={dt2}
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
                  body={employeeCheckbox}
                  header={allEmployeesCheckbox}
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
          </Dialog>
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
                  Are you sure you want to assign employee {" "}
                  <b>{selectedEmployees.toString()}?</b> to facility {" "}
                  <b>{selectedMaintenanceDetails.toString()}?</b>
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>

    </div>
  );
}

export default FacilityMaintenanceSuggestion;
