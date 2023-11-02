import React, { useEffect, useState, useRef } from "react";

import { classNames } from "primereact/utils";
import { DataTable, DataTableExpandedRows } from "primereact/datatable";
import { Column } from "primereact/column";
// import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";

import Species from "../../../models/Species";
import useApiJson from "../../../hooks/useApiJson";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { HiCheck, HiEye, HiPencil, HiPlus, HiTrash, HiX } from "react-icons/hi";

import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import Animal from "../../../models/Animal";
import {
  AcquisitionMethod,
  AnimalGrowthStage,
  AnimalSex,
  EnclosureStatus,
} from "../../../enums/Enumurated";
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
  Keeper: [],
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
          <Button
            variant={"destructive"}
            className="mr-2"
            onClick={() => confirmDeleteEnclosure(enclosure)}
          >
            <HiTrash className="mx-auto" />
          </Button>
        </div>
      </React.Fragment>
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
        {/* <Column
    field="imageUrl"
    header="Image"
    frozen
    body={imageBodyTemplate}
    style={{ minWidth: "6rem" }}
  ></Column> */}
        <Column
          field="animalCode"
          header="Code"
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