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
import { Checkbox, CheckboxChangeEvent, CheckboxClickEvent } from "primereact/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { BsWrenchAdjustable } from "react-icons/bs";

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
  const toastShadcn = useToast().toast;
  const employee = useAuthContext().state.user?.employeeData;

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

  const sensorActionBodyTemplate = (objDetails: MaintenanceDetails) => {
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
        {(employee.superAdmin || employee.generalStaff?.generalStaffType == "ZOO_MAINTENANCE") && (
          <Button className="mr-2" onClick={() => {
            navigate(`/assetfacility/maintenance/sensorMaintenance`, { replace: true });
            navigate(`/assetfacility/createsensormaintenancelog/${objDetails.id}`);
          }}>
            <BsWrenchAdjustable className="mx-auto" ></BsWrenchAdjustable>
          </Button>
        )}
      </React.Fragment>
    );
  };

  const employeeActionBodyTemplate = (employee: any) => {
    return (
      <React.Fragment>
        <div className="mb-4 flex">
          <Button
            variant={"outline"}
            className="mr-2" onClick={() => {
              navigate(`/assetfacility/maintenance/sensorMaintenance`, { replace: true });
              navigate(`/employeeAccount/viewEmployeeDetails/${employee.employeeId}`);
            }}>
            <HiEye className="mx-auto" />
          </Button>
          {employee.dateOfResignation ?
            <span>Removed</span>
            : <div>
              <Button
                name="assignButton"
                variant={"default"}
                className="mr-2"
                disabled={employee.currentlyAssigned}
                onClick={() => confirmAssignment(employee)}
              >
                <HiPlus className="mx-auto" />
              </Button>
            </div>
          }
        </div>
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

  const confirmAssignment = (employee: Employee) => {
    setSelectedEmployee(employee);
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
      <Button onClick={showBulkAssignment} disabled={selectedMaintenanceDetails.length == 0}><HiPlus />Assign Maintenance Staff</Button>
      <Button onClick={exportCSV}>Export to .csv</Button>
    </div>
  );


  const hideEmployeeBulkAssignmentDialog = () => {
    setBulkAssignmentDialog(false);
  }

  const onSelectedEmployeesOnClick = (e: CheckboxClickEvent) => {
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
            onChange={onSelectedEmployeesOnClick}
            checked={selectedEmployees.includes(employee.employeeId)}>
          </Checkbox>
        </div>
      </React.Fragment>
    );
  };

  const onAllEmployeesOnClick = (e: CheckboxClickEvent) => {

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

  const assignEmployee = async () => {
    selectedMaintenanceDetails.forEach(async (sensorId) => {
      try {
        const responseJson = await apiJson.put(
          `http://localhost:3000/api/assetFacility/assignMaintenanceStaffToSensor/${sensorId}`, { employeeId: selectedEmployee.employeeId }).then(res => {
            setRefreshSeed([]);
          }).catch(err => console.log("err", err));

        toastShadcn({
          // variant: "destructive",
          title: "Assignment Successful",
          description:
            "Successfully assigned " + selectedEmployee.employeeName + " to " + sensorList.filter(sensor => selectedMaintenanceDetails.includes(sensor.sensorId)).map((sensor) => " " + sensor.sensorName).toString(),
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
      <Button
        onClick={assignEmployee}
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
              sortable
              body={statusBodyTemplate}
              style={{ minWidth: "13rem" }}
            ></Column>
            <Column
              body={sensorActionBodyTemplate}
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
        // footer={<Button onClick={confirmAssignment} disabled={selectedEmployees.length == 0}>Assign Selected Staff</Button>}
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
          {/* <Column
            body={employeeCheckbox}
            header={allEmployeesCheckbox}
          ></Column> */}
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
            body={employeeActionBodyTemplate}
            header="Actions"
            frozen
            alignFrozen="right"
            exportable={false}
          ></Column>
        </DataTable>
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
              Are you sure you want to assign {" "}
              <b>{selectedEmployee.employeeName}</b> to {" "}
              <b>{sensorList.filter(sensor => selectedMaintenanceDetails.includes(sensor.sensorId)).map((sensor) => " " + sensor.sensorName).toString()}?</b>
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default SensorMaintenanceSuggestion;
