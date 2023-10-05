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
import { NavLink } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import Animal from "../../../models/Animal";
import {
  AcquisitionMethod,
  AnimalGrowthStage,
  AnimalSex,
} from "../../../enums/Enumurated";

let testPandaSpecies: Species = {
  speciesId: 1,
  speciesCode: "SPE001",
  commonName: "Panda",
  scientificName: "Ailuropoda Melanoleuca",
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
  imageUrl: "img/species/panda.jpg",
  generalDietPreference: "",
  lifeExpectancyYears: 0,
};

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
  lifeExpectancyYears: 0,
};
let emptyAnimal: Animal = {
  animalId: -1,
  animalCode: "",
  imageUrl: "",
  isGroup: false,
  houseName: "",
  identifierType: "",
  identifierValue: "",
  sex: AnimalSex.MALE,
  dateOfBirth: new Date(),
  placeOfBirth: "",
  acquisitionMethod: AcquisitionMethod.INHOUSE_CAPTIVE_BRED,
  dateOfAcquisition: new Date(),
  acquisitionRemarks: "",
  physicalDefiningCharacteristics: "",
  behavioralDefiningCharacteristics: "",
  dateOfDeath: null,
  locationOfDeath: null,
  causeOfDeath: null,
  growthStage: AnimalGrowthStage.ADOLESCENT,
  animalStatus: "",
  species: emptySpecies,
};

interface AnimalsBySpeciesDatatableProps {
  curAnimalList: Animal[];
  setCurAnimalList: any;
}

function AnimalsBySpeciesDatatable(props: AnimalsBySpeciesDatatableProps) {
  const apiJson = useApiJson();

  const { curAnimalList, setCurAnimalList } = props;

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };

  //   const [animalList, setAnimalList] = useState<Animal[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal>(emptyAnimal);
  const [deleteAnimalDialog, setDeleteAnimalDialog] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | Animal[]
  >([]);

  const dt = useRef<DataTable<Animal[]>>(null);

  const toastShadcn = useToast().toast;

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

  // delete animal stuff
  const confirmDeleteAnimal = (animal: Animal) => {
    setSelectedAnimal(animal);
    setDeleteAnimalDialog(true);
  };

  const hideDeleteAnimalDialog = () => {
    setDeleteAnimalDialog(false);
  };

  const deleteAnimal = async () => {
    let _animals = curAnimalList.filter(
      (val) => val.animalId !== selectedAnimal?.animalId
    );

    const deleteAnimalApi = async () => {
      try {
        const responseJson = await apiJson.del(
          "http://localhost:3000/api/animal/deleteAnimal/" +
            selectedAnimal.animalCode
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description:
            "Successfully deleted animal: " +
            selectedAnimal.houseName +
            " the " +
            selectedAnimal.species?.commonName,
        });
        setCurAnimalList(_animals);
        setDeleteAnimalDialog(false);
        setSelectedAnimal(emptyAnimal);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while deleting animal: \n" + apiJson.error,
        });
      }
    };
    deleteAnimalApi();
  };

  const deleteAnimalDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeleteAnimalDialog}>
        <HiX className="mr-2" />
        No
      </Button>
      <Button variant={"destructive"} onClick={deleteAnimal}>
        <HiCheck className="mr-2" />
        Yes
      </Button>
    </React.Fragment>
  );
  // end delete animal stuff

  const actionBodyTemplate = (animal: Animal) => {
    return (
      <React.Fragment>
        <div className="mx-auto">
          <NavLink to={`/animal/viewanimaldetails/${animal.animalCode}`}>
            <Button className="mr-2">
              <HiEye className="mr-auto" />
            </Button>
          </NavLink>
          <Button
            variant={"destructive"}
            className="mr-2"
            onClick={() => confirmDeleteAnimal(animal)}
          >
            <HiTrash className="mx-auto" />
          </Button>
        </div>
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Manage Individuals/Groups </h4>
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

  // row group stuff
  const calculateAnimalPerSpeciesTotal = (commonName: string) => {
    let total = 0;

    if (curAnimalList) {
      for (let animal of curAnimalList) {
        if (animal.species.commonName === commonName) {
          total++;
        }
      }
    }

    return total;
  };

  return (
    <div>
      <div>
        <div className="rounded-lg bg-white p-4">
          {/* Title Header and back button */}
          {/* <div className="flex flex-col">
            <div className="mb-4 flex justify-between">
              <NavLink to={"/animal/createanimal"}>
                <Button className="mr-2">
                  <HiPlus className="mr-auto" />
                </Button>
              </NavLink>
              <span className=" self-center text-title-xl font-bold">
                All Individual/Group Animals
              </span>
              <Button onClick={exportCSV}>Export to .csv</Button>
            </div>
            <Separator />
          </div> */}

          <DataTable
            ref={dt}
            value={curAnimalList}
            selection={selectedAnimal}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setSelectedAnimal(e.value);
              }
            }}
            dataKey="animalId"
            paginator
            // showGridlines
            rows={5}
            scrollable
            selectionMode={"single"}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} individual/group animals"
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
              field="houseName"
              header="House Name"
              sortable
              style={{ minWidth: "5rem" }}
            ></Column>
            <Column
              field="sex"
              header="Sex"
              sortable
              style={{ minWidth: "4rem" }}
            ></Column>
            <Column
              field="rfidTagNum"
              header="RFID Tag Number"
              sortable
              style={{ minWidth: "5rem" }}
            ></Column>
            <Column
              field="animalStatus"
              header="Animal Status"
              sortable
              style={{ minWidth: "5rem" }}
            ></Column>
            <Column
              field="location"
              header="Current Location"
              sortable
              style={{ minWidth: "5rem" }}
            ></Column>
            <Column
              field="age"
              header="Animal Age"
              sortable
              style={{ minWidth: "5rem" }}
            ></Column>
            <Column
              body={(animal) => {
                return new Date(animal.dateOfBirth).toLocaleDateString(
                  "en-SG",
                  dateOptions
                );
              }}
              field="dateOfBirth"
              header="Date of Birth"
              sortable
              style={{ minWidth: "7rem" }}
            ></Column>
            <Column
              field="placeOfBirth"
              header="Place of Birth"
              sortable
              style={{ minWidth: "7rem" }}
            ></Column>
            {/* below hidden columns is so that you can search by species name */}
            <Column
              field="species.commonName"
              header="Species"
              sortable
              style={{ display: "none" }}
            ></Column>
            <Column
              field="species.scientificName"
              header="Species Scientific Name"
              sortable
              style={{ display: "none" }}
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
        </div>
      </div>
      <Dialog
        visible={deleteAnimalDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteAnimalDialogFooter}
        onHide={hideDeleteAnimalDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedAnimal && (
            <span>
              Are you sure you want to delete{" "}
              <b>
                {selectedAnimal.houseName} the{" "}
                {selectedAnimal.species?.commonName}
              </b>
              ?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default AnimalsBySpeciesDatatable;
