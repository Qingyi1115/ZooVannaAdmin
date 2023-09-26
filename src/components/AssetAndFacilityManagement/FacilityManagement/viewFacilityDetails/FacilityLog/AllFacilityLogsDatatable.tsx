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
import { HiCheck, HiEye, HiPencil, HiPlus, HiTrash, HiX } from "react-icons/hi";

import { Button } from "@/components/ui/button";
import { NavLink, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import FacilityLog from "../../../../../models/FacilityLog";
import Facility from "../../../../../models/Facility";
import InHouse from "../../../../../models/InHouse";
import { FacilityType } from "../../../../../enums/FacilityType";

interface AllFacilityLogsDatatableProps {
  curFacility: Facility;
  curInHouse: InHouse;
}

function AllFacilityLogsDatatable(props: AllFacilityLogsDatatableProps) {
  const apiJson = useApiJson();
  const { curFacility, curInHouse } = props;
  let emptyInHouse: InHouse = {
    isPaid: false,
    lastMaintained: new Date(),
    maxAccommodationSize: 0,
    hasAirCon: false,
    facilityType: FacilityType.AED,
    facilityLogs: []
  };

  let emptyFacility: Facility = {
    facilityId: -1,
    facilityName: "",
    xCoordinate: 0,
    yCoordinate: 0,
    facilityDetail: "",
    facilityDetailJson: emptyInHouse,
    isSheltered: false,
    hubProcessors: []
  };

  let emptyFacilityLog: FacilityLog = {
    logId: 0,
    dateTime: new Date(),
    isMaintenance: false,
    title: "",
    details: "",
    remarks: "",
    facility: emptyFacility
  };

  const [facilityLogList, setFacilityLogList] = useState<FacilityLog[]>(curInHouse.facilityLogs);
  const [selectedFacilityLog, setSelectedFacilityLog] = useState<FacilityLog>(emptyFacilityLog);
  const [deletefacilityLogDialog, setDeleteFacilityLogDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<FacilityLog[]>>(null);
  const toastShadcn = useToast().toast;

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const confirmDeletefacilityLog = (facilityLog: FacilityLog) => {
    setSelectedFacilityLog(facilityLog);
    setDeleteFacilityLogDialog(true);
  };

  const hideDeleteFacilityLogDialog = () => {
    setDeleteFacilityLogDialog(false);
  };

  // delete facilityLog stuff
  const deleteFacilityLog = async () => {
    let _facilityLog = facilityLogList.filter(
      (val) => val.logId !== selectedFacilityLog?.logId
    );

    const deleteFacilityLog = async () => {
      try {
        setDeleteFacilityLogDialog(false);
        const responseJson = await apiJson.del(
          "http://localhost:3000/api/assetFacility/deleteFacilityLog/" +
          selectedFacilityLog.logId
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description:
            "Successfully deleted facilityLog: " + selectedFacilityLog.logId,
        });
        setFacilityLogList(_facilityLog);
        setSelectedFacilityLog(emptyFacilityLog);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while deleting facilityLog: \n" + apiJson.error,
        });
      }
    };
    deleteFacilityLog();
  };

  const deleteFacilityLogDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeleteFacilityLogDialog}>
        <HiX />
        No
      </Button>
      <Button variant={"destructive"} onClick={deleteFacilityLog}>
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>
  );
  // end delete facilityLog stuff

  const actionBodyTemplate = (facilityLog: FacilityLog) => {
    return (
      <React.Fragment>
        <NavLink to={`/assetfacility/viewfacilityLogdetails/${facilityLog.logId}`}>
          <Button variant={"outline"} className="mb-1 mr-1">
            <HiEye className="mx-auto" />

          </Button>
        </NavLink>
        <NavLink to={`/assetfacility/editfacilityLog/${facilityLog.logId}`}>
          <Button className="mr-1">
            <HiPencil className="mr-1" />

          </Button>
        </NavLink>
        <Button
          variant={"destructive"}
          className="mr-2"
          onClick={() => confirmDeletefacilityLog(facilityLog)}
        >
          <HiTrash className="mx-auto" />

        </Button>
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Manage Facility Logs</h4>
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

  const listItem = (facilityLog: FacilityLog) => {
    return (
      <div className="col-12">
        <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
          <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
            <div className="flex flex-column align-items-center sm:align-items-start gap-3">
              <div className="text-2xl font-bold text-900">{facilityLog.title}</div>
              <div className="flex align-items-center gap-3">
                <span className="flex align-items-center gap-2">
                  <span className="font-semibold">{facilityLog.details}</span>
                  <span className="font-semibold">{facilityLog.remarks}</span>
                </span>
              </div>
            </div>
            <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
              <span className="text-2xl font-semibold">${String(facilityLog.dateTime)}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const itemTemplate = (facilityLog: FacilityLog) => {
    if (!facilityLog) {
      return;
    }
    return listItem(facilityLog);
  };

  return (
    <div>
      <div>
        <Toast ref={toast} />
        <div className="rounded-lg bg-white p-4">
          {/* Title Header and back button */}
          <div className="flex flex-col">
            <div className="mb-4 flex justify-between">
              <NavLink to={`/assetfacility/createfacilitylog/${curFacility.facilityId}`}>
                <Button className="mr-2">
                  <HiPlus className="mr-auto" />
                </Button>
              </NavLink>
              <span className=" self-center text-title-xl font-bold">
                All Facility Logs
              </span>
              <Button onClick={exportCSV}>Export to .csv</Button>
            </div>
            <Separator />
          </div>

          <DataTable
            ref={dt}
            value={facilityLogList}
            selection={selectedFacilityLog}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setSelectedFacilityLog(e.value);
              }
            }}
            dataKey="logId"
            paginator
            rows={10}
            scrollable
            selectionMode={"single"}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} facility logs"
            globalFilter={globalFilter}
            header={header}
          >
            <Column
              field="logId"
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
          <DataView
            value={facilityLogList}
            itemTemplate={itemTemplate}
            layout="list"
            header={header}
          />
        </div>
      </div>
      <Dialog
        visible={deletefacilityLogDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteFacilityLogDialogFooter}
        onHide={hideDeleteFacilityLogDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedFacilityLog && (
            <span>
              Are you sure you want to delete{" "}
              <b>{selectedFacilityLog.logId}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default AllFacilityLogsDatatable;
