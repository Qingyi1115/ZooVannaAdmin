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
import { NavLink } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import AnimalObservationLog from "../../../models/AnimalObservationLog";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Card } from "primereact/card";
import { useAuthContext } from "../../../hooks/useAuthContext";
import Animal from "../../../models/Animal";
import Species from "../../../models/Species";
import { AnimalSex, AcquisitionMethod, AnimalGrowthStage } from "../../../enums/Enumurated";
import { Rating } from "../../../enums/Rating";
import Employee from "../../../models/Employee";
import { Column } from "primereact/column";

interface AllAnimalObservationLogsDatatableProps {
  animalId: number;
}

function AllAnimalObservationLogsDatatable(props: AllAnimalObservationLogsDatatableProps) {
  const apiJson = useApiJson();
  const { animalId } = props;
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

  let emptyAnimalObservationLog: AnimalObservationLog = {
    animalObservationLogId: 0,
    dateTime: new Date(),
    durationInMinutes: 0,
    observationQuality: Rating.NOT_RECORDED,
    details: "",
    animals: [],
    employee: emptyEmployee
  };

  const [animalObservationLogList, setAnimalObservationLogList] = useState<AnimalObservationLog[]>([]);
  const [selectedAnimalObservationLog, setSelectedAnimalObservationLog] = useState<AnimalObservationLog>(emptyAnimalObservationLog);
  const [deleteanimalObservationLogDialog, setDeleteAnimalObservationLogDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<AnimalObservationLog[]>>(null);
  const toastShadcn = useToast().toast;

  useEffect(() => {
    apiJson.post(
      `http://localhost:3000/api/animal/getAnimalObservationLogs/${animalId}`,
      { includes: ["animals", "employee"] })
      .then(res => {
        setAnimalObservationLogList(res.animalObservationLogs as AnimalObservationLog[]);
      })
      .catch(e => console.log(e));
  }, []);

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const confirmDeleteanimalObservationLog = (animalObservationLog: AnimalObservationLog) => {
    setSelectedAnimalObservationLog(animalObservationLog);
    setDeleteAnimalObservationLogDialog(true);
  };

  const hideDeleteAnimalObservationLogDialog = () => {
    setDeleteAnimalObservationLogDialog(false);
  };

  // delete animalObservationLog stuff
  const deleteAnimalObservationLog = async () => {
    let _animalObservationLog = animalObservationLogList.filter(
      (val) => val.animalObservationLogId !== selectedAnimalObservationLog?.animalObservationLogId
    );

    const deleteAnimalObservationLog = async () => {
      try {
        setDeleteAnimalObservationLogDialog(false);
        const responseJson = await apiJson.del(
          "http://localhost:3000/api/animal/deleteAnimalObservationLog/" +
          selectedAnimalObservationLog.animalObservationLogId
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description:
            "Successfully deleted animalObservationLog: " + selectedAnimalObservationLog.animalObservationLogId,
        });
        setAnimalObservationLogList(_animalObservationLog);
        setSelectedAnimalObservationLog(emptyAnimalObservationLog);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while deleting animalObservationLog: \n" + apiJson.error,
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
        <NavLink to={`/animal/viewAnimalObservationLogDetails/${animalObservationLog.animalObservationLogId}`}>
          <Button variant={"outline"} className="mb-1 mr-1">
            <HiEye className="mx-auto" />

          </Button>
        </NavLink>
        <NavLink to={`/animal/editAnimalObservationLog/${animalObservationLog.animalObservationLogId}`}>
          <Button className="mr-1">
            <HiPencil className="mr-1" />

          </Button>
        </NavLink>
        <Button
          variant={"destructive"}
          className="mr-2"
          onClick={() => confirmDeleteanimalObservationLog(animalObservationLog)}
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
  const [sortOrder, setSortOrder] = useState<1 | 0 | -1 | undefined | null>(0);
  const [sortField, setSortField] = useState<string>('');
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
      </div>
    </div>
  );

  const listItem = (animalObservationLog: AnimalObservationLog) => {
    return (
      <div>
        <Card className="my-4 relative"
          title={animalObservationLog.animalObservationLogId}
          subTitle={animalObservationLog.dateTime ?
            "Date created: " + new Date(animalObservationLog.dateTime).toLocaleString() : ""}>
          {/* {((employee.planningStaff?.plannerType == "OPERATIONS_MANAGER") && 
          <Button className="absolute top-5 right-5"
            variant={"destructive"}
            onClick={() => confirmDeleteanimalObservationLog(animalObservationLog)}
          >
            <HiTrash className="mx-auto" />
          </Button>
          )} */}
          <div className="flex flex-col justify-left gap-6 lg:flex-row lg:gap-12">
            <div>
              <div className="text-xl font-bold text-900">Duration In Minutes</div>
              <p>{animalObservationLog.durationInMinutes}</p>
            </div>
            <Separator orientation="vertical" />
            <div>
              <div className="text-xl font-bold text-900">Observation Quality</div>
              <p>{animalObservationLog.observationQuality}</p>
            </div>
            <Separator orientation="vertical" />
            <div>
              <div className="text-xl font-bold text-900">Details</div>
              <p>{animalObservationLog.details}</p>
            </div>
          </div>

        </Card>
      </div>
    )
  }

  const itemTemplate = (animalObservationLog: AnimalObservationLog) => {
    if (!animalObservationLog) {
      return;
    }
    return listItem(animalObservationLog);
  };

  return (
    <div>
      <div>
        <Toast ref={toast} />
        <div className="rounded-lg bg-white p-4">
          {/* Title Header and back button */}
          <div className="flex flex-col">
            <div className="mb-4 flex justify-between">
              {((employee.planningStaff?.plannerType == "OPERATIONS_MANAGER" ||
                employee.generalStaff?.generalStaffType == "ZOO_OPERATIONS") ?
                <NavLink to={`/animal/createAnimalObservationLog/${animalId}`}>
                  <Button className="mr-2">
                    <HiPlus className="mr-auto" />
                    Add Log
                  </Button>
                </NavLink>
                : <Button disabled className="invisible">
                  Add Log
                </Button>
              )}
              <span className=" self-center text-title-l font-bold">
                All Animal Observation Logs
              </span>
              <Button onClick={exportCSV}>Export to .csv</Button>
            </div>
            <Separator />
          </div>
          <DataTable
            ref={dt}
            value={animalObservationLogList}
            selection={selectedAnimalObservationLog}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setSelectedAnimalObservationLog(e.value);
              }
            }}
            dataKey="facilityId"
            paginator
            rows={10}
            scrollable
            selectionMode={"single"}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} facilities"
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
                return new Date(animalObservationLog.dateTime).toLocaleDateString(
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
              field="animals.animalCode"
              header="Animals"
              sortable
              style={{ display: "none" }}
              filter
              filterPlaceholder="Search by animal code"
            ></Column>
            <Column
              field="employee.employeeName"
              header="Employee"
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
          {/* <DataView
            value={animalObservationLogList}
            itemTemplate={itemTemplate}
            layout="list"
            dataKey="animalObservationLogId"
            header={header}
            sortField={sortField}
            sortOrder={sortOrder}
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} facility logs"
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            paginator
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          /> */}
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
