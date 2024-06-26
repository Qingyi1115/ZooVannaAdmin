import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useRef, useState } from "react";
import { HiCheck, HiEye, HiMinus, HiX } from "react-icons/hi";
import { NavLink, useNavigate } from "react-router-dom";
import useApiJson from "../../../../../hooks/useApiJson";
import Employee from "../../../../../models/Employee";

{
  /*const toast = useRef<Toast>(null);*/
}
interface RemoveOperationStaffProps {
  facilityId: number;
  employeeList: Employee[];
  setRefreshSeed: Function;
}

function RemoveOperationStaff(props: RemoveOperationStaffProps) {
  const apiJson = useApiJson();

  const { facilityId, employeeList, setRefreshSeed } = props;

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
  const [employeeRemovalDialog, setEmployeeRemovalDialog] =
    useState<boolean>(false);
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();

  const hideEmployeeRemovalDialog = () => {
    setEmployeeRemovalDialog(false);
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const removeOperationStaff = async () => {
    const selectedEmployeeName = selectedEmployee.employeeName;

    try {
      const responseJson = await apiJson
        .del(
          `http://localhost:3000/api/assetFacility/removeOperationStaffFromFacility/${facilityId}`,
          { employeeIds: [selectedEmployee.employeeId] }
        )
        .then((res) => {
          setRefreshSeed([]);
        })
        .catch((err) => console.log("err", err));

      toastShadcn({
        // variant: "destructive",
        title: "Removal Successful",
        description:
          "Successfully removed operation staff: " + selectedEmployeeName,
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
          "An error has occurred while removing operation staff: \n" +
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
      <Button variant={"destructive"} onClick={removeOperationStaff}>
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>
  );

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Manage Operation Staff</h4>
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

  const confirmEmployeeRemoval = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEmployeeRemovalDialog(true);
  };

  const actionBodyTemplate = (employee: Employee) => {
    return (
      <React.Fragment>
        <NavLink
          to={`/employeeAccount/viewEmployeeDetails/${employee.employeeId}`}
        >
          <Button variant={"outline"} className="mb-1 mr-1">
            <HiEye className="mx-auto" />
          </Button>
        </NavLink>
        {employee.dateOfResignation ? (
          <span>Removed</span>
        ) : (
          <Button
            variant={"destructive"}
            className="mr-2"
            onClick={() => confirmEmployeeRemoval(employee)}
          >
            <HiMinus className="mx-auto" />
          </Button>
        )}
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
              frozen
              alignFrozen="right"
              exportable={false}
              style={{ minWidth: "9rem" }}
            ></Column>
          </DataTable>
        </div>
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

export default RemoveOperationStaff;
