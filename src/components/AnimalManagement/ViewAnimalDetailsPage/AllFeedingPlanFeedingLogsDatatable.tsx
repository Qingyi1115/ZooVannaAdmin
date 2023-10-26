import React, { useEffect, useState, useRef } from "react";
import { DataView } from 'primereact/dataview';
import { DataTable } from "primereact/datatable";
// import { ProductService } from './service/ProductService';
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import useApiJson from "../../../hooks/useApiJson";
import { HiCheck, HiEye, HiPencil, HiPlus, HiTrash, HiX } from "react-icons/hi";

import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import AnimalFeedingLog from "../../../models/AnimalFeedingLog";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Card } from "primereact/card";
import { useAuthContext } from "../../../hooks/useAuthContext";
import Animal from "../../../models/Animal";
import Species from "../../../models/Species";
import { AnimalSex, AcquisitionMethod, AnimalGrowthStage, KeeperType, Specialization } from "../../../enums/Enumurated";
import { Rating } from "../../../enums/Rating";
import Employee from "../../../models/Employee";
import { Column } from "primereact/column";
import Keeper from "../../../models/Keeper";

interface AllFeedingPlanFeedingLogsDatatableProps {
  speciesCode: string;
  animalCode: string;
}

function AllFeedingPlanFeedingLogsDatatable(props: AllFeedingPlanFeedingLogsDatatableProps) {
  const apiJson = useApiJson();
  const { speciesCode, animalCode } = props;
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
    employeeProfileUrl: "",
  };

  let emptyKeeper: Keeper = {
    id: 0,
    keeperType: KeeperType.SENIOR_KEEPER,
    specialization: Specialization.MAMMAL,
    isDisabled: false,
    employee: emptyEmployee
  }

  let emptyAnimalFeedingLog: AnimalFeedingLog = {
    animalFeedingLogId: 0,
    dateTime: new Date(),
    durationInMinutes: 0,
    details: "",
    animals: [],
    keeper: emptyKeeper
  };


  const [animalFeedingLogList, setAnimalFeedingLogList] = useState<AnimalFeedingLog[]>([]);
  const [selectedAnimalFeedingLog, setSelectedAnimalFeedingLog] = useState<AnimalFeedingLog>(emptyAnimalFeedingLog);
  const [deleteanimalFeedingLogDialog, setDeleteAnimalFeedingLogDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<AnimalFeedingLog[]>>(null);
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();
  useEffect(() => {
    console.log(animalCode);
    apiJson.get(
      `http://localhost:3000/api/animal/getAnimalFeedingLogsByAnimalCode/${animalCode}`)
      .then(res => {
        setAnimalFeedingLogList(res.animalFeedingLogs as AnimalFeedingLog[]);
      })
      .catch(e => console.log(e));
  }, []);
  console.log(animalFeedingLogList);

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const confirmDeleteanimalFeedingLog = (animalFeedingLog: AnimalFeedingLog) => {
    setSelectedAnimalFeedingLog(animalFeedingLog);
    setDeleteAnimalFeedingLogDialog(true);
  };

  const hideDeleteAnimalFeedingLogDialog = () => {
    setDeleteAnimalFeedingLogDialog(false);
  };

  // delete animalFeedingLog stuff
  const deleteAnimalFeedingLog = async () => {
    let _animalFeedingLog = animalFeedingLogList.filter(
      (val) => val.animalFeedingLogId !== selectedAnimalFeedingLog?.animalFeedingLogId
    );

    const deleteAnimalFeedingLog = async () => {
      try {
        setDeleteAnimalFeedingLogDialog(false);
        const responseJson = await apiJson.del(
          "http://localhost:3000/api/animal/deleteAnimalFeedingLogById/" +
          selectedAnimalFeedingLog.animalFeedingLogId
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description:
            "Successfully deleted animal feeding log: " + selectedAnimalFeedingLog.animalFeedingLogId,
        });
        setAnimalFeedingLogList(_animalFeedingLog);
        setSelectedAnimalFeedingLog(emptyAnimalFeedingLog);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while deleting animal feeding log: \n" + apiJson.error,
        });
      }
    };
    deleteAnimalFeedingLog();
  };

  const deleteAnimalFeedingLogDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeleteAnimalFeedingLogDialog}>
        <HiX />
        No
      </Button>
      <Button variant={"destructive"} onClick={deleteAnimalFeedingLog}>
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>

  );
  // end delete animalFeedingLog stuff

  const actionBodyTemplate = (animalFeedingLog: AnimalFeedingLog) => {
    return (
      <React.Fragment>
        <Button
          // variant={"outline"}
          className="mb-1 mr-1"
          onClick={() => {
            navigate(`/animal/viewAnimalDetails/${animalCode}/feedinglogs`, { replace: true })
            navigate(`/animal/viewAnimalFeedingLogDetails/${animalFeedingLog.animalFeedingLogId}`)
          }}>
          <HiEye className="mx-auto" />
        </Button>
        {/* <Button
          className="mr-1"
          onClick={() => {
            navigate(`/animal/viewAnimalDetails/${animalCode}/feedinglogs`, { replace: true })
            navigate(`/animal/editAnimalFeedingLog/${animalFeedingLog.animalFeedingLogId}`)
          }}>
          <HiPencil className="mr-1" />
        </Button> */}
        <Button
          variant={"destructive"}
          className="mr-2"
          onClick={() => confirmDeleteanimalFeedingLog(animalFeedingLog)}
        >
          <HiTrash className="mx-auto" />

        </Button>
      </React.Fragment>
    );
  };

  //Sort results
  interface SortOption {
    label: string;
    value: string;
  }
  const [sortKey, setSortKey] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<1 | 0 | -1 | undefined | null>(-1);
  const [sortField, setSortField] = useState<string>('dateTime');
  const sortOptions: SortOption[] = [
    { label: 'Latest log', value: '!dateTime' },
    { label: 'Earliest log', value: 'dateTime' }
  ]

  const onSortChange = (event: DropdownChangeEvent) => {
    const value = event.value;

    if (value.indexOf('!') === 0) {
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
        <h4 className="m-1">Manage Animal Feeding Logs</h4>
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
      </div>
    </div>
  );

  const listItem = (animalFeedingLog: AnimalFeedingLog) => {
    return (
      <div>
        <Card className="my-4 relative"
          title={animalFeedingLog.animalFeedingLogId}
          subTitle={animalFeedingLog.dateTime ?
            "Date created: " + new Date(animalFeedingLog.dateTime).toLocaleString() : ""}>
          {/* {((employee.planningStaff?.plannerType == "OPERATIONS_MANAGER") && 
          <Button className="absolute top-5 right-5"
            variant={"destructive"}
            onClick={() => confirmDeleteanimalFeedingLog(animalFeedingLog)}
          >
            <HiTrash className="mx-auto" />
          </Button>
          )} */}
          <div className="flex flex-col justify-left gap-6 lg:flex-row lg:gap-12">
            <div>
              <div className="text-xl font-bold text-900">Duration In Minutes</div>
              <p>{animalFeedingLog.durationInMinutes}</p>
            </div>
            <Separator orientation="vertical" />
            <div>
              <div className="text-xl font-bold text-900">Details</div>
              <p>{animalFeedingLog.details}</p>
            </div>
          </div>

        </Card>
      </div>
    )
  }

  const itemTemplate = (animalFeedingLog: AnimalFeedingLog) => {
    if (!animalFeedingLog) {
      return;
    }
    return listItem(animalFeedingLog);
  };

  return (
    <div>
      <div>
        <Toast ref={toast} />
        <div className="">
          {/* Title Header and back button */}
          <div className="flex flex-col">
            <div className="mb-4 flex justify-between">
              {((employee.planningStaff?.plannerType == "OPERATIONS_MANAGER" ||
                employee.generalStaff?.generalStaffType == "ZOO_OPERATIONS") ?
                <Button className="mr-2"
                  onClick={() => {
                    navigate(`/animal/viewAnimalDetails/${animalCode}/feedinglogs`, { replace: true })
                    navigate(`/animal/createAnimalFeedingLog/${speciesCode}`)
                  }}>
                  <HiPlus className="mr-auto" />
                  Add Animal Feeding Log
                </Button>
                : <Button disabled className="invisible">
                  Add Log
                </Button>
              )}
              <Button onClick={exportCSV}>Export to .csv</Button>
            </div>
            <Separator />
          </div>
          <DataTable
            ref={dt}
            value={animalFeedingLogList}
            selection={selectedAnimalFeedingLog}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setSelectedAnimalFeedingLog(e.value);
              }
            }}
            dataKey="animalFeedingLogId"
            paginator
            rows={10}
            scrollable
            selectionMode={"single"}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} animal feeding logs"
            globalFilter={globalFilter}
            header={header}
          >
            <Column
              field="animalFeedingLogId"
              header="ID"
              sortable
              style={{ minWidth: "4rem" }}
            ></Column>
            <Column
              body={(animalFeedingLog) => {
                return new Date(animalFeedingLog.dateTime).toLocaleDateString(
                  "en-SG",
                  dateOptions
                );
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
              field="details"
              header="Details"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            {/* <Column
              field="animals.houseName"
              header="Animals"
              sortable
              style={{ display: "none" }}
              filter
              filterPlaceholder="Search by animal code"
            ></Column>
            <Column
              // body={(animalFeedingLog) => {
              //   return animalFeedingLog.keeper.employeeId;
              // }}
              field="keeper.employee.employeeName"
              header="Keeper"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column> */}
            <Column
              body={actionBodyTemplate}
              header="Actions"
              frozen
              alignFrozen="right"
              exportable={false}
              style={{ minWidth: "12rem" }}
            ></Column>
          </DataTable>
          {/* <DataView
            value={animalFeedingLogList}
            itemTemplate={itemTemplate}
            layout="list"
            dataKey="animalFeedingLogId"
            header={header}
            sortField={sortField}
            sortOrder={sortOrder}
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} animal feeding logs"
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            paginator
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          /> */}
        </div>
      </div>
      <Dialog
        visible={deleteanimalFeedingLogDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteAnimalFeedingLogDialogFooter}
        onHide={hideDeleteAnimalFeedingLogDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedAnimalFeedingLog && (
            <span>
              Are you sure you want to delete{" "}
              <b>{selectedAnimalFeedingLog.animalFeedingLogId}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default AllFeedingPlanFeedingLogsDatatable;
