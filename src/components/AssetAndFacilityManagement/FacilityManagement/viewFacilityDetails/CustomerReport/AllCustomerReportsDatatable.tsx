import React, { useEffect, useState, useRef } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { ProductService } from './service/ProductService';
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import useApiJson from "../../../../../hooks/useApiJson";
import { HiCheck, HiEye, HiPencil, HiTrash, HiX } from "react-icons/hi";

import { Button } from "@/components/ui/button";
import { NavLink, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import CustomerReport from "../../../../../models/CustomerReport";
import Facility from "../../../../../models/Facility";

interface AllCustomerReportsDatatableProps {
  curFacility: Facility;
}

function AllCustomerReportsDatatable(props: AllCustomerReportsDatatableProps) {
  const apiJson = useApiJson();
  const { curFacility } = props;
  let emptyCustomerReport: CustomerReport = {
    customerReportId: -1,
    dateTime: new Date(),
    title: "",
    remarks: "",
    viewed: false
  };

  const [customerReportList, setCustomerReportList] = useState<CustomerReport[]>([]);
  const [selectedCustomerReport, setSelectedCustomerReport] = useState<CustomerReport>(emptyCustomerReport);
  const [deletecustomerReportDialog, setDeleteCustomerReportDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<CustomerReport[]>>(null);
  const toastShadcn = useToast().toast;

  // Get all customer reports
  // useEffect(() => {
  //   apiJson.post("http://localhost:3000/api/assetFacility/getAllCustomerReport", { includes: [] }).catch(e => {
  //     console.log(e);
  //   }).then(res => {
  //     setCustomerReportList(res["customerReports"]);
  //   })
  // }, []);

  //
  const exportCSV = () => {
    dt.current?.exportCSV();
  };


  const confirmDeletecustomerReport = (customerReport: CustomerReport) => {
    setSelectedCustomerReport(customerReport);
    setDeleteCustomerReportDialog(true);
  };

  const hideDeleteCustomerReportDialog = () => {
    setDeleteCustomerReportDialog(false);
  };

  // delete customerReport stuff
  const deleteCustomerReport = async () => {
    let _customerReport = customerReportList.filter(
      (val) => val.customerReportId !== selectedCustomerReport?.customerReportId
    );

    const deleteCustomerReport = async () => {
      try {
        setDeleteCustomerReportDialog(false);
        const responseJson = await apiJson.del(
          "http://localhost:3000/api/assetFacility/deleteCustomerReport/" +
          selectedCustomerReport.customerReportId
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description:
            "Successfully deleted customerReport: " + selectedCustomerReport.customerReportId,
        });
        setCustomerReportList(_customerReport);
        setSelectedCustomerReport(emptyCustomerReport);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while deleting customerReport: \n" + apiJson.error,
        });
      }
    };
    deleteCustomerReport();
  };

  const deleteCustomerReportDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeleteCustomerReportDialog}>
        <HiX />
        No
      </Button>
      <Button variant={"destructive"} onClick={deleteCustomerReport}>
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>
  );
  // end delete customerReport stuff

  const actionBodyTemplate = (customerReport: CustomerReport) => {
    return (
      <React.Fragment>
        <NavLink to={`/assetcustomerReport/viewcustomerReportdetails/${customerReport.customerReportId}`}>
          <Button variant={"outline"} className="mb-1 mr-1">
            <HiEye className="mx-auto" />

          </Button>
        </NavLink>
        <NavLink to={`/assetcustomerReport/editcustomerReport/${customerReport.customerReportId}`}>
          <Button className="mr-1">
            <HiPencil className="mr-1" />

          </Button>
        </NavLink>
        <Button
          variant={"destructive"}
          className="mr-2"
          onClick={() => confirmDeletecustomerReport(customerReport)}
        >
          <HiTrash className="mx-auto" />

        </Button>
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
    </div>
  );

  return (
    <div>
      <div>
        <Toast ref={toast} />
        <div className="rounded-lg bg-white p-4">
          {/* Title Header and back button */}
          <div className="flex flex-col">
            <div className="mb-4 flex justify-between">
              <NavLink to={"/assetcustomerReport/createsensor"}>

                <Button disabled className="invisible">
                  Back
                </Button>
              </NavLink>
              <span className=" self-center text-title-xl font-bold">
                All Customer Reports
              </span>
              <Button onClick={exportCSV}>Export to .csv</Button>
            </div>
            <Separator />
          </div>

          <DataTable
            ref={dt}
            value={customerReportList}
            selection={selectedCustomerReport}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setSelectedCustomerReport(e.value);
              }
            }}
            dataKey="customerReportId"
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
              field="customerReportId"
              header="ID"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="dateTime"
              header="Date"
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
              style={{ minWidth: "9rem" }}
            ></Column>
          </DataTable>
        </div>
      </div>
      <Dialog
        visible={deletecustomerReportDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteCustomerReportDialogFooter}
        onHide={hideDeleteCustomerReportDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedCustomerReport && (
            <span>
              Are you sure you want to delete{" "}
              <b>{selectedCustomerReport.customerReportId}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default AllCustomerReportsDatatable;
