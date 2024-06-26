import React, { useEffect, useRef, useState } from "react";
import Enclosure from "../../../models/Enclosure";

import { Column } from "primereact/column";
import { DataTable, DataTableExpandedRows } from "primereact/datatable";

import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import useApiJson from "../../../hooks/useApiJson";

import Animal from "../../../models/Animal";
import Species from "../../../models/Species";

import { Button } from "@/components/ui/button";
import { Checkbox, CheckboxClickEvent } from "primereact/checkbox";
import { HiCheck, HiEye, HiX } from "react-icons/hi";
import {
  AcquisitionMethod,
  AnimalGrowthStage,
  AnimalSex,
} from "../../../enums/Enumurated";
import { useAuthContext } from "../../../hooks/useAuthContext";

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

interface EnclosureAnimalDatatableProps {
  curEnclosure: Enclosure;
  animalList: Animal[];
  setAnimalList: any;
  refreshSeed: number;
  setRefreshSeed: any;
}
function EnclosureAnimalDatatable(props: EnclosureAnimalDatatableProps) {
  const apiJson = useApiJson();

  const {
    curEnclosure,
    animalList,
    setAnimalList,
    refreshSeed,
    setRefreshSeed,
  } = props;
  const [speciesCodeSet, setSpeciesCodeSet] = useState<Set<string>>(new Set());
  const [allSpeciesCodeSet, setAllSpeciesCodeSet] = useState<Set<string>>(
    new Set()
  );
  // hashmap to store species compatibilities
  // const [speciesCompatibilityMap, setSpeciesCompatibilityMap] = useState<{
  //   [code: string]: boolean;
  // }>({});
  const [speciesCompatibilityMap, setSpeciesCompatibilityMap] = useState<
    Map<string, boolean>
  >(new Map());

  useEffect(() => {
    const newSpeciesCodeSet = new Set<string>();

    animalList.forEach((animal) => {
      if (animal.species && animal.species.speciesCode) {
        newSpeciesCodeSet.add(animal.species.speciesCode);
      }
    });

    setSpeciesCodeSet(newSpeciesCodeSet);
  }, [animalList]);

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };

  // useeffect to populate compatibilities
  useEffect(() => {
    const tempCompatibilityMap = new Map<string, boolean>();
    allSpeciesCodeSet.forEach(async (speciesCode) => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/enclosure/getSpeciesCompatibilityInEnclosure/${curEnclosure.enclosureId}/${speciesCode}`
        );
        const isSpeciesCompatibleWithEnclosure =
          responseJson.isCompatible as boolean;
        // console.log("check compatibility, " + speciesCode);
        // console.log(isSpeciesCompatibleWithEnclosure);
        tempCompatibilityMap.set(speciesCode, isSpeciesCompatibleWithEnclosure);
        // setSpeciesCompatibilityMap((prevCompatibilityMap) => ({
        //   ...prevCompatibilityMap,
        //   [speciesCode]: isSpeciesCompatibleWithEnclosure,
        // }));
      } catch (error: any) {
        console.log(error);
      }
    });
    // console.log("tempmap");
    // console.log(tempCompatibilityMap);
    setSpeciesCompatibilityMap(tempCompatibilityMap);
  }, [speciesCodeSet]);

  //   const [animalList, setAnimalList] = useState<Animal[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal>(emptyAnimal);
  const [removeAnimalDialog, setRemoveAnimalDialog] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const navigate = useNavigate();

  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | Animal[]
  >([]);

  // add animal vars
  const [animalBulkAssignmentDialog, setAnimalBulkAssignmentDialog] =
    useState<boolean>(false);
  const [availableAnimals, setAvailableAnimals] = useState<Animal[]>([]);
  const [selectedAvailableAnimals, setSelectedAvailableAnimals] = useState<
    Animal[]
  >([]);
  const [animalAssignmentDialog, setAnimalAssignmentDialog] =
    useState<boolean>(false);
  const [isCompatibleOnlyFilter, setIsCompatibleOnlyFilter] = useState<
    boolean | undefined
  >(false);
  //

  const dt = useRef<DataTable<Animal[]>>(null);
  const employee = useAuthContext().state.user?.employeeData;
  const toastShadcn = useToast().toast;

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

  // remove animal stuff
  const confirmRemoveAnimal = (animal: Animal) => {
    setSelectedAnimal(animal);
    setRemoveAnimalDialog(true);
  };

  const hideRemoveAnimalDialog = () => {
    setRemoveAnimalDialog(false);
  };

  const removeAnimal = async () => {
    let _animals = animalList.filter(
      (val) => val.animalId !== selectedAnimal?.animalId
    );

    const removeAnimalApiObj = {
      enclosureId: curEnclosure.enclosureId,
      animalCode: selectedAnimal.animalCode,
    };

    const removeAnimalApi = async () => {
      console.log(selectedAnimal.animalCode);
      try {
        const responseJson = await apiJson.put(
          "http://localhost:3000/api/enclosure/removeAnimalFromEnclosure/",
          removeAnimalApiObj
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description:
            "Successfully removed animal: " +
            selectedAnimal.houseName +
            " the " +
            selectedAnimal.species?.commonName +
            "from the enclosure",
        });
        setAnimalList(_animals);
        setRemoveAnimalDialog(false);
        setSelectedAnimal(emptyAnimal);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while removing animal: \n" + apiJson.error,
        });
      }
    };
    removeAnimalApi();
  };

  const removeAnimalDialogFooter = (
    <React.Fragment>
      <Button onClick={hideRemoveAnimalDialog}>
        <HiX className="mr-2" />
        No
      </Button>
      <Button variant={"destructive"} onClick={removeAnimal}>
        <HiCheck className="mr-2" />
        Yes
      </Button>
    </React.Fragment>
  );
  // end remove animal stuff

  const actionBodyTemplate = (animal: Animal) => {
    return (
      <React.Fragment>
        <div className="mx-auto">
          <Button
            className="mr-2"
            onClick={() => {
              // navigate(`/animal/viewallanimals`, { replace: true });
              navigate(`/animal/viewanimaldetails/${animal.animalCode}`);
            }}
          >
            <HiEye className="mr-auto" />
          </Button>
          {(employee.superAdmin ||
            employee.planningStaff?.plannerType == "CURATOR" ||
            employee.keeper) && (
            <Button
              variant={"destructive"}
              className="mr-2"
              onClick={() => confirmRemoveAnimal(animal)}
            >
              <HiX className="mx-auto" />
            </Button>
          )}
        </div>
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      {/* <h4 className="m-1">Manage Individuals/Groups </h4> */}
      {(employee.superAdmin ||
        employee.planningStaff?.plannerType == "CURATOR" ||
        employee.keeper) && (
        <Button
          onClick={() => setAnimalBulkAssignmentDialog(true)}
          disabled={availableAnimals.length == 0}
        >
          Add Animal To Enclosure
        </Button>
      )}
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

    if (animalList) {
      for (let animal of animalList) {
        if (animal.species.commonName === commonName) {
          total++;
        }
      }
    }

    return total;
  };

  const rowGroupHeaderTemplate = (animal: Animal) => {
    return (
      <React.Fragment>
        <span className="flex justify-between">
          <span className="flex items-center gap-4 ">
            <img
              alt={animal.species?.commonName}
              src={"http://localhost:3000/" + animal.species?.imageUrl}
              className="aspect-square w-10 rounded-full border border-white object-cover shadow-4"
            />
            <span className="text-lg font-bold">
              {animal.species.commonName} ({animal.species.speciesCode})
            </span>
          </span>
          <div>{/* anything on the right side of row group header here */}</div>
        </span>
      </React.Fragment>
    );
  };

  // function isSpeciesCompatibleWithEnclosure(speciesCode: string) {
  //   // fetch species compatibility or smthing
  //   const fetchCheckCompatibility = async () => {
  //     try {
  //       const responseJson = await apiJson.get(
  //         `http://localhost:3000/api/enclosure/getSpeciesCompatibilityInEnclosure/${curEnclosure.enclosureId}/${speciesCode}`
  //       );
  //       const isSpeciesCompatibleWithEnclosure =
  //         responseJson.isCompatible as boolean;
  //       return isSpeciesCompatibleWithEnclosure;
  //     } catch (error: any) {
  //       console.log(error);
  //     }
  //   };
  //   return fetchCheckCompatibility();
  //   // const isCompatible = await fetchCheckCompatibility();
  //   // return false;
  // }

  const assignAnimalRowGroupHeaderTemplate = (animal: Animal) => {
    // const [isCompatible, setIsCompatible] = useState<boolean | undefined>(
    //   undefined
    // );

    // useEffect(() => {
    //   const fetchCheckCompatibility = async () => {
    //     try {
    //       const responseJson = await apiJson.get(
    //         `http://localhost:3000/api/enclosure/getSpeciesCompatibilityInEnclosure/${curEnclosure.enclosureId}/${animal.species.speciesCode}`
    //       );
    //       const isSpeciesCompatibleWithEnclosure =
    //         responseJson.isCompatible as boolean;
    //       setIsCompatible(isSpeciesCompatibleWithEnclosure);
    //     } catch (error: any) {
    //       console.log(error);
    //     }
    //   };
    //   fetchCheckCompatibility();
    // }, [animal]);

    return (
      <React.Fragment>
        <span className="flex justify-between">
          <span className="flex items-center gap-4 ">
            <img
              alt={animal.species?.commonName}
              src={"http://localhost:3000/" + animal.species?.imageUrl}
              className="aspect-square w-10 rounded-full border border-white object-cover shadow-4"
            />
            <span className="text-lg font-bold">
              {animal.species.commonName} ({animal.species.speciesCode})
            </span>
            {speciesCompatibilityMap.get(animal.species.speciesCode) !=
              undefined &&
            speciesCompatibilityMap.get(animal.species.speciesCode) == true ? (
              <span className="flex items-center justify-center rounded bg-emerald-100 p-[0.1rem] px-2 text-base font-bold text-emerald-900">
                COMPATIBLE
              </span>
            ) : speciesCompatibilityMap.get(animal.species.speciesCode) !=
                undefined &&
              speciesCompatibilityMap.get(animal.species.speciesCode) ==
                false ? (
              <span className="flex items-center justify-center rounded bg-red-100 p-[0.1rem] px-2 text-base font-bold text-red-900">
                INCOMPATIBLE
              </span>
            ) : (
              <span className="flex items-center justify-center rounded bg-red-100 p-[0.1rem] px-2 text-base font-bold text-red-900"></span>
            )}
          </span>
          <div>{/* anything on the right side of row group header here */}</div>
        </span>
      </React.Fragment>
    );
  };

  const rowGroupFooterTemplate = (animal: Animal) => {
    return (
      <React.Fragment>
        <td colSpan={10}>
          <div className="justify-content-end flex w-full font-bold">
            Total {animal.species.commonName}:{" "}
            {calculateAnimalPerSpeciesTotal(animal.species.commonName)}
          </div>
        </td>
      </React.Fragment>
    );
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

  // add animal stuff

  useEffect(() => {
    const fetchAvailableAnimals = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/animal/getAllAnimals`
        );
        const allAnimalsList = responseJson as Animal[];

        // set speciesCodeSet
        const tempAllSpeciesCodeSet = new Set<string>();
        allAnimalsList.forEach((animal) => {
          tempAllSpeciesCodeSet.add(animal.species.speciesCode);
        });
        setAllSpeciesCodeSet(tempAllSpeciesCodeSet);

        // console.log("haha");
        // console.log(animalList);
        const availableAnimalsList = allAnimalsList.filter(
          (animal) =>
            !animalList.some(
              (existingAnimal) =>
                existingAnimal.animalCode === animal.animalCode
            )
        );
        let availableAnimalsListFilterdCompatibility = availableAnimalsList;
        if (isCompatibleOnlyFilter) {
          availableAnimalsListFilterdCompatibility =
            availableAnimalsListFilterdCompatibility.filter(async (animal) => {
              const responseJson = await apiJson.get(
                `http://localhost:3000/api/enclosure/getSpeciesCompatibilityInEnclosure/${curEnclosure.enclosureId}/${animal.species.speciesCode}`
              );
              const isSpeciesCompatibleWithEnclosure =
                responseJson.isCompatible as boolean;
              return isSpeciesCompatibleWithEnclosure;
            });
        }
        setAvailableAnimals(availableAnimalsListFilterdCompatibility);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchAvailableAnimals();
  }, [animalList, isCompatibleOnlyFilter]);

  const hideAnimalBulkAssignmentDialog = () => {
    setAnimalBulkAssignmentDialog(false);
  };

  const bulkAssignmentHeader = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      {/* <h4 className="m-1">Manage Maintenance Staff</h4> */}
      <div>
        <Checkbox
          onChange={(e) => setIsCompatibleOnlyFilter(e.checked)}
          checked={isCompatibleOnlyFilter ? isCompatibleOnlyFilter : false}
          className="mr-2"
        ></Checkbox>
        <span>Compatible Only</span>
      </div>
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

      {/* <Button onClick={exportCSV}>Export to .csv</Button> */}
    </div>
  );

  const onSelectedAvailableAnimalsOnClick = (e: CheckboxClickEvent) => {
    let _selectedAvailableAnimals = [...selectedAvailableAnimals];
    if (e.checked) {
      _selectedAvailableAnimals.push(e.value);
    } else {
      _selectedAvailableAnimals.splice(
        _selectedAvailableAnimals.indexOf(e.value),
        1
      );
    }
    setSelectedAvailableAnimals(_selectedAvailableAnimals);
  };

  const availableAnimalCheckbox = (animal: Animal) => {
    return (
      <React.Fragment>
        <div className="mb-4 flex">
          <Checkbox
            name="toAssignAnimals"
            value={animal}
            onChange={onSelectedAvailableAnimalsOnClick}
            checked={selectedAvailableAnimals.includes(animal)}
          ></Checkbox>
        </div>
      </React.Fragment>
    );
  };

  const hideAnimalAssignmentDialog = () => {
    setAnimalAssignmentDialog(false);
  };

  const confirmAssignment = () => {
    setAnimalAssignmentDialog(true);
  };

  const bulkAssignAnimals = async () => {
    selectedAvailableAnimals.forEach(async (animal) => {
      try {
        const assignAnimalApiObj = {
          enclosureId: curEnclosure.enclosureId,
          animalCode: animal.animalCode,
        };
        const responseJson = await apiJson
          .put(
            `http://localhost:3000/api/enclosure/assignAnimalToEnclosure/`,
            assignAnimalApiObj
          )
          .then((res) => {
            setRefreshSeed([]);
          })
          .catch((err) => console.log("err", err));

        toastShadcn({
          title: "Assignment Successful",
          description: "Successfully assigned selected animals ",
        });
        setAnimalAssignmentDialog(false);
        setAnimalBulkAssignmentDialog(false);
        setSelectedAvailableAnimals([]);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while assigning animals: \n" + apiJson.error,
        });
      }
    });
  };

  const animalAssignmentDialogFooter = (
    <React.Fragment>
      <Button variant={"destructive"} onClick={hideAnimalAssignmentDialog}>
        <HiX />
        No
      </Button>
      <Button onClick={bulkAssignAnimals}>
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>
  );

  return (
    <div>
      <DataTable
        ref={dt}
        value={animalList}
        selection={selectedAnimal}
        onSelectionChange={(e) => {
          if (Array.isArray(e.value)) {
            setSelectedAnimal(e.value);
          }
        }}
        dataKey="animalId"
        rowGroupMode="subheader"
        // expandableRowGroups
        // expandedRows={expandedRows}
        // onRowToggle={(e) => setExpandedRows(e.data)}
        groupRowsBy="species.commonName"
        rowGroupHeaderTemplate={rowGroupHeaderTemplate}
        rowGroupFooterTemplate={rowGroupFooterTemplate}
        paginator
        // showGridlines
        rows={25}
        scrollable
        selectionMode={"single"}
        rowsPerPageOptions={[10, 25, 50, 100]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} individual/group animals"
        globalFilter={globalFilter}
        header={header}
        sortField={"species.commonName"}
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
              animal.sex
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
          field="age"
          header="Animal Age"
          sortable
          style={{ minWidth: "5rem" }}
        ></Column>
        {/* hidden columns so they still appear in exported excel sheet */}
        <Column
          field="growthStage"
          header="Growth Stage"
          sortable
          style={{ minWidth: "7rem", display: "none" }}
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
          style={{ minWidth: "7rem", display: "none" }}
        ></Column>
        <Column
          field="placeOfBirth"
          header="Place of Birth"
          sortable
          style={{ minWidth: "7rem", display: "none" }}
        ></Column>
        <Column
          body={(animal) => {
            return new Date(animal.dateOfAcquisition).toLocaleDateString(
              "en-SG",
              dateOptions
            );
          }}
          field="dateOfAcquisition"
          header="Date of Acquisition"
          sortable
          style={{ minWidth: "7rem", display: "none" }}
        ></Column>
        <Column
          field="acquisitionMethod"
          header="Acquisition Method"
          sortable
          style={{ minWidth: "7rem", display: "none" }}
        ></Column>
        <Column
          field="acquisitionRemarks"
          header="Acquisition Remarks"
          sortable
          style={{ minWidth: "7rem", display: "none" }}
        ></Column>
        <Column
          field="physicalDefiningCharacteristics"
          header="Physical Defining Characteristics"
          sortable
          style={{ minWidth: "7rem", display: "none" }}
        ></Column>
        <Column
          field="behavioralDefiningCharacteristics"
          header="Behavioral Defining Characteristics"
          sortable
          style={{ minWidth: "7rem", display: "none" }}
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
      </DataTable>{" "}
      <Dialog
        visible={removeAnimalDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={removeAnimalDialogFooter}
        onHide={hideRemoveAnimalDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedAnimal && (
            <span>
              Are you sure you want to remove{" "}
              <b>
                {selectedAnimal.houseName} the{" "}
                {selectedAnimal.species?.commonName}
              </b>{" "}
              from the current enclosure?
            </span>
          )}
        </div>
      </Dialog>
      {/* Dialogs to add animal */}
      <Dialog
        visible={animalAssignmentDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={animalAssignmentDialogFooter}
        onHide={hideAnimalAssignmentDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedAnimal && (
            <span>
              Are you sure you want to assign the selected animals to the
              current enclosure?
            </span>
          )}
          <div className="mt-2 font-medium text-red-800">
            Note: Animals that are not compatible with added animals will{" "}
            <span className="underline">still be added</span>
          </div>
        </div>
      </Dialog>
      <Dialog
        visible={animalBulkAssignmentDialog}
        style={{ width: "50vw", height: "70vh" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Assign Animal"
        footer={
          <Button
            onClick={confirmAssignment}
            disabled={selectedAvailableAnimals.length == 0}
          >
            Assign Selected Animal
          </Button>
        }
        onHide={hideAnimalBulkAssignmentDialog}
      >
        <div className="confirmation-content">
          <DataTable
            ref={dt}
            value={availableAnimals}
            selection={selectedAnimal}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setSelectedAnimal(e.value);
              }
            }}
            dataKey="animalCode"
            rowGroupMode="subheader"
            groupRowsBy="species.commonName"
            rowGroupHeaderTemplate={assignAnimalRowGroupHeaderTemplate}
            paginator
            rows={10}
            scrollable
            selectionMode={"single"}
            // rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} animals"
            globalFilter={globalFilter}
            header={bulkAssignmentHeader}
          >
            <Column
              body={availableAnimalCheckbox}
              //   header={allAvailableAnimalsCheckbox}
            ></Column>
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
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="species.commonName"
              header="Species"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            {/* <Column
              body={availableActionBodyTemplate}
              header="Actions"
              frozen
              alignFrozen="right"
              exportable={false}
            ></Column> */}
          </DataTable>
        </div>
      </Dialog>
    </div>
  );
}

export default EnclosureAnimalDatatable;
