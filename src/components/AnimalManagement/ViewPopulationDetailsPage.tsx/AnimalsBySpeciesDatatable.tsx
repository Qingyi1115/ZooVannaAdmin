import React, { useRef, useState } from "react";

import { Column } from "primereact/column";
import { DataTable, DataTableExpandedRows } from "primereact/datatable";
// import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import { HiCheck, HiEye, HiTrash, HiX } from "react-icons/hi";
import useApiJson from "../../../hooks/useApiJson";
import Species from "../../../models/Species";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { NavLink } from "react-router-dom";
import {
  AcquisitionMethod,
  AnimalGrowthStage,
  AnimalSex,
} from "../../../enums/Enumurated";
import beautifyText from "../../../hooks/beautifyText";
import Animal from "../../../models/Animal";

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
  function calculateAge(dateOfBirth: Date): string {
    const dob = dateOfBirth;
    const todayDate = new Date();

    // Calculate the difference in milliseconds between the two dates
    const ageInMilliseconds = todayDate.getTime() - dob.getTime();

    // Convert milliseconds to years (assuming an average year has 365.25 days)
    const ageInYears = ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000);

    // Calculate the remaining months
    const ageInMonths = (ageInYears - Math.floor(ageInYears)) * 12;

    // Format the result as "x years & y months"
    const formattedAge = `${Math.floor(ageInYears)} years & ${Math.floor(
      ageInMonths
    )} months`;

    return formattedAge;
  }

  //
  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const imageBodyTemplate = (rowData: Species) => {
    return (
      (rowData.imageUrl ?
        <img
          src={"http://localhost:3000/" + rowData.imageUrl}
          alt={rowData.commonName}
          className="aspect-square w-16 rounded-full border border-white object-cover shadow-4"
        /> : "-")
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

  const statusTemplate = (animal: Animal) => {
    const statuses = animal.animalStatus.split(",");

    return (
      <React.Fragment>
        <div className="flex flex-col gap-1">
          {statuses.map((status, index) => (
            <div
              key={index}
              className={
                status === "NORMAL"
                  ? "flex items-center justify-center rounded bg-emerald-100 p-[0.1rem] text-sm font-bold text-emerald-900"
                  : status === "PREGNANT"
                    ? "flex items-center justify-center rounded bg-orange-100 p-[0.1rem] text-sm font-bold text-orange-900"
                    : status === "SICK"
                      ? "flex items-center justify-center rounded bg-yellow-100 p-[0.1rem] text-sm font-bold text-yellow-900"
                      : status === "INJURED"
                        ? "flex items-center justify-center rounded bg-red-100 p-[0.1rem] text-sm font-bold text-red-900"
                        : status === "OFFSITE"
                          ? "flex items-center justify-center rounded bg-blue-100 p-[0.1rem] text-sm font-bold text-blue-900"
                          : status === "RELEASED"
                            ? "flex items-center justify-center rounded bg-fuchsia-100 p-[0.1rem] text-sm font-bold text-fuchsia-900"
                            : status === "DECEASED"
                              ? "flex items-center justify-center rounded bg-slate-300 p-[0.1rem] text-sm font-bold text-slate-900"
                              : "bg-gray-100 flex items-center justify-center rounded p-[0.1rem] text-sm font-bold text-black"
              }
            >
              {status}
            </div>
          ))}
        </div>
      </React.Fragment>
    );
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
              body={statusTemplate}
              // field="animalStatus"
              header="Animal Status"
              sortable
              style={{ minWidth: "5rem" }}
            ></Column>
            <Column
              body={(animal) => {
                return animal.sex == "" || animal.sex == null ? (
                  <span className="flex justify-center ">—</span>
                ) : (
                  beautifyText(animal.sex)
                );
              }}
              field="sex"
              header="Sex"
              sortable
              style={{ minWidth: "4rem" }}
            ></Column>
            <Column
              body={(animal) => {
                return animal.identifierType == "" ||
                  animal.identifierType == null ? (
                  <span className="flex justify-center">—</span>
                ) : (
                  animal.identifierType
                );
              }}
              field="identifierType"
              header="Identifier Type"
              sortable
              style={{ minWidth: "5rem" }}
            ></Column>
            <Column
              body={(animal) => {
                return animal.identifierValue == "" ||
                  animal.identifierValue == null ? (
                  <span className="flex justify-center">—</span>
                ) : (
                  animal.identifierValue
                );
              }}
              field="identifierValue"
              header="Identifier Value"
              sortable
              style={{ minWidth: "5rem" }}
            ></Column>
            <Column
              body={(animal) => {
                if (!animal.location || animal.location == "") {
                  return <span className="flex justify-center">—</span>;
                } else {
                  return animal.location;
                }
              }}
              // field="location"
              header="Current Location"
              sortable
              style={{ minWidth: "5rem" }}
            ></Column>
            <Column
              body={(animal) => {
                let calculatedAge = calculateAge(new Date(animal.dateOfBirth));
                return animal.dateOfBirth == null ? (
                  <span className="flex justify-center">—</span>
                ) : (
                  calculatedAge
                );
              }}
              header="Animal Age"
              sortable
              style={{ minWidth: "5rem" }}
            ></Column>
            <Column
              body={(animal) => {
                return animal.dateOfBirth == null ? (
                  <span className="flex justify-center">—</span>
                ) : (
                  new Date(animal.dateOfBirth).toLocaleDateString(
                    "en-SG",
                    dateOptions
                  )
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
