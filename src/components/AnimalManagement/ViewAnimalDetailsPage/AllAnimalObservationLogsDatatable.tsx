import { DataTable } from "primereact/datatable";
import React, { useEffect, useRef, useState } from "react";
// import { ProductService } from './service/ProductService';
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { HiCheck, HiEye, HiPlus, HiTrash, HiX } from "react-icons/hi";
import useApiJson from "../../../hooks/useApiJson";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Column } from "primereact/column";
import { DropdownChangeEvent } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import AnimalActivity from "src/models/AnimalActivity";
import {
  AcquisitionMethod,
  ActivityType,
  AnimalGrowthStage,
  AnimalSex,
  EventTimingType,
  KeeperType,
  RecurringPattern,
  Specialization,
} from "../../../enums/Enumurated";
import { Rating } from "../../../enums/Rating";
import beautifyText from "../../../hooks/beautifyText";
import { useAuthContext } from "../../../hooks/useAuthContext";
import Animal from "../../../models/Animal";
import AnimalObservationLog from "../../../models/AnimalObservationLog";
import Employee from "../../../models/Employee";
import Keeper from "../../../models/Keeper";
import Species from "../../../models/Species";

interface AllAnimalObservationLogsDatatableProps {
  speciesCode: string;
  animalCode: string;
  animalActivityId: number;
}

