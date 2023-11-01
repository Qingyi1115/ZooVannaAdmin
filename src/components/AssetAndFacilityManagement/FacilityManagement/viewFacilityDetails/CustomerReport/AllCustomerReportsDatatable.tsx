import React, { useEffect, useState, useRef } from "react";
import { DataView } from 'primereact/dataview';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { ProductService } from './service/ProductService';
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import useApiJson from "../../../../../hooks/useApiJson";
import { HiCheck, HiEye, HiOutlineMail, HiOutlineMailOpen, HiPencil, HiTrash, HiX } from "react-icons/hi";

import { Button } from "@/components/ui/button";
import { NavLink, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import CustomerReportLog from "../../../../../models/CustomerReportLog";
import Facility from "../../../../../models/Facility";
import { Card } from "primereact/card";
import { BsCheckCircle, BsWrenchAdjustable } from "react-icons/bs";
import { useAuthContext } from "../../../../../hooks/useAuthContext";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { ToggleButton } from "primereact/togglebutton";


function AllCustomerReportsDatatable() {
  const apiJson = useApiJson();
  let emptyCustomerReportLog: CustomerReportLog = {
    customerReportLogId: -1,
    dateTime: new Date(),
    title: "",
    remarks: "",
    viewed: false,
    inHouse: null,
    thirdParty: null
  };

  const [customerReportLogList, setCustomerReportLogList] = useState<CustomerReportLog[]>([]);
  const [selectedCustomerReportLog, setSelectedCustomerReportLog] = useState<CustomerReportLog>(emptyCustomerReportLog);
  const [deletecustomerReportLogDialog, setDeleteCustomerReportLogDialog] =
    useState<boolean>(false);
  const [viewedcustomerReportLogDialog, setViewedCustomerReportLogDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<CustomerReportLog[]>>(null);
  const toastShadcn = useToast().toast;
  const [checked, setChecked] = useState(false);
  const [checkedList, setCheckedList] = useState([]);
  const employee = useAuthContext().state.user?.employeeData;
  const [refreshSeed, setRefreshSeed] = useState<any>(0);

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };

  // Get all customer reports
  useEffect(() => {
    apiJson.get(`http://localhost:3000/api/assetFacility/getAllNonViewedCustomerReportLogs/`).catch(e => {
      console.log("error", e);
    }).then(res => {
      console.log("getAllNonViewedCustomerReportLogs", res)
      setCustomerReportLogList(res["customerReportLogs"]);
      setCheckedList(res["customerReportLogs"].filter(log=>log.viewed).map(log=>log.customerReportLogId));
    })
  }, [refreshSeed]);

  //
  const exportCSV = () => {
    dt.current?.exportCSV();
  };


  const confirmDeletecustomerReportLog = (customerReportLog: CustomerReportLog) => {
    setSelectedCustomerReportLog(customerReportLog);
    setDeleteCustomerReportLogDialog(true);
  };

  const hideDeleteCustomerReportLogDialog = () => {
    setDeleteCustomerReportLogDialog(false);
  };

  const confirmViewedcustomerReportLog = (customerReportLog: CustomerReportLog) => {
    setSelectedCustomerReportLog(customerReportLog);
    setViewedCustomerReportLogDialog(true);
  };

  const hideViewedCustomerReportLogDialog = () => {
    setViewedCustomerReportLogDialog(false);
  };

  // delete customerReportLog stuff
  const deleteCustomerReportLog = async () => {
    let _customerReportLog = customerReportLogList.filter(
      (val) => val.customerReportLogId !== selectedCustomerReportLog?.customerReportLogId
    );

    const deleteCustomerReportLog = async () => {
      try {
        setDeleteCustomerReportLogDialog(false);
        const responseJson = await apiJson.del(
          "http://localhost:3000/api/assetFacility/deleteCustomerReportLog/" +
          selectedCustomerReportLog.customerReportLogId
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description:
            "Successfully deleted customerReportLog: " + selectedCustomerReportLog.customerReportLogId,
        });
        setCustomerReportLogList(_customerReportLog);
        setSelectedCustomerReportLog(emptyCustomerReportLog);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while deleting customer report: \n" + apiJson.error,
        });
      }
    };
    deleteCustomerReportLog();
  };

  const deleteCustomerReportLogDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeleteCustomerReportLogDialog}>
        <HiX />
        No
      </Button>
      <Button variant={"destructive"} onClick={deleteCustomerReportLog}>
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>
  );
  // end delete customerReportLog stuff

  const markCustomerReportAsViewed = async () => {
    apiJson.put(
      `http://localhost:3000/api/assetfacility/markCustomerReportLogsViewed/`, { customerReportLogIds: [selectedCustomerReportLog.customerReportLogId], viewed: true })
      .then(res => {
        console.log("markCustomerReportLogsViewed", res);
        setRefreshSeed([]);
        hideViewedCustomerReportLogDialog();
        setSelectedCustomerReportLog(emptyCustomerReportLog);
      })
      .catch(e => console.log(e));
  }

  const viewedCustomerReportLogDialogFooter = (
    <React.Fragment>
      <Button variant={"destructive"} onClick={hideViewedCustomerReportLogDialog}>
        <HiX />
        No
      </Button>
      <Button onClick={markCustomerReportAsViewed}>
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>
  );

  const actionBodyTemplate = (customerReportLog: CustomerReportLog) => {
    return (
      <React.Fragment>
        <NavLink to={`/assetcustomerReportLog/viewcustomerReportLogdetails/${customerReportLog.customerReportLogId}`}>
          <Button variant={"outline"} className="mb-1 mr-1">
            <HiEye className="mx-auto" />

          </Button>
        </NavLink>
        <NavLink to={`/assetcustomerReportLog/editcustomerReportLog/${customerReportLog.customerReportLogId}`}>
          <Button className="mr-1">
            <HiPencil className="mr-1" />

          </Button>
        </NavLink>
        <Button
          variant={"destructive"}
          className="mr-2"
          onClick={() => confirmDeletecustomerReportLog(customerReportLog)}
        >
          <HiTrash className="mx-auto" />

        </Button>
      </React.Fragment>
    );
  };

  interface SortOption {
    label: string;
    value: string;
  }
  const [sortKey, setSortKey] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<1 | 0 | -1 | undefined | null>(-1);
  const [sortField, setSortField] = useState<string>('dateTime');
  const sortOptions: SortOption[] = [
    { label: 'Latest log', value: '!dateTime' },
    { label: 'Earliest log', value: 'dateTime' },
    { label: 'Title (A-Z)', value: 'title' },
    { label: 'Title (Z-A)', value: '!title' }
  ]

  const onSortChange = (event: DropdownChangeEvent) => {
    const value = event.value;

    if (value.indexOf('!') === 0) {
      setSortOrder(-1);
      setSortField(value.substring(1, value.length));
      setSortKey(value);
    } else {
      setSortOrder(1);
      setSortField(value);
      setSortKey(value);
    }
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
        <h4 className="m-1">Manage Customer Reports</h4>
        <Dropdown
          options={sortOptions}
          value={sortKey}
          optionLabel="label"
          placeholder="Sort By"
          onChange={onSortChange}
        />
        {/* <span className="p-input-icon-left">
          <i className="pi pi-search" />

          <InputText
            type="search"
            placeholder="Search..."
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              setGlobalFilter(target.value);
            }}
          />
        </span> */}

      </div>
    </div>
  );


  const listItem = (customerReportLog: CustomerReportLog) => {
    console.log(customerReportLog)
    return (
      <div>
        <Card
          // className="my-4 relative"
          className={"my-4 relative"}
          title={customerReportLog.title}
          subTitle={<div>
            {customerReportLog.dateTime ? "Date created: " + new Date(customerReportLog.dateTime).toLocaleString() : ""}
            <p></p>{customerReportLog.inHouse?.facility ? "Reported for: " + customerReportLog.inHouse?.facility.facilityName : ""}
          </div>}>
          {/* {(employee.superAdmin || employee.planningStaff?.plannerType == "OPERATIONS_MANAGER") &&
            (
              <ToggleButton
                checked={checked}
                onChange={(e) => setChecked(e.value)}
                onClick={() => {

                }}
                className="absolute top-5 right-20 h-10"
                onLabel="Mark as Viewed"
                offLabel="Viewed"
                onIcon="pi pi-exclamation-circle"
                offIcon="pi pi-check-circle">
              </ToggleButton >
            )} */}
          {(employee.superAdmin || employee.planningStaff?.plannerType == "OPERATIONS_MANAGER") &&
            (
              <Button
                onClick={() => {
                  confirmViewedcustomerReportLog(customerReportLog);
                }}
                className="absolute top-5 right-20">
                <BsCheckCircle className="mx-auto" />
              </Button >
            )}
          {((employee.superAdmin || employee.planningStaff?.plannerType == "OPERATIONS_MANAGER") &&
            <Button className="absolute top-5 right-5"
              variant={"destructive"}
              onClick={() => confirmDeletecustomerReportLog(customerReportLog)}
            >
              <HiTrash className="mx-auto" />
            </Button>
          )}
          <div className="flex flex-col justify-left gap-6 lg:flex-row lg:gap-12">
            <div>
              <div className="text-xl font-bold text-900 indent-px">Remarks</div>
              <p>{customerReportLog.remarks}</p>
            </div>
          </div>

        </Card>
      </div >
    )
  }

  const itemTemplate = (customerReportLog: CustomerReportLog) => {
    if (!customerReportLog) {
      return;
    }
    return listItem(customerReportLog);
  };

  return (
    <div>
      <div>
        <Toast ref={toast} />
        <div className="">

          <div className="">

            <DataView
              value={customerReportLogList}
              itemTemplate={itemTemplate}
              layout="list"
              dataKey="customerReportLogId"
              header={header}
              sortField={sortField}
              sortOrder={sortOrder}
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} customer reports"
              rows={10}
              rowsPerPageOptions={[5, 10, 25]}
              paginator
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            />
          </div>

          {/* <DataTable
            ref={dt}
            value={customerReportLogList}
            selection={selectedCustomerReportLog}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setSelectedCustomerReportLog(e.value);
              }
            }}
            dataKey="customerReportLogId"
            paginator
            rows={10}
            scrollable
            selectionMode={"single"}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} customer reports"
            globalFilter={globalFilter}
            header={header}
          >
            <Column
              field="customerReportLogId"
              header="ID"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="dateTime"
              header="Date Created"
              body={(customerReport) => {
                return new Date(customerReport.dateTime).toLocaleDateString(
                  "en-SG",
                  dateOptions
                );
              }}
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="title"
              header="Title"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="remarks"
              header="Remarks"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="viewed"
              header="Viewed?"
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
          </DataTable> */}
        </div>
      </div>
      <Dialog
        visible={deletecustomerReportLogDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteCustomerReportLogDialogFooter}
        onHide={hideDeleteCustomerReportLogDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedCustomerReportLog && (
            <span>
              Are you sure you want to delete{" "}
              <b>{selectedCustomerReportLog.customerReportLogId}</b>?
            </span>
          )}
        </div>
      </Dialog>
      <Dialog
        visible={viewedcustomerReportLogDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={viewedCustomerReportLogDialogFooter}
        onHide={hideViewedCustomerReportLogDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedCustomerReportLog && (
            <span>
              Are you sure you want to mark{" "}
              <b>{selectedCustomerReportLog.title}</b> {" "} as viewed?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default AllCustomerReportsDatatable;
