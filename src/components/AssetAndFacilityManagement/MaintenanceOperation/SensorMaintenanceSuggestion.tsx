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
import { NavLink, useNavigate } from "react-router-dom";
import { SensorType } from "../../../enums/SensorType";
import { Separator } from "@/components/ui/separator";
import { Tag } from "primereact/tag";
import ManageSensorMaintenanceStaff from "../AssetManagement/Sensor/GeneralStaff/ManageSensorMaintenanceStaff";
import Employee from "../../../models/Employee";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";

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

function SensorMaintenanceSuggestion() {
  const apiJson = useApiJson();
  const navigate = useNavigate();

  const [objectsList, setObjectsList] = useState<MaintenanceDetails[]>([]);
  const [sensorList, setSensorList] = useState<any[]>([]);
  const [facilityList, setFacilityList] = useState<any[]>([]);
  const [selectedObject, setSelectedObject] = useState<MaintenanceDetails>({ name: "", description: "", lastMaintenance: "", suggestedMaintenance: "", type: "", id: -1 });
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<MaintenanceDetails[]>>(null);
  const dt2 = useRef<DataTable<Employee[]>>(null);

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
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [employeeAssignmentDialog, setAssignmentDialog] = useState<boolean>(false);
  const [employeeRemovalDialog, setEmployeeRemovalDialog] = useState<boolean>(false);
  const [assignedEmployees, setAssignedEmployees] = useState<Employee[]>([]);
  const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([]);
  const [employeeBulkAssignmentDialog, setBulkAssignmentDialog] = useState<boolean>(false);
  const [refreshSeed, setRefreshSeed] = useState<any>(0);


  useEffect(() => {
    apiJson.get(
      "http://localhost:3000/api/assetFacility/getSensorMaintenanceSuggestions"
    ).catch(error => {
    }).then(responseJson => {
      let sortedList = responseJson["sensors"].sort((a: any, b: any) => {
        if (!a.predictedMaintenanceDate) return 1;
        if (!b.predictedMaintenanceDate) return -1;
        return compareDates(new Date(a.predictedMaintenanceDate), new Date(b.predictedMaintenanceDate))
      });
      setSensorList(sortedList);
    });
  }, []);

  useEffect(() => {
    let obj: any = []
    sensorList.forEach((sensor: any) => {
      obj.push({
        name: sensor.sensorName,
        description: "Sensor " + (sensor.sensorType as string).toLocaleLowerCase(),
        lastMaintenance: new Date(sensor.dateOfLastMaintained).toLocaleString(),
        suggestedMaintenance: sensor.predictedMaintenanceDate ?
          new Date(sensor.predictedMaintenanceDate).toString() : "No suggested date",
        type: "Sensor",
        id: sensor.sensorId
      })
    })
    setObjectsList(obj)
  }, [facilityList, sensorList]);

  const actionBodyTemplate = (objDetails: MaintenanceDetails) => {
    return (
      <React.Fragment>
        <Button variant="outline" className="mb-1 mr-1" onClick={() => {
          navigate(`/assetfacility/maintenance/sensorMaintenance`, { replace: true });
          navigate(`/assetfacility/viewsensordetails/${objDetails.id}`);
        }}>
          <HiEye className="mx-auto" />
        </Button>
        <Button className="mb-1 mr-1" onClick={() => {
          navigate(`/assetfacility/maintenance/sensorMaintenance`, { replace: true });
          navigate(`/assetfacility/viewSensorMaintenanceChart/${objDetails.id}`);
        }}>
          <HiOutlinePresentationChartLine className="mx-auto" />
        </Button>
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

  const exportCSV = () => {
    dt.current?.exportCSV();
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
      const assignedStaff: Employee[] = [];
      const availableStaff: Employee[] = [];
      for (const staff of res["generalStaffs"]) {
        if (staff.generalStaffType == "ZOO_MAINTENANCE") {
          let emp = staff.employee;
          staff.employee = undefined;
          emp["generalStaff"] = staff;
          availableStaff.push(emp);
          // emp.currentlyAssigned = (emp.generalStaff.sensors as Sensor[]).find(sensor => Number(sensor.sensorId) == sensorId);
          // if (emp.currentlyAssigned) {
          //   assignedStaff.push(emp);
          // }
          // else {
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

  const confirmEmployeeRemoval = () => {
    if (selectedEmployees.length != 0) {
      setEmployeeRemovalDialog(true);
    }
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
      <h4 className="m-1">Manage Sensor Maintenance</h4>
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

  const employeeAssignmentDialogFooter = (
    <React.Fragment>
      <Button variant={"destructive"} onClick={hideEmployeeAssignmentDialog}>
        <HiX />
        No
      </Button>
      <Button
      // onClick={bulkAssignEmployees}
      >
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>
  );

  const hideEmployeeRemovalDialog = () => {
    setEmployeeRemovalDialog(false);
  }

  const employeeRemovalDialogFooter = (
    <React.Fragment>
      <Button onClick={hideEmployeeRemovalDialog}>
        <HiX />
        No
      </Button>
      <Button variant={"destructive"}
      // onClick={bulkRemoveEmployees}
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
            dataKey="id"
            paginator
            rows={10}
            scrollable
            selectionMode={"single"}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} sensors"
            globalFilter={globalFilter}
            header={header}
          >
            <Column
              body={checkboxTemplate}
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
              sortable
              body={statusBodyTemplate}
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
        </div>
      </div>
      <Dialog
        visible={employeeBulkAssignmentDialog}
        style={{ width: "50rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Assign Maintenance Staff"
        position={"right"}
        footer={<Button onClick={confirmAssignment}>Assign Selected Staff</Button>}
        onHide={hideEmployeeBulkAssignmentDialog}>
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
            body={checkboxTemplate}
          ></Column>
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
        </DataTable>
      </Dialog>
    </div>
  );
}

export default SensorMaintenanceSuggestion;