function AllAnimalObservationLogsDatatable(
  props: AllAnimalObservationLogsDatatableProps
) {
  const apiJson = useApiJson();
  const { speciesCode, animalCode, animalActivityId } = props;
  const [animalActivitySearch, setAnimalActivitySearch] = useState<boolean>(
    animalActivityId != -1
  );
  const employee = useAuthContext().state.user?.employeeData;
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

  let emptyEmployee: Employee = {
    employeeId: -1,
    employeeName: "",
    employeeEmail: "",
    employeeAddress: "",
    employeePhoneNumber: "",
    employeeDoorAccessCode: "",
    employeeEducation: "",
    employeeBirthDate: new Date(),
    isAccountManager: false,
    dateOfResignation: new Date(),
  };

  let emptyKeeper: Keeper = {
    id: 0,
    keeperType: KeeperType.SENIOR_KEEPER,
    specialization: Specialization.MAMMAL,
    isDisabled: false,
    employee: emptyEmployee,
  };

  let emptyAnimalActivity: AnimalActivity = {
    animalActivityId: -1,
    activityType: ActivityType.TRAINING,
    title: "",
    details: "",
    recurringPattern: RecurringPattern.DAILY,
    dayOfMonth: null,
    dayOfWeek: null,
    startDate: new Date(),
    endDate: new Date(),
    eventTimingType: EventTimingType.AFTERNOON,
    durationInMinutes: -1,
    animalActivityLogs: [],
    requiredNumberOfKeeper: 0,
  };

  let emptyAnimalObservationLog: AnimalObservationLog = {
    animalObservationLogId: 0,
    dateTime: new Date(),
    durationInMinutes: 0,
    observationQuality: Rating.NOT_RECORDED,
    details: "",
    animals: [],
    keeper: emptyKeeper,
    animalActivity: emptyAnimalActivity,
  };

  const [animalObservationLogList, setAnimalObservationLogList] = useState<
    AnimalObservationLog[]
  >([]);
  const [selectedAnimalObservationLog, setSelectedAnimalObservationLog] =
    useState<AnimalObservationLog>(emptyAnimalObservationLog);
  const [
    deleteanimalObservationLogDialog,
    setDeleteAnimalObservationLogDialog,
  ] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<AnimalObservationLog[]>>(null);
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();
  useEffect(() => {
    if (animalActivitySearch) {
      apiJson
        .get(
          `http://localhost:3000/api/animal/getAnimalObservationLogsByAnimalActivityId/${animalActivityId}`
        )
        .then((res) => {
          setAnimalObservationLogList(
            res.animalObservationLogs as AnimalObservationLog[]
          );
        })
        .catch((e) => console.log(e));
    } else {
      apiJson
        .get(
          `http://localhost:3000/api/animal/getAnimalObservationLogsByAnimalCode/${animalCode}`
        )
        .then((res) => {
          setAnimalObservationLogList(
            res.animalObservationLogs as AnimalObservationLog[]
          );
        })
        .catch((e) => console.log(e));
    }
  }, []);
  console.log(animalObservationLogList);

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const confirmDeleteAnimalObservationLog = (
    animalObservationLog: AnimalObservationLog
  ) => {
    setSelectedAnimalObservationLog(animalObservationLog);
    setDeleteAnimalObservationLogDialog(true);
  };

  const hideDeleteAnimalObservationLogDialog = () => {
    setDeleteAnimalObservationLogDialog(false);
  };

  // delete animalObservationLog stuff
  const deleteAnimalObservationLog = async () => {
    let _animalObservationLog = animalObservationLogList.filter(
      (val) =>
        val.animalObservationLogId !==
        selectedAnimalObservationLog?.animalObservationLogId
    );

    const deleteAnimalObservationLog = async () => {
      try {
        setDeleteAnimalObservationLogDialog(false);
        const responseJson = await apiJson.del(
          "http://localhost:3000/api/animal/deleteAnimalObservationLogById/" +
            selectedAnimalObservationLog.animalObservationLogId
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description:
            "Successfully deleted animal observation log: " +
            selectedAnimalObservationLog.animalObservationLogId,
        });
        setAnimalObservationLogList(_animalObservationLog);
        setSelectedAnimalObservationLog(emptyAnimalObservationLog);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while deleting animal observation log: \n" +
            apiJson.error,
        });
      }
    };
    deleteAnimalObservationLog();
  };

  const deleteAnimalObservationLogDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeleteAnimalObservationLogDialog}>
        <HiX />
        No
      </Button>
      <Button variant={"destructive"} onClick={deleteAnimalObservationLog}>
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>
  );
  // end delete animalObservationLog stuff

  const actionBodyTemplate = (animalObservationLog: AnimalObservationLog) => {
    return (
      <React.Fragment>
        {animalActivitySearch ? (
          <div>
            <Button
              // variant={"outline"}
              className="mb-1 mr-1"
              onClick={() => {
                navigate(
                  `/animal/viewanimalactivitydetails/${animalActivityId}/observationlogs`,
                  { replace: true }
                );
                navigate(
                  `/animal/viewAnimalObservationLogDetails/${animalObservationLog.animalObservationLogId}`
                );
              }}
            >
              <HiEye className="mx-auto" />
            </Button>
            {(animalObservationLog.keeper.employee.employeeName ==
              employee.employeeName ||
              employee.superAdmin ||
              employee.planningStaff?.plannerType == "CURATOR") && (
              <Button
                variant={"destructive"}
                className="mr-2"
                onClick={() =>
                  confirmDeleteAnimalObservationLog(animalObservationLog)
                }
              >
                <HiTrash className="mx-auto" />
              </Button>
            )}
          </div>
        ) : (
          <div>
            <Button
              // variant={"outline"}
              className="mb-1 mr-1"
              onClick={() => {
                navigate(`/animal/viewAnimalDetails/${animalCode}/behaviour`, {
                  replace: true,
                });
                navigate(
                  `/animal/viewAnimalObservationLogDetails/${animalObservationLog.animalObservationLogId}`
                );
              }}
            >
              <HiEye className="mx-auto" />
            </Button>
            {/* <Button
              // variant={"outline"}
              className="mb-1 mr-1"
              onClick={() => {
                navigate(`/animal/viewAnimalDetails/${animalCode}/activitylogs`, { replace: true })
                navigate(`/animal/viewAnimalActivityDetails/${animalObservationLog.animalActivity.animalActivityId}`)
              }}>
              <HiMiniListBullet className="mx-auto" />
            </Button> */}
            {(animalObservationLog.keeper.employee.employeeName ==
              employee.employeeName ||
              employee.superAdmin ||
              employee.planningStaff?.plannerType == "CURATOR") && (
              <Button
                variant={"destructive"}
                className="mr-2"
                onClick={() =>
                  confirmDeleteAnimalObservationLog(animalObservationLog)
                }
              >
                <HiTrash className="mx-auto" />
              </Button>
            )}
          </div>
        )}
      </React.Fragment>
    );
  };

  //Sort results
  interface SortOption {
    label: string;
    value: string;
  }
  const [sortKey, setSortKey] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<1 | 0 | -1 | undefined | null>(-1);
  const [sortField, setSortField] = useState<string>("dateTime");
  const sortOptions: SortOption[] = [
    { label: "Latest log", value: "!dateTime" },
    { label: "Earliest log", value: "dateTime" },
  ];

  const onSortChange = (event: DropdownChangeEvent) => {
    const value = event.value;

    if (value.indexOf("!") === 0) {
      setSortOrder(-1);
      setSortField(value.substring(1, value.length));
      setSortKey(value);
    } else {
      setSortOrder(1);
      setSortField(value);
      setSortKey(value);
    }
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
        <h4 className="m-1">Manage Animal Observation Logs</h4>
        {/* <Dropdown
          options={sortOptions}
          value={sortKey}
          optionLabel="label"
          placeholder="Sort By"
          onChange={onSortChange}
        /> */}
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
        {animalActivitySearch &&
          (employee.superAdmin ||
            employee.planningStaff?.plannerType == "CURATOR" ||
            employee.keeper) && (
            <Button
              className="mr-2"
              onClick={() => {
                navigate(
                  `/animal/viewanimalactivitydetails/${animalActivityId}/observationlogs`,
                  { replace: true }
                );
                navigate(
                  `/animal/createAnimalObservationLog/${animalActivityId}`
                );
              }}
            >
              <HiPlus className="mr-auto" />
              Add Animal Observation Log
            </Button>
          )}
        <Button onClick={exportCSV}>Export to .csv</Button>
      </div>
    </div>
  );

  return (
    <div>
      <div>
        <Toast ref={toast} />
        <div className="">
          <DataTable
            ref={dt}
            value={animalObservationLogList}
            selection={selectedAnimalObservationLog}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setSelectedAnimalObservationLog(e.value);
              }
            }}
            dataKey="animalObservationLogId"
            paginator
            rows={10}
            scrollable
            selectionMode={"single"}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} animal observation logs"
            globalFilter={globalFilter}
            header={header}
          >
            <Column
              field="animalObservationLogId"
              header="ID"
              sortable
              style={{ minWidth: "4rem" }}
            ></Column>
            <Column
              body={(animalObservationLog) => {
                return new Date(
                  animalObservationLog.dateTime
                ).toLocaleDateString("en-SG", dateOptions);
              }}
              field="dateTime"
              header="Date"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="durationInMinutes"
              header="Duration In Minutes"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              body={(animalObservationLog) => {
                return beautifyText(animalObservationLog.observationQuality);
              }}
              field="observationQuality"
              header="Observation Quality"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="details"
              header="Details"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="keeper.employee.employeeName"
              header="Keeper"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              body={actionBodyTemplate}
              header="Actions"
              frozen
              alignFrozen="right"
              exportable={false}
              style={{ minWidth: "12rem" }}
            ></Column>
          </DataTable>
        </div>
      </div>
      <Dialog
        visible={deleteanimalObservationLogDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteAnimalObservationLogDialogFooter}
        onHide={hideDeleteAnimalObservationLogDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedAnimalObservationLog && (
            <span>
              Are you sure you want to delete{" "}
              <b>{selectedAnimalObservationLog.animalObservationLogId}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default AllAnimalObservationLogsDatatable;
