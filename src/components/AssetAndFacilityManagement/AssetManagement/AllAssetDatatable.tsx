import React, { useEffect, useState, useRef } from "react";

import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { ProductService } from './service/ProductService';
import { Toast } from "primereact/toast";
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
import { HiCheck, HiPencil, HiTrash, HiX } from "react-icons/hi";

import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

function AllSpeciesDatatable() {
  const apiJson = useApiJson();

  let emptySpecies: Species = {
    speciesId: -1,
    speciesCode: "",
    commonName: "",
    scientificName: "",
    aliasName: "",
    conservationStatus: "",
    domain: "",
    kingdom: "",
    phylum: "",
    speciesClass: "",
    order: "",
    family: "",
    genus: "",
    nativeContinent: "",
    nativeBiomes: "",
    educationalDescription: "",
    groupSexualDynamic: "",
    habitatOrExhibit: "habitat",
    imageUrl: "",
    generalDietPreference: "",
  };

  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<Species>(emptySpecies);
  const [deleteSpeciesDialog, setDeleteSpeciesDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Species[]>>(null);

  useEffect(() => {
    apiJson.get("http://localhost:3000/api/species/getallspecies");
  }, []);

  useEffect(() => {
    const speciesData = apiJson.result as Species[];
    setSpeciesList(speciesData);
  }, [apiJson.loading]);

  //
  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const rightToolbarTemplate = () => {
    return <Button onClick={exportCSV}>Export to .csv</Button>;
  };

  const imageBodyTemplate = (rowData: Species) => {
    return (
      <img
        src={rowData.imageUrl}
        alt={rowData.commonName}
        className="border-round shadow-2"
        style={{ width: "64px" }}
      />
    );
  };

  const navigateEditProduct = (species: Species) => {};

  const confirmDeleteSpecies = (species: Species) => {
    setSelectedSpecies(species);
    setDeleteSpeciesDialog(true);
  };

  const hideDeleteSpeciesDialog = () => {
    setDeleteSpeciesDialog(false);
  };

  // delete species stuff
  const deleteSpecies = () => {
    let _species = speciesList.filter(
      (val) => val.speciesId !== selectedSpecies?.speciesId
    );

    setSpeciesList(_species);
    setDeleteSpeciesDialog(false);
    setSelectedSpecies(emptySpecies);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "Species Deleted",
      life: 3000,
    });
  };

  const deleteSpeciesDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeleteSpeciesDialog}>
        <HiX />
        No
      </Button>
      <Button variant={"destructive"} onClick={deleteSpecies}>
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>
  );
  // end delete species stuff

  const actionBodyTemplate = (species: Species) => {
    return (
      <React.Fragment>
        <NavLink to={`/species/editspecies/${species.speciesCode}`}>
          <Button className="mr-2">
            <HiPencil />
            <span>Edit</span>
          </Button>
        </NavLink>
        <Button
          variant={"destructive"}
          className="mr-2"
          onClick={() => confirmDeleteSpecies(species)}
        >
          <HiTrash />
          <span>Delete</span>
        </Button>
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Manage Species</h4>
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
            value={speciesList}
            selection={selectedSpecies}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setSelectedSpecies(e.value);
              }
            }}
            dataKey="speciesId"
            paginator
            rows={10}
            selectionMode={"single"}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} species"
            globalFilter={globalFilter}
            header={header}
          >
            <Column
              field="speciesCode"
              header="Code"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="imageUrl"
              header="Image"
              body={imageBodyTemplate}
            ></Column>
            <Column
              field="commonName"
              header="Common Name"
              sortable
              style={{ minWidth: "16rem" }}
            ></Column>
            <Column
              field="generalDietPreference"
              header="General Diet Preference"
              sortable
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="conservationStatus"
              header="Conservation Status"
              sortable
              style={{ minWidth: "16rem" }}
            ></Column>
            <Column
              field="aliasName"
              header="Alias Name"
              sortable
              style={{ minWidth: "16rem" }}
            ></Column>

            <Column
              field="scientificName"
              header="Scientific Name"
              sortable
              style={{ minWidth: "16rem" }}
            ></Column>
            <Column
              field="domain"
              header="Domain"
              sortable
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="kingdom"
              header="Kingdom"
              sortable
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="phylum"
              header="Phylum"
              sortable
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="speciesClass"
              header="Class"
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="order"
              header="Order"
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="family"
              header="Family"
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="genus"
              header="Genus"
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="nativeContinent"
              header="Native Continent"
              sortable
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="nativeBiomes"
              header="Native Biomes"
              sortable
              style={{ minWidth: "16rem" }}
            ></Column>
            <Column
              field="groupSexualDynamic"
              header="Group Sexual Dynamic"
              sortable
              style={{ minWidth: "16rem" }}
            ></Column>
            <Column
              field="habitatOrExhibit"
              header="Habitat or Exhibit"
              sortable
              style={{ minWidth: "10rem" }}
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
        visible={deleteSpeciesDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteSpeciesDialogFooter}
        onHide={hideDeleteSpeciesDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedSpecies && (
            <span>
              Are you sure you want to delete{" "}
              <b>{selectedSpecies.commonName}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default AllSpeciesDatatable;
