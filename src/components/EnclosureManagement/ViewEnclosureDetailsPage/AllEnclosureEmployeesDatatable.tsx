import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox, CheckboxClickEvent } from "primereact/checkbox";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { HiCheck, HiEye, HiMinus, HiPlus, HiX } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import beautifyText from "../../../hooks/beautifyText";
import useApiJson from "../../../hooks/useApiJson";
import { useAuthContext } from "../../../hooks/useAuthContext";
import Employee from "../../../models/Employee";
import Enclosure from "../../../models/Enclosure";

interface AllEnclosureEmployeesDatatableProps {
  curEnclosure: Enclosure;
  setRefreshSeed: Function;
}

function AllEnclosureEmployeesDatatable(props: AllEnclosureEmployeesDatatableProps) {
  const apiJson = useApiJson();

  const { curEnclosure, setRefreshSeed } = props;
  const enclosureId = curEnclosure.enclosureId;

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
  };

  const toast = useRef<Toast>(null);

  const [selectedEmployee, setSelectedEmployee] = useState<Employee>(emptyEmployee);
  const [selectedAssignedEmployees, setSelectedAssignedEmployees] = useState<number[]>([]);
  const [selectedAvailableEmployees, setSelectedAvailableEmployees] = useState<number[]>([]);
  const dt = useRef<DataTable<Employee[]>>(null);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [employeeAssignmentDialog, setAssignmentDialog] = useState<boolean>(false);
  const [employeeRemovalDialog, setEmployeeRemovalDialog] = useState<boolean>(false);
  const [employeeBulkAssignmentDialog, setBulkAssignmentDialog] = useState<boolean>(false);
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();
  const employee = useAuthContext().state.user?.employeeData;
  const [assignedEmployees, setAssignedEmployees] = useState<Employee[]>([]);
  const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([]);
  const [currentEnclosure, setCurrentEnclosure] = useState<Enclosure>();

  useEffect(() => {
    const wrapper = async () => {
      try {
        const allEmp = await apiJson.get(
          `http://localhost:3000/api/employee/getAllKeepers`
        );

        console.log("ViewAllEnclosureKeepers", curEnclosure, allEmp)
        setCurrentEnclosure(curEnclosure);
        const assignedStaff: any[] = [];
        const availableStaff: any[] = [];

        for (const keeper of curEnclosure.keepers) {
          let emp = { ...keeper.employee } as any;
          emp["keeper"] = { ...keeper, employee: undefined };
          emp.currentlyAssigned = true;
          assignedStaff.push(emp);
        }
        for (const keeper of allEmp.keepers) {
          if (!assignedStaff.find(emp => emp.employeeId == keeper.employeeId)) {
            let emp = { ...keeper.employee };
            emp["keeper"] = { ...keeper, employee: undefined };
            keeper.currentlyAssigned = false;
            availableStaff.push(emp);
          }
        }
        console.log("availableEmployees", availableStaff);
        console.log("aa", assignedStaff)
        setAssignedEmployees(assignedStaff);
        setAvailableEmployees(availableStaff);

      } catch (err) {
        console.log(err);
      }
    }
    wrapper();
  }, [curEnclosure]);

  // useEffect(() => {
  //   apiJson.get(
  //     `http://localhost:3000/api/zooEvent/getKeepersForZooEvent/${enclosureId}`).catch(e => console.log(e)).then(res => {
  //       // const allStaffs: Employee[] = []
  //       // for (const staff of res["generalStaffs"]) {
  //       //   // console.log(staff);
  //       //   if (staff.generalStaffType == "ZOO_MAINTENANCE") {
  //       //     let emp = staff.employee;
  //       //     staff.employee = undefined;
  //       //     emp["generalStaff"] = staff
  //       //     const maintainedFacility: Facility = emp.generalStaff.maintainedFacilities.find((facility: Facility) => facility.facilityId == facilityId);
  //       //     console.log(maintainedFacility);
  //       //     emp.currentlyAssigned = (maintainedFacility !== undefined);
  //       //     allStaffs.push(emp)
  //       //   }

  //       // }
  //       console.log("AddEventKeepers", res);
  //       setAvailableEmployees(res["availiableKeepers"].map(keeper => {
  //         const emp = keeper.employee
  //         keeper.employee = undefined
  //         emp.keeper = keeper;
  //         emp.keeperType = keeper.keeperType;
  //         emp.currentlyAssigned = false;
  //         return emp;
  //       })
  //         // .concat(res["currentKeepers"].map(keeper => {
  //         //   const emp = keeper.employee
  //         //   keeper.employee = undefined
  //         //   emp.keeper = keeper;
  //         //   emp.keeperType = keeper.keeperType;
  //         //   emp.currentlyAssigned = true;
  //         //   return emp;
  //         // }))
  //       );

  //       setAssignedEmployees(res["currentKeepers"].map(keeper => {
  //         const emp = keeper.employee
  //         keeper.employee = undefined
  //         emp.keeper = keeper;
  //         emp.keeperType = keeper.keeperType;
  //         emp.currentlyAssigned = false;
  //         return emp;
  //       })
  //         // .concat(res["availableKeepers"].map(keeper => {
  //         //   const emp = keeper.employee
  //         //   keeper.employee = undefined
  //         //   emp.keeper = keeper;
  //         //   emp.keeperType = keeper.keeperType;
  //         //   emp.currentlyAssigned = true;
  //         //   return emp;
  //         // }))
  //       );
  //     });
  // }, [refreshSeed]);

  const assignKeeper = async () => {
    const selectedEmployeeName = selectedEmployee.employeeName;

    try {
      const values = {
        employeeIds: [selectedEmployee.employeeId,],
        enclosureId: enclosureId
      };
      const responseJson = await apiJson.put(
        `http://localhost:3000/api/enclosure/assignKeepersToEnclosure`,
        values).then(res => {
          toastShadcn({
            // variant: "destructive",
            title: "Assignment Successful",
            description:
              "Successfully assigned keeper: " + selectedEmployeeName,
          });

          setRefreshSeed([]);
        }).catch(err => {
          console.log("err", err),

            toastShadcn({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description:
                "An error has occurred while assigning keeper: \n" + apiJson.error,
            });
        }
        );


      setSelectedEmployee(employee);
      setAssignmentDialog(false);
      // window.location.reload();
    } catch (error: any) {
      // got error
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while assigning keeper: \n" + apiJson.error,
      });
    }

  }

  const removeKeeper = async () => {
    const selectedEmployeeName = selectedEmployee.employeeName;

    try {
      const responseJson = await apiJson.put(
        `http://localhost:3000/api/enclosure/removeKeepersFromEnclosure`,
        {
          employeeIds: [selectedEmployee.employeeId,],
          enclosureId: [enclosureId]
        });
      setRefreshSeed([]);
      toastShadcn({
        // variant: "destructive",
        title: "Removal Successful",
        description:
          "Successfully removed keeper: " + selectedEmployeeName,
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
          "An error has occurred while removing keeper: \n" + apiJson.error,
      });
    }

  }

  const showBulkAssignment = () => {
    setBulkAssignmentDialog(true);
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Manage Keepers</h4>
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
      {(employee.superAdmin ||
        employee.planningStaff?.plannerType == "CURATOR") && (
          <Button
            onClick={showBulkAssignment}
            disabled={availableEmployees.length == 0}
          >
            <HiPlus />Assign Keepers
          </Button>
        )}
      <Button onClick={exportCSV}>Export to .csv</Button>
    </div>
  );

  const confirmAssignment = () => {
    setAssignmentDialog(true);
  };

  const confirmEmployeeRemoval = () => {
    if (selectedAssignedEmployees.length != 0) {
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
              navigate(`/zooevent/viewzooeventdetails/${enclosureId}/assignedEmployees`, { replace: true });
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
      <h4 className="m-1">Manage Keepers</h4>
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

  const onSelectedAssignedEmployeesOnClick = (e: CheckboxClickEvent) => {
    let _selectedAssignedEmployees = [...selectedAssignedEmployees];
    if (e.checked) {
      _selectedAssignedEmployees.push(e.value);
    }
    else {
      _selectedAssignedEmployees.splice(_selectedAssignedEmployees.indexOf(e.value), 1);
    }
    setSelectedAssignedEmployees(_selectedAssignedEmployees);
  }

  const assignedEmployeeCheckbox = (employee: any) => {
    return (
      <React.Fragment>
        <div className="mb-4 flex">
          <Checkbox
            name="toAssignEmployees"
            value={employee.employeeId}
            onChange={onSelectedAssignedEmployeesOnClick}
            checked={selectedAssignedEmployees.includes(employee.employeeId)}>
          </Checkbox>
        </div>
      </React.Fragment>
    );
  };

  const onAllAssignedEmployeesOnClick = (e: CheckboxClickEvent) => {

    if (e.checked) {
      setSelectedAssignedEmployees(assignedEmployees.map((employee: Employee) => employee.employeeId));
    }
    else {
      setSelectedAssignedEmployees([]);
    }
    console.log(selectedAssignedEmployees);
  }

  const allAssignedEmployeesCheckbox = (employees: any) => {
    return (
      <React.Fragment>
        <div className="mb-4 flex">
          <Checkbox
            name="toAssignEmployees"
            onClick={onAllAssignedEmployeesOnClick}
            checked={selectedAssignedEmployees.length > 0 && selectedAssignedEmployees.length == assignedEmployees.length}>
          </Checkbox>
        </div>
      </React.Fragment>
    );
  };

  const onSelectedAvailableEmployeesOnClick = (e: CheckboxClickEvent) => {
    let _selectedAvailableEmployees = [...selectedAvailableEmployees];
    if (e.checked) {
      _selectedAvailableEmployees.push(e.value);
    }
    else {
      _selectedAvailableEmployees.splice(_selectedAvailableEmployees.indexOf(e.value), 1);
    }
    setSelectedAvailableEmployees(_selectedAvailableEmployees);
  }

  const availableEmployeeCheckbox = (employee: any) => {
    return (
      <React.Fragment>
        <div className="mb-4 flex">
          <Checkbox
            name="toAssignEmployees"
            value={employee.employeeId}
            onChange={onSelectedAvailableEmployeesOnClick}
            checked={selectedAvailableEmployees.includes(employee.employeeId)}>
          </Checkbox>
        </div>
      </React.Fragment>
    );
  };

  const onAllAvailableEmployeesOnClick = (e: CheckboxClickEvent) => {

    if (e.checked) {
      setSelectedAvailableEmployees(availableEmployees.map((employee: Employee) => employee.employeeId));
    }
    else {
      setSelectedAvailableEmployees([]);
    }
    console.log(selectedAvailableEmployees);
  }

  const allAvailableEmployeesCheckbox = (employees: any) => {
    return (
      <React.Fragment>
        <div className="mb-4 flex">
          <Checkbox
            name="toAssignEmployees"
            onClick={onAllAvailableEmployeesOnClick}
            checked={selectedAvailableEmployees.length > 0 && selectedAvailableEmployees.length == availableEmployees.length}>
          </Checkbox>
        </div>
      </React.Fragment>
    );
  };

  const hideEmployeeAssignmentDialog = () => {
    setAssignmentDialog(false);
  }

  const bulkAssignEmployees = async () => {
    const values = {
      employeeIds: selectedAvailableEmployees,
      enclosureId: enclosureId
    };
    console.log("values", values);
    const responseJson = await apiJson.put(
      `http://localhost:3000/api/enclosure/assignKeepersToEnclosure`,
      values).then(res => {
        toastShadcn({
          // variant: "destructive",
          title: "Assignment Successful",
          description:
            "Successfully assigned this enclosure to: " + availableEmployees.filter(emp => selectedAvailableEmployees.includes(emp.employeeId)).map((employee) => " " + employee.employeeName).toString(),
        });

        setRefreshSeed([]);
        setAssignmentDialog(false);
        setBulkAssignmentDialog(false);
        setSelectedAvailableEmployees([]);
      }).catch(err => {
        console.log("err", err),

          toastShadcn({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description:
              "An error has occurred while assigning keeper: \n" + apiJson.error,
          });
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

  const bulkRemoveEmployees = async () => {
    selectedAssignedEmployees.forEach(async (employeeId) => {
      try {
        const responseJson = await apiJson.put(
          `http://localhost:3000/api/enclosure/removeKeepersFromEnclosure`,
          {
            employeeIds: [employeeId,],
            enclosureId: [enclosureId]
          });
        setRefreshSeed([]);
        toastShadcn({
          // variant: "destructive",
          title: "Removal Successful",
          description:
            "Successfully removed keeper: " + assignedEmployees.filter(emp => selectedAssignedEmployees.includes(emp.employeeId)).map((employee) => " " + employee.employeeName).toString(),
        });
        setSelectedEmployee(employee);
        setEmployeeRemovalDialog(false);
        setBulkAssignmentDialog(false);
        setSelectedAssignedEmployees([]);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while removing keepers: \n" + apiJson.error,
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
      <Button variant={"destructive"} onClick={bulkRemoveEmployees}>
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
              navigate(`/assetzooEvent/viewzooEventdetails/${enclosureId}/manageMaintenance`, { replace: true });
              navigate(`/employeeAccount/viewEmployeeDetails/${employee.employeeId}`);
            }}>
            <HiPlus className="mx-auto" />
              Add Keepers
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
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} keepers"
            globalFilter={globalFilter}
            header={header}
          >
            {(employee.superAdmin ||
              employee.planningStaff?.plannerType == "CURATOR") && (
                <Column
                  body={assignedEmployeeCheckbox}
                  header={allAssignedEmployeesCheckbox}
                ></Column>
              )}
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
              field="keeperType"
              header="Keeper Type"
              body={(emp: Employee) => beautifyText(emp.keeper?.keeperType)}
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
          {(employee.superAdmin ||
            employee.planningStaff?.plannerType == "CURATOR") && (
              <Button
                variant={"destructive"}
                onClick={confirmEmployeeRemoval}
                disabled={selectedAssignedEmployees.length == 0}>
                <HiMinus />Remove Selected Keepers
              </Button>
            )}
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
                Are you sure you want to assign this event to{" "}
                <b>{availableEmployees.filter(emp => selectedAvailableEmployees.includes(emp.employeeId)).map((employee) => " " + employee.employeeName).toString()}?</b>
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
                <b>{assignedEmployees.filter(emp => selectedAssignedEmployees.includes(emp.employeeId)).map((employee) => " " + employee.employeeName).toString()}</b>?
              </span>
            )}
          </div>
        </Dialog>
        <Dialog
          visible={employeeBulkAssignmentDialog}
          style={{ width: "50rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Assign Keepers"
          footer={
            <Button
              onClick={confirmAssignment}
              disabled={selectedAvailableEmployees.length == 0}>
              Assign Selected Keepers
            </Button>}
          onHide={hideEmployeeBulkAssignmentDialog}>
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
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} keepers"
              globalFilter={globalFilter}
              header={bulkAssignmentHeader}
            >
              <Column
                body={availableEmployeeCheckbox}
                header={allAvailableEmployeesCheckbox}
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
                field="keeperType"
                header="Keeper Type"
                body={(emp: Employee) => beautifyText(emp.keeper?.keeperType)}
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
          </div>
        </Dialog >
      </div >
    </div >
  );
}

export default AllEnclosureEmployeesDatatable;
