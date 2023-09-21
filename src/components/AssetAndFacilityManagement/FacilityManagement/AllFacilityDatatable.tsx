import React, { useEffect, useState, useRef } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { ProductService } from './service/ProductService';
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import facility from "src/models/Facility";
import useApiJson from "../../../hooks/useApiJson";
import { HiCheck, HiPencil, HiTrash, HiX } from "react-icons/hi";

import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

function AllfacilityDatatable() {
  const apiJson = useApiJson();

  let emptyfacility: facility = {
    facilityId: -1,
    facilityName: "",
    xCoordinate: 0,
    yCoordinate: 0,
    facilityDetail: "",
    facilityDetailJson: undefined
  };

  const [facilityList, setfacilityList] = useState<facility[]>([]);
  const [selectedfacility, setSelectedfacility] = useState<facility>(emptyfacility);
  const [deletefacilityDialog, setDeletefacilityDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<facility[]>>(null);

  useEffect(() => {
    apiJson.post("http://localhost:3000/api/assetFacility/getAllFacility", {includes:[]});
  }, []);
  
  //
  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const rightToolbarTemplate = () => {
    return <Button onClick={exportCSV}>Export to .csv</Button>;
  };



  const confirmDeletefacility = (facility: facility) => {
    setSelectedfacility(facility);
    setDeletefacilityDialog(true);
  };

  const hideDeletefacilityDialog = () => {
    setDeletefacilityDialog(false);
  };

  // delete facility stuff
  const deletefacility = () => {
    let _facility = facilityList.filter(
      (val) => val.facilityId !== selectedfacility?.facilityId
    );

    setfacilityList(_facility);
    setDeletefacilityDialog(false);
    setSelectedfacility(emptyfacility);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "facility Deleted",
      life: 3000,
    });
  };

  const deletefacilityDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeletefacilityDialog}>
        <HiX />
        No
      </Button>
      <Button variant={"destructive"} onClick={deletefacility}>
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>
  );
  // end delete facility stuff

  const actionBodyTemplate = (facility: facility) => {
    return (
      <React.Fragment>
        <NavLink to={`/facility/editfacility/${facility.facilityName}`}>
          <Button className="mr-2">
            <HiPencil />
            <span>Edit</span>
          </Button>
        </NavLink>
        <Button
          variant={"destructive"}
          className="mr-2"
          onClick={() => confirmDeletefacility(facility)}
        >
          <HiTrash />
          <span>Delete</span>
        </Button>
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Manage facility</h4>
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
          <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

          <DataTable
            ref={dt}
            value={facilityList}
            selection={selectedfacility}
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
          </DataTable>
        </div>
      </div>
      <Dialog
        visible={deletefacilityDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deletefacilityDialogFooter}
        onHide={hideDeletefacilityDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedfacility && (
            <span>
              Are you sure you want to delete{" "}
              <b>{selectedfacility.facilityName}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default AllfacilityDatatable;
