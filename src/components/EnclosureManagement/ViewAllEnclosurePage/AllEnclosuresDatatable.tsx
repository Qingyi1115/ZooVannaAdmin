import React, { useEffect, useRef, useState } from "react";

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
// import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import { HiCheck, HiEye, HiTrash, HiX } from "react-icons/hi";
import useApiJson from "../../../hooks/useApiJson";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import {
  EnclosureStatus
} from "../../../enums/Enumurated";
import { useAuthContext } from "../../../hooks/useAuthContext";
import Enclosure from "../../../models/Enclosure";

let emptyEnclosure: Enclosure = {
  enclosureId: -1,
  name: "",
  remark: null,
  length: 0,
  width: 0,
  height: 0,
  enclosureStatus: EnclosureStatus.ACTIVE,
  longGrassPercent: null,
  shortGrassPercent: null,
  rockPercent: null,
  sandPercent: null,
  snowPercent: null,
  soilPercent: null,
  landArea: null,
  waterArea: null,
  plantationCoveragePercent: null,
  acceptableTempMin: null,
  acceptableTempMax: null,
  acceptableHumidityMin: null,
  acceptableHumidityMax: null,
  animals: [],
  //   barrierType: null,
  //   plantation: null,
  zooEvents: [],
  //   facility: null,
  keepers: [],
  standOffBarrierDist: null,
  designDiagramJsonUrl: null
};

function AllEnclosuresDatatable() {
  const apiJson = useApiJson();

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };

  const [enclosureList, setEnclosureList] = useState<Enclosure[]>([]);
  const [selectedEnclosure, setSelectedEnclosure] =
    useState<Enclosure>(emptyEnclosure);
  const [deleteEnclosureDialog, setDeleteEnclosureDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const navigate = useNavigate();

  const dt = useRef<DataTable<Enclosure[]>>(null);

  const toastShadcn = useToast().toast;
  const employee = useAuthContext().state.user?.employeeData;

  useEffect(() => {
    const fetchEnclosures = async () => {
      try {
        const responseJson = await apiJson.get(
          "http://localhost:3000/api/enclosure/getAllEnclosures"
        );
        setEnclosureList(responseJson as Enclosure[]);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchEnclosures();
  }, []);

  // delete enclosure stuff
  const confirmDeleteEnclosure = (enclosure: Enclosure) => {
    setSelectedEnclosure(enclosure);
    setDeleteEnclosureDialog(true);
  };

  const hideDeleteEnclosureDialog = () => {
    setDeleteEnclosureDialog(false);
  };

  const deleteEnclosure = async () => {
    let _enclosures = enclosureList.filter(
      (val) => val.enclosureId !== selectedEnclosure?.enclosureId
    );

    const deleteEnclosureApi = async () => {
      try {
        const responseJson = await apiJson.del(
          "http://localhost:3000/api/enclosure/deleteEnclosure/" +
          selectedEnclosure.enclosureId
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description:
            "Successfully deleted enclosure with ID: " +
            selectedEnclosure.enclosureId,
        });
        setEnclosureList(_enclosures);
        setDeleteEnclosureDialog(false);
        setSelectedEnclosure(emptyEnclosure);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while deleting enclosure: \n" +
            apiJson.error,
        });
      }
    };
    deleteEnclosureApi();
  };

  const deleteEnclosureDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeleteEnclosureDialog}>
        <HiX className="mr-2" />
        No
      </Button>
      <Button variant={"destructive"} onClick={deleteEnclosure}>
        <HiCheck className="mr-2" />
        Yes
      </Button>
    </React.Fragment>
  );
  // end delete enclosure stuff

  const actionBodyTemplate = (enclosure: Enclosure) => {
    return (
      <React.Fragment>
        <div className="mx-auto">
          <Button
            className="mr-2"
            onClick={() => {
              navigate(
                `/enclosure/viewenclosuredetails/${enclosure.enclosureId}`
              );
            }}
          >
            <HiEye className="mr-auto" />
          </Button>
          {(employee.superAdmin ||
            employee.planningStaff?.plannerType == "CURATOR") && (
              <Button
                variant={"destructive"}
                className="mr-2"
                onClick={() => confirmDeleteEnclosure(enclosure)}
              >
                <HiTrash className="mx-auto" />
              </Button>)}
        </div>
      </React.Fragment>
    );
  };

  const imageBodyTemplate = (rowData: Enclosure) => {
    return (
      (rowData.facility ?
        <img
          src={"http://localhost:3000/" + rowData.facility.imageUrl}
          alt={rowData.name}
          className="aspect-square w-16 rounded-full border border-white object-cover shadow-4"
        /> : "-")
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Manage Enclosures</h4>
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
      <DataTable
        ref={dt}
        value={enclosureList}
        selection={selectedEnclosure}
        onSelectionChange={(e) => {
          if (Array.isArray(e.value)) {
            setSelectedEnclosure(e.value);
          }
        }}
        dataKey="enclosureId"
        paginator
        // showGridlines
        rows={25}
        scrollable
        selectionMode={"single"}
        rowsPerPageOptions={[10, 25, 50, 100]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} enclosures"
        globalFilter={globalFilter}
        header={header}
      >
        <Column
          field="imageUrl"
          header="Image"
          frozen
          body={imageBodyTemplate}
          style={{ minWidth: "6rem" }}
        ></Column>
        <Column
          field="enclosureId"
          header="ID"
          sortable
          style={{ minWidth: "4rem" }}
        ></Column>
        <Column
          field="name"
          header="Name"
          sortable
          style={{ minWidth: "6rem" }}
        ></Column>
        <Column
          field="remark"
          header="Remark(s)"
          sortable
          style={{ minWidth: "6rem" }}
        ></Column>
        {/* hidden columns so they still appear in exported excel sheet */}
        <Column
          field="enclosureStatus"
          header="Status"
          sortable
          style={{ minWidth: "6rem", display: "none" }}
        ></Column>
        {/*  */}
        <Column
          body={actionBodyTemplate}
          header="Actions"
          frozen
          alignFrozen="right"
          exportable={false}
          style={{ minWidth: "9rem" }}
        ></Column>
      </DataTable>
      <Dialog
        visible={deleteEnclosureDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteEnclosureDialogFooter}
        onHide={hideDeleteEnclosureDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedEnclosure && (
            <span>
              Are you sure you want to delete the selected enclosure, ID{" "}
              {selectedEnclosure.enclosureId}?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default AllEnclosuresDatatable;
