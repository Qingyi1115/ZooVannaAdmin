import { Toast } from "primereact/toast";
import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import useApiJson from "../../hooks/useApiJson";
import Employee from "src/models/Employee";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import { NavLink, useNavigate } from "react-router-dom";
import { HiCheck, HiClipboard, HiClipboardList, HiEye, HiPencil, HiPlus, HiTrash, HiX } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog } from "primereact/dialog";
import { Separator } from "@/components/ui/separator";
import { useAuthContext } from "../../hooks/useAuthContext";

{
  /*const toast = useRef<Toast>(null);*/
}

function AllEmployeesDatatable() {
  const apiJson = useApiJson();

  // date options
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };

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

  const toast = useRef<Toast>(null);

  const [employeeList, setEmployeeList] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee>(emptyEmployee);
  const dt = useRef<DataTable<Employee[]>>(null);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [employeeResignationDialog, setEmployeeResignationDialog] =
    useState<boolean>(false);
  const toastShadcn = useToast().toast;

  const employee = useAuthContext().state.user?.employeeData;
  const navigate = useNavigate();

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const responseJson = await apiJson.post(
          "http://localhost:3000/api/employee/getAllEmployees",
          { includes: ["keeper", "generalStaff", "planningStaff"] }
        );
        setEmployeeList(responseJson.employees as Employee[]);
        //console.log("Here " + responseJson);
        //const help = responseJson as Employee[];
        //console.log(help);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchEmployees();
  }, []);

  const hideEmployeeResignationDialog = () => {
    setEmployeeResignationDialog(false);
  };

  const resignEmployee = async () => {
    const selectedEmployeeName = selectedEmployee.employeeName;
    console.log(selectedEmployee);

    const resignEmployee = async () => {
      try {
        const responseJson = await apiJson.put(
          `http://localhost:3000/api/employee/disableEmployee/${selectedEmployee.employeeId}`,
          selectedEmployee
        );

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
            "An error has occurred while disabling employee: \n" +
            apiJson.error,
        });
      }
    };
    resignEmployee();
  };

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

  const confirmEmployeeResignation = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEmployeeResignationDialog(true);
  };

  const actionBodyTemplate = (rowEmployee: Employee) => {
    console.log(rowEmployee.dateOfResignation);
    return (
      <React.Fragment>
        <Button
          onClick={() => {
            navigate(`/employeeAccount/viewEmployees/`, { replace: true })
            navigate(`/employeeAccount/viewEmployeeDetails/${rowEmployee.employeeId}`)
          }}
          className="mr-2">
          <HiEye className="mx-auto" />
        </Button>
        {(employee.superAdmin || employee.planningStaff?.plannerType == "OPERATIONS_MANAGER") &&
          <Button
            variant={"outline"}
            onClick={() => {
              navigate(`/employeeAccount/viewEmployees/`, { replace: true })
              navigate(`/zooevent/createleaveevent/${rowEmployee.employeeId}`)
            }}
            className="mr-2">
            <HiClipboardList className="mx-auto" />
          </Button>}
        {rowEmployee.dateOfResignation ? (
          <Button disabled variant={"destructive"}>
            <HiTrash className="mx-auto" />
            <span>Disabled</span>
          </Button>
        ) : (
          <Button
            variant={"destructive"}
            className="mr-2"
            onClick={() => confirmEmployeeResignation(rowEmployee)}
          >
            <HiTrash className="mx-auto" />
          </Button>
        )}
      </React.Fragment>
    );
  };

  return (
    <div>
      <div>
        <Toast ref={toast} />
        {/* Title Header and back button */}
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">
            <NavLink to={"/employeeAccount/createNewEmployee"}>
              <Button className="mr-2">
                <HiPlus className="mr-auto" />
                Add Employee
              </Button>
            </NavLink>
            <Button onClick={exportCSV}>Export to .csv</Button>
          </div>
          <Separator />
        </div>
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
            scrollable
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
              body={(employee) => {
                return new Date(employee.employeeBirthDate).toLocaleDateString(
                  "en-SG",
                  dateOptions
                );
              }}
              field="employeeBirthDate"
              header="Birthday"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              body={actionBodyTemplate}
              header="Actions"
              frozen
              alignFrozen="right"
              exportable={false}
              style={{ minWidth: "14rem" }}
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
                Are you sure you want to disable{" "}
                <b>{selectedEmployee.employeeName}</b>?
              </span>
            )}
          </div>
        </Dialog>
      </div>
    </div>
  );
}

export default AllEmployeesDatatable;
