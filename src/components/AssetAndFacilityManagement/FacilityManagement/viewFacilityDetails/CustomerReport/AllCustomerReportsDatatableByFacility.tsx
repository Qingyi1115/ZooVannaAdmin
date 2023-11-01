import React, { useEffect, useState, useRef } from "react";

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
import { ToggleButton } from "primereact/togglebutton";
import { BsWrenchAdjustable } from "react-icons/bs";

interface AllCustomerReportsDatatableByFacilityProps {
  curFacility: Facility;
}

function AllCustomerReportsDatatableByFacility(props: AllCustomerReportsDatatableByFacilityProps) {
  const apiJson = useApiJson();
  const { curFacility } = props;
  let emptyCustomerReportLog: CustomerReportLog = {
    customerReportLogId: -1,
    dateTime: new Date(),
    title: "",
    remarks: "",
    viewed: false
  };

  const [customerReportLogList, setCustomerReportLogList] = useState<CustomerReportLog[]>([]);
  const [selectedCustomerReportLog, setSelectedCustomerReportLog] = useState<CustomerReportLog>(emptyCustomerReportLog);
  const [deletecustomerReportLogDialog, setDeleteCustomerReportLogDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<CustomerReportLog[]>>(null);
  const toastShadcn = useToast().toast;
  const [checkedList, setCheckedList] = useState([]);

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };

  // Get all customer reports
  useEffect(() => {
    apiJson.get(`http://localhost:3000/api/assetFacility/getAllCustomerReportLogsByFacilityId/${curFacility.facilityId}`).catch(e => {
      console.log("error", e);
    }).then(res => {
      console.log("getAllCustomerReportLogsByFacilityId", res)
      setCustomerReportLogList(res["customerReportLogs"]);
      setCheckedList(res["customerReportLogs"].filter(log=>log.viewed).map(log=>log.customerReportLogId));
    })
  }, [curFacility]);

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
            "An error has occurred while deleting customerReportLog: \n" + apiJson.error,
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

        
        <ToggleButton
                checked={checkedList.includes(customerReportLog.customerReportLogId)}
                onChange={(e) => {
                  if (!e.value){
                    setCheckedList(
                      checkedList.filter(id=>id  != customerReportLog.customerReportLogId)
                    );
                  }else{
                    const a = []
                    for (const i of checkedList) a.push(i);
                    a.push(customerReportLog.customerReportLogId)
                    setCheckedList(
                      a
                    );
                  }
                  apiJson.put("http://localhost:3000/api/assetFacility/markCustomerReportLogsViewed", {customerReportLogIds:[customerReportLog.customerReportLogId], viewed:e.value});
                }}
                onClick={() => {

                }}
                className="absolute top-5 right-20"
                onIcon={<HiOutlineMail />}
                offIcon={<HiOutlineMailOpen />}>
                <BsWrenchAdjustable className="mx-auto" ></BsWrenchAdjustable>
        </ToggleButton >

      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Manage Customer Reports</h4>
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

  return (
    <div>
      <div>
        <Toast ref={toast} />
        <div className="">

          <DataTable
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
          </DataTable>
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
    </div>
  );
}

export default AllCustomerReportsDatatableByFacility;
