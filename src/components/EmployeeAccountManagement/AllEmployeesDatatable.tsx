import { Toast } from "primereact/toast";
import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import useApiJson from "../../hooks/useApiJson";
import Employee from "src/models/Employee";

{/*const toast = useRef<Toast>(null);*/}

function AllEmployeesDatatable() {
    const apiJson = useApiJson();

    let emptyEmployee: Employee = {
        employeeId: -1,
        employeeName: "",
        employeeEmail: "",
        employeeAddress: "",
        employeePhoneNumber: "",
        employeePasswordHash: "",
        employeeSalt: "",
        employeeDoorAccessCode: "",
        employeeEducation: "",
        isAccountManager: false,
    };
      
    const [employeeList, setEmployeeList] = useState<Employee[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee>(emptyEmployee);
    const dt = useRef<DataTable<Employee[]>>(null);

    return (
        <div>
            <div>
                {/*<Toast ref={toast} />*/}
                <div>
                    {/*
                    <DataTable
                        ref={dt}
                        value={employeeList}
                        selection={selectedEmployee}
                        onSelectionChange={(e) => {
                        if (Array.isArray(e.value)) {
                            setSelectedfacility(e.value);
                        }
                        }}
                        dataKey="facilityId"
                        paginator
                        rows={10}
                        selectionMode={"single"}
                        rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} facility"
                        globalFilter={globalFilter}
                        header={header}
                    >
                        <Column
                        field="facilityName"
                        header="Name"
                        sortable
                        style={{ minWidth: "12rem" }}
                        ></Column>
                        <Column
                        field="xCoordinate"
                        header="X Coordinate"
                        sortable
                        style={{ minWidth: "12rem" }}
                        ></Column>
                        <Column
                        field="yCoordinate"
                        header="Y Coordinate"
                        sortable
                        style={{ minWidth: "12rem" }}
                        ></Column>
                        <Column
                        field="facilityDetail"
                        header="Details"
                        sortable
                        style={{ minWidth: "12rem" }}
                        ></Column>
                        <Column
                        body={actionBodyTemplate}
                        header="Actions"
                        exportable={false}
                        style={{ minWidth: "18rem" }}
                        ></Column>
                    </DataTable>*/}
                </div>
            </div>
            Hello!
        </div>
    )
}

export default AllEmployeesDatatable;