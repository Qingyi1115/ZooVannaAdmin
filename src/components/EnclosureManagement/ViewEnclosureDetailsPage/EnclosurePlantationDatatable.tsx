import React, { useEffect, useRef, useState } from "react";
import Enclosure from "../../../models/Enclosure";

import { Column } from "primereact/column";
import { DataTable, DataTableExpandedRows } from "primereact/datatable";

import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import useApiJson from "../../../hooks/useApiJson";

import Plantation from "../../../models/Plantation";

import { Button } from "@/components/ui/button";
import { Checkbox, CheckboxClickEvent } from "primereact/checkbox";
import {
  HiCheck,
  HiX
} from "react-icons/hi";
import { Biome } from "../../../enums/Enumurated";


interface EnclosurePlantationDatatableProps {
  curEnclosure: Enclosure;
  plantationList: Plantation[];
  setPlantationList: any;
  refreshSeed: number;
  setRefreshSeed: any;
}
function EnclosurePlantationDatatable(props: EnclosurePlantationDatatableProps) {
  const apiJson = useApiJson();

  const {
    curEnclosure,
    plantationList,
    setPlantationList,
    refreshSeed,
    setRefreshSeed,
  } = props;

  const emptyPlantation: Plantation = {
    plantationId: 0,
    name: "",
    biome: Biome.AQUATIC
  }

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };


  const [selectedPlantation, setSelectedPlantation] = useState<Plantation>(emptyPlantation);
  const [removePlantationDialog, setRemovePlantationDialog] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const navigate = useNavigate();

  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | Plantation[]
  >([]);

  // add plantation vars
  const [plantationBulkAssignmentDialog, setPlantationBulkAssignmentDialog] =
    useState<boolean>(false);
  const [availablePlantations, setAvailablePlantations] = useState<Plantation[]>([]);
  const [selectedAvailablePlantations, setSelectedAvailablePlantations] = useState<
    Plantation[]
  >([]);
  const [plantationAssignmentDialog, setPlantationAssignmentDialog] =
    useState<boolean>(false);
  const [isCompatibleOnlyFilter, setIsCompatibleOnlyFilter] = useState<
    boolean | undefined
  >(false);
  //

  const dt = useRef<DataTable<Plantation[]>>(null);

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

  // remove plantation stuff
  const confirmRemovePlantation = (plantation: Plantation) => {
    setSelectedPlantation(plantation);
    setRemovePlantationDialog(true);
  };

  const hideRemovePlantationDialog = () => {
    setRemovePlantationDialog(false);
  };

  const removePlantation = async () => {
    let _plantations = plantationList.filter(
      (val) => val.plantationId !== selectedPlantation?.plantationId
    );

    const removePlantationApiObj = {
      enclosureId: curEnclosure.enclosureId,
      plantationId: selectedPlantation.plantationId,
    };

    const removePlantationApi = async () => {
      console.log(selectedPlantation.plantationId);
      try {
        const responseJson = await apiJson.put(
          "http://localhost:3000/api/enclosure/removePlantationFromEnclosure/",
          removePlantationApiObj
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description:
            "Successfully removed plantation: " +
            selectedPlantation.name +
            "from the enclosure",
        });
        setPlantationList(_plantations);
        setRemovePlantationDialog(false);
        setSelectedPlantation(emptyPlantation);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while removing plantation: \n" + apiJson.error,
        });
      }
    };
    removePlantationApi();
  };

  const removePlantationDialogFooter = (
    <React.Fragment>
      <Button onClick={hideRemovePlantationDialog}>
        <HiX className="mr-2" />
        No
      </Button>
      <Button variant={"destructive"} onClick={removePlantation}>
        <HiCheck className="mr-2" />
        Yes
      </Button>
    </React.Fragment>
  );
  // end remove plantation stuff

  const actionBodyTemplate = (plantation: Plantation) => {
    return (
      <React.Fragment>
        <div className="mx-auto">
          <Button
            variant={"destructive"}
            className="mr-2"
            onClick={() => confirmRemovePlantation(plantation)}
          >
            <HiX className="mx-auto" />
          </Button>
        </div>
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <Button
        onClick={() => setPlantationBulkAssignmentDialog(true)}
        disabled={availablePlantations.length == 0}
      >
        Add Plantation To Enclosure
      </Button>
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
  const calculateAnimalPerSpeciesTotal = (name: string) => {
    let total = 0;

    if (plantationList) {
      for (let plantation of plantationList) {
        if (plantation.name === name) {
          total++;
        }
      }
    }

    return total;
  };

  // add plantation stuff

  useEffect(() => {
    const fetchAvailablePlantations = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/enclosure/getAllPlantations`
        );
        const allPlantationsList = responseJson as Plantation[];

        const availablePlantationsList = allPlantationsList.filter(
          (plantation) =>
            !plantationList.some(
              (plantation) =>
                plantation.plantationId === plantation.plantationId
            )
        );

        setAvailablePlantations(availablePlantationsList);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchAvailablePlantations();
  }, [plantationList, isCompatibleOnlyFilter]);

  const hidePlantationBulkAssignmentDialog = () => {
    setPlantationBulkAssignmentDialog(false);
  };

  const bulkAssignmentHeader = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      {/* <h4 className="m-1">Manage Maintenance Staff</h4> */}

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

  const onSelectedAvailablePlantationsOnClick = (e: CheckboxClickEvent) => {
    let _selectedAvailablePlantations = [...selectedAvailablePlantations];
    if (e.checked) {
      _selectedAvailablePlantations.push(e.value);
    } else {
      _selectedAvailablePlantations.splice(
        _selectedAvailablePlantations.indexOf(e.value),
        1
      );
    }
    setSelectedAvailablePlantations(_selectedAvailablePlantations);
  };

  const availablePlantationCheckbox = (plantation: Plantation) => {
    return (
      <React.Fragment>
        <div className="mb-4 flex">
          <Checkbox
            name="toAssignPlantations"
            value={plantation}
            onChange={onSelectedAvailablePlantationsOnClick}
            checked={selectedAvailablePlantations.includes(plantation)}
          ></Checkbox>
        </div>
      </React.Fragment>
    );
  };

  const hidePlantationAssignmentDialog = () => {
    setPlantationAssignmentDialog(false);
  };

  const confirmAssignment = () => {
    setPlantationAssignmentDialog(true);
  };

  const bulkAssignPlantations = async () => {
    selectedAvailablePlantations.forEach(async (plantation) => {
      try {
        const assignPlantationApiObj = {
          enclosureId: curEnclosure.enclosureId,
          plantationId: plantation.plantationId,
        };
        const responseJson = await apiJson
          .put(
            `http://localhost:3000/api/enclosure/addPlantationToEnclosure/`,
            assignPlantationApiObj
          )
          .then((res) => {
            setRefreshSeed([]);
          })
          .catch((err) => console.log("err", err));

        toastShadcn({
          title: "Assignment Successful",
          description: "Successfully assigned selected plantations ",
        });
        setPlantationAssignmentDialog(false);
        setPlantationBulkAssignmentDialog(false);
        setSelectedAvailablePlantations([]);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while assigning plantations: \n" +
            apiJson.error,
        });
      }
    });
  };

  const plantationAssignmentDialogFooter = (
    <React.Fragment>
      <Button variant={"destructive"} onClick={hidePlantationAssignmentDialog}>
        <HiX />
        No
      </Button>
      <Button onClick={bulkAssignPlantations}>
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>
  );

  const imageBodyTemplate = (rowData: Plantation) => {
    return (
      (rowData.biome ?
        <img
          src={"http://localhost:3000/" + rowData.biome}
          alt={rowData.name}
          className="aspect-square w-16 rounded-full border border-white object-cover shadow-4"
        /> : "-")
    );
  };

  return (
    <div>
      <DataTable
        ref={dt}
        value={plantationList}
        selection={selectedPlantation}
        onSelectionChange={(e) => {
          if (Array.isArray(e.value)) {
            setSelectedPlantation(e.value);
          }
        }}
        dataKey="plantationId"
        paginator
        // showGridlines
        rows={25}
        scrollable
        selectionMode={"single"}
        rowsPerPageOptions={[10, 25, 50, 100]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} plantations"
        globalFilter={globalFilter}
        header={header}
        sortField={"name"}
      >
        <Column
          field="plantationId"
          header="ID"
          sortable
          style={{ minWidth: "4rem" }}
        ></Column>
        <Column
          field="name"
          header="Name"
          sortable
          style={{ minWidth: "5rem" }}
        ></Column>
        <Column
          field="biome"
          header="Biome"
          sortable
          style={{ minWidth: "5rem" }}
        ></Column>

      </DataTable>{" "}
      <Dialog
        visible={removePlantationDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={removePlantationDialogFooter}
        onHide={hideRemovePlantationDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedPlantation && (
            <span>
              Are you sure you want to remove{" "}
              <b>
                {selectedPlantation.name}
              </b>{" "}
              from the current enclosure? ?
            </span>
          )}
        </div>
      </Dialog>
      {/* Dialogs to add plantation */}
      <Dialog
        visible={plantationAssignmentDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={plantationAssignmentDialogFooter}
        onHide={hidePlantationAssignmentDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedPlantation && (
            <span>
              Are you sure you want to assign the selected plantations to the
              current enclosure?
            </span>
          )}
        </div>
      </Dialog>
      <Dialog
        visible={plantationBulkAssignmentDialog}
        style={{ width: "50vw", height: "70vh" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Assign Plantations"
        footer={
          <Button
            onClick={confirmAssignment}
            disabled={selectedAvailablePlantations.length == 0}
          >
            Assign Selected Plantations
          </Button>
        }
        onHide={hidePlantationBulkAssignmentDialog}
      >
        <div className="confirmation-content">
          <DataTable
            ref={dt}
            value={availablePlantations}
            selection={selectedPlantation}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setSelectedPlantation(e.value);
              }
            }}
            dataKey="plantationId"
            paginator
            rows={10}
            scrollable
            selectionMode={"single"}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} plantations"
            globalFilter={globalFilter}
            header={bulkAssignmentHeader}
          >
            <Column
              body={availablePlantationCheckbox}
            ></Column>
            <Column
              field="plantationId"
              header="ID"
              sortable
              style={{ minWidth: "4rem" }}
            ></Column>
            <Column
              field="name"
              header="Name"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="biome"
              header="Biome"
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

export default EnclosurePlantationDatatable;
