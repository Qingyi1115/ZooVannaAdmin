import React, { useEffect, useRef, useState } from "react";

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
// import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import { HiCheck, HiEye, HiTrash, HiX } from "react-icons/hi";
import useApiJson from "../../../hooks/useApiJson";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import {
  ActivityType,
  EventTimingType,
  RecurringPattern
} from "../../../enums/Enumurated";
import beautifyText from "../../../hooks/beautifyText";
import { useAuthContext } from "../../../hooks/useAuthContext";
import AnimalActivity from "../../../models/AnimalActivity";

let emptyAnimalActivity: AnimalActivity = {
  animalActivityId: -1,
  activityType: ActivityType.ENRICHMENT,
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
  requiredNumberOfKeeper: 0
};

interface AllAnimalActivitiesDatatableProps {
  animalActivitiesList: AnimalActivity[];
  setAnimalActivitiesList: any;
}

function AllAnimalActivitiesDatatable(
  props: AllAnimalActivitiesDatatableProps
) {
  const apiJson = useApiJson();
  const navigate = useNavigate();

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };

  const { animalActivitiesList, setAnimalActivitiesList } = props;
  const [selectedAnimalActivity, setSelectedAnimalActivity] =
    useState<AnimalActivity>(emptyAnimalActivity);

  const [deleteAnimalActivityDialog, setDeleteAnimalActivityDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const dt = useRef<DataTable<AnimalActivity[]>>(null);

  const employee = useAuthContext().state.user?.employeeData;
  const toastShadcn = useToast().toast;

  useEffect(() => {
    const fetchAnimalActivities = async () => {
      try {
        const responseJson = await apiJson.get(
          "http://localhost:3000/api/animal/getAllAnimalActivities"
        );
        setAnimalActivitiesList(responseJson as AnimalActivity[]);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchAnimalActivities();
  }, []);

  //
  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  // delete animal activity stuff
  const confirmDeleteAnimalActivity = (animalActivity: AnimalActivity) => {
    setSelectedAnimalActivity(animalActivity);
    setDeleteAnimalActivityDialog(true);
  };

  const hideDeleteAnimalActivityDialog = () => {
    setDeleteAnimalActivityDialog(false);
  };
  //
  const deleteAnimalActivity = async () => {
    let _animalActivitiesList = animalActivitiesList.filter(
      (val) => val.animalActivityId !== selectedAnimalActivity?.animalActivityId
    );

    const deleteAnimalActivityApi = async () => {
      try {
        const responseJson = await apiJson.del(
          "http://localhost:3000/api/animal/deleteAnimalActivity/" +
          selectedAnimalActivity.animalActivityId
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description: "Successfully deleted animal activity!",
        });
        setAnimalActivitiesList(_animalActivitiesList);
        setDeleteAnimalActivityDialog(false);
        setSelectedAnimalActivity(emptyAnimalActivity);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while deleting species: \n" + error.message,
        });
      }
    };
    deleteAnimalActivityApi();
  };

  const deleteAnimalActivityDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeleteAnimalActivityDialog}>
        <HiX className="mr-2" />
        No
      </Button>
      <Button variant={"destructive"} onClick={deleteAnimalActivity}>
        <HiCheck className="mr-2" />
        Yes
      </Button>
    </React.Fragment>
  );
  //
  const actionBodyTemplate = (animalActivity: AnimalActivity) => {
    return (
      <React.Fragment>
        <div className="mx-auto">
          <Button
            className="mr-2"
            onClick={() =>
              navigate(
                `/animal/viewanimalactivitydetails/${animalActivity.animalActivityId}`
              )
            }
          >
            <HiEye className="mr-auto" />
          </Button>
          {(employee.superAdmin || employee.planningStaff?.plannerType == "CURATOR") &&
            <Button
              variant={"destructive"}
              className="mr-2"
              onClick={() => confirmDeleteAnimalActivity(animalActivity)}
            >
              <HiTrash className="mx-auto" />
            </Button>
          }
        </div>
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Manage Animal Activities</h4>
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

      <Button onClick={exportCSV}>Export to .csv</Button>
    </div>
  );

  return (
    <div>
      <div>
        <div className="rounded-lg bg-white p-4">
          <DataTable
            ref={dt}
            value={animalActivitiesList}
            selection={selectedAnimalActivity}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setSelectedAnimalActivity(e.value);
              }
            }}
            dataKey="animalActivityId"
            paginator
            // showGridlines
            rows={10}
            scrollable
            selectionMode={"single"}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} animal activities"
            globalFilter={globalFilter}
            header={header}
          >
            <Column
              field="animalActivityId"
              header="ID"
              sortable
              style={{ minWidth: "4rem" }}
            ></Column>
            <Column
              field="title"
              header="Title"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              body={(animalActivity) => {
                return beautifyText(animalActivity.activityType)
              }}
              field="activityType"
              header="Type"
              sortable
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              body={(animalActivity) => {
                return beautifyText(animalActivity.recurringPattern)
              }}
              field="recurringPattern"
              header="Recurrence"
              sortable
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              body={(animalActivity) => {
                return new Date(animalActivity.startDate).toLocaleDateString(
                  "en-SG",
                  dateOptions
                );
              }}
              // field="date"
              header="Start Date"
              sortable
              style={{ minWidth: "8rem" }}
            ></Column>
            <Column
              body={(animalActivity) => {
                return new Date(animalActivity.endDate).toLocaleDateString(
                  "en-SG",
                  dateOptions
                );
              }}
              // field="date"
              header="End Date"
              sortable
              style={{ minWidth: "8rem" }}
            ></Column>
            <Column
              body={(animalActivity) => {
                return beautifyText(animalActivity.eventTimingType)
              }}
              field="eventTimingType"
              header="Session Timing"
              sortable
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="durationInMinutes"
              header="Duration (minutes)"
              sortable
              style={{ minWidth: "8rem" }}
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
        visible={deleteAnimalActivityDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteAnimalActivityDialogFooter}
        onHide={hideDeleteAnimalActivityDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedAnimalActivity && (
            <span>
              Are you sure you want to delete the selected animal activity plan
              (ID {selectedAnimalActivity.animalActivityId})?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default AllAnimalActivitiesDatatable;
