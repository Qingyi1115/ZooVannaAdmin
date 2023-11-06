import React, { useEffect, useRef, useState } from "react";

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
// import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import { HiCheck, HiEye, HiPlus, HiTrash, HiX } from "react-icons/hi";
import useApiJson from "../../../hooks/useApiJson";
import Species from "../../../models/Species";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { NavLink } from "react-router-dom";
import beautifyText from "../../../hooks/beautifyText";

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
    educationalFunFact: "",
    groupSexualDynamic: "",
    habitatOrExhibit: "habitat",
    imageUrl: "",
    generalDietPreference: "",
    ageToJuvenile: 0,
    ageToAdolescent: 1,
    ageToAdult: 2,
    ageToElder: 3,
    lifeExpectancyYears: 0,
  };

  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<Species>(emptySpecies);
  const [deleteSpeciesDialog, setDeleteSpeciesDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const dt = useRef<DataTable<Species[]>>(null);

  const toastShadcn = useToast().toast;

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const responseJson = await apiJson.get(
          "http://localhost:3000/api/species/getallspecies"
        );
        setSpeciesList(responseJson as Species[]);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchSpecies();
  }, []);

  //
  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const imageBodyTemplate = (rowData: Species) => {
    return (
      <img
        src={"http://localhost:3000/" + rowData.imageUrl}
        alt={rowData.commonName}
        className="aspect-square w-16 rounded-full border border-white object-cover shadow-4"
      />
    );
  };

  const navigateEditProduct = (species: Species) => { };

  const confirmDeleteSpecies = (species: Species) => {
    setSelectedSpecies(species);
    setDeleteSpeciesDialog(true);
  };

  const hideDeleteSpeciesDialog = () => {
    setDeleteSpeciesDialog(false);
  };

  // delete species stuff
  const deleteSpecies = async () => {
    let _species = speciesList.filter(
      (val) => val.speciesId !== selectedSpecies?.speciesId
    );

    const selectedSpeciesCommonName = selectedSpecies.commonName;

    const deleteSpeciesApi = async () => {
      try {
        const responseJson = await apiJson.del(
          "http://localhost:3000/api/species/deletespecies/" +
          selectedSpecies.speciesCode
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description:
            "Successfully deleted species: " + selectedSpeciesCommonName,
        });
        setSpeciesList(_species);
        setDeleteSpeciesDialog(false);
        setSelectedSpecies(emptySpecies);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while deleting species: \n" + apiJson.error,
        });
      }
    };
    deleteSpeciesApi();
  };

  const deleteSpeciesDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeleteSpeciesDialog}>
        <HiX className="mr-2" />
        No
      </Button>
      <Button variant={"destructive"} onClick={deleteSpecies}>
        <HiCheck className="mr-2" />
        Yes
      </Button>
    </React.Fragment>
  );
  // end delete species stuff

  const actionBodyTemplate = (species: Species) => {
    return (
      <React.Fragment>
        <div className="mx-auto">
          <NavLink to={`/species/viewspeciesdetails/${species.speciesCode}`}>
            <Button className="mr-2">
              <HiEye className="mr-auto" />
            </Button>
          </NavLink>
          <Button
            variant={"destructive"}
            className="mr-2"
            onClick={() => confirmDeleteSpecies(species)}
          >
            <HiTrash className="mx-auto" />
          </Button>
        </div>
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
        <div className="rounded-lg bg-white p-4">
          {/* Title Header and back button */}
          <div className="flex flex-col">
            <div className="mb-4 flex justify-between">
              <NavLink to={"/species/createspecies"}>
                <Button className="mr-2">
                  <HiPlus className="mr-auto" />
                  Add Species
                </Button>
              </NavLink>
              <span className=" self-center text-title-xl font-bold">
                All Species
              </span>
              <Button onClick={exportCSV}>Export to .csv</Button>
            </div>
            <Separator />
          </div>

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
            // showGridlines
            rows={10}
            scrollable
            selectionMode={"single"}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} species"
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
              field="speciesCode"
              header="Code"
              sortable
              style={{ minWidth: "7rem" }}
            ></Column>
            <Column
              field="commonName"
              header="Common Name"
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
              field="conservationStatus"
              header="Conservation Status"
              body={(species: Species) => beautifyText(species.conservationStatus)}
              sortable
              style={{ minWidth: "16rem" }}
            ></Column>
            <Column
              field="generalDietPreference"
              header="General Diet Preference"
              sortable
              style={{ minWidth: "10rem" }}
            ></Column>

            {/* <Column
              field="aliasName"
              header="Alias Name"
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
            ></Column> */}
            <Column
              field="habitatOrExhibit"
              header="Habitat or Exhibit"
              sortable
              style={{ minWidth: "10rem" }}
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
