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
import FacilityLog from "../../../../../models/FacilityLog";

function AllFacilityLogsDatatable() {
  const apiJson = useApiJson();
  const { facilityDetail } = useParams<{ facilityDetail: string }>();
  const facilityDetailJson = (facilityDetail == "thirdParty" ?
    {
      ownership: "",
      ownerContact: "",
      maxAccommodationSize: "",
      hasAirCon: "",
      facilityLogType: ""
    } :
    {
      isPaid: "",
      maxAccommodationSize: "",
      hasAirCon: "",
      facilityLogType: ""
    })

  let emptyFacilityLog: FacilityLog = {
    logId: 0,
    dateTime: new Date(),
    isMaintenance: false,
    title: "",
    details: "",
    remark: "",
    facility: undefined,
    inHouse: undefined
  };

  const [facilityLogList, setFacilityLogList] = useState<FacilityLog[]>([]);
  const [selectedFacilityLog, setSelectedFacilityLog] = useState<FacilityLog>(emptyFacilityLog);
  const [deletefacilityLogDialog, setDeleteFacilityLogDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<FacilityLog[]>>(null);
  const toastShadcn = useToast().toast;

  useEffect(() => {
    apiJson.post("http://localhost:3000/api/assetFacility/getAllFacilityLog", { includes: [] }).catch(e => {
      console.log(e);
    }).then(res => {
      setFacilityLogList(res["facilityLogs"]);
    })
  }, []);

  //
  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const rightToolbarTemplate = () => {
    return <Button onClick={exportCSV}>Export to .csv</Button>;
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
        <NavLink to={`/assetfacilityLog/viewfacilityLogdetails/${facilityLog.logId}`}>
          <Button variant={"outline"} className="mb-1 mr-1">
            <HiEye className="mx-auto" />

          </Button>
        </NavLink>
        <NavLink to={`/assetfacilityLog/editfacilityLog/${facilityLog.logId}`}>
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
              <NavLink to={"/assetfacilityLog/createsensor"}>
                {/* TODO: Preload hub details? */}
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
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} customer reports"
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
