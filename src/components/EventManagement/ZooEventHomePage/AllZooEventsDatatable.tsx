import React, { useEffect, useState, useRef } from "react";

import { classNames } from "primereact/utils";
import { DataTable, DataTableExpandedRows, DataTableFilterMeta } from "primereact/datatable";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
// import { Toast } from "primereact/toast";
import { TriStateCheckbox, TriStateCheckboxChangeEvent } from 'primereact/tristatecheckbox';
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
  ActivityType,
  AnimalGrowthStage,
  AnimalSex,
  EventTimingType,
} from "../../../enums/Enumurated";
import { useNavigate } from "react-router-dom";
import ZooEvent from "../../../models/ZooEvent";
import { FilterMatchMode } from "primereact/api";

let emptyZooEvent: ZooEvent = {
  zooEventId: 0,
  eventName: "",
  eventDescription: "",
  eventIsPublic: false,
  eventStartDateTime: new Date(),
  eventDurationHrs: 0,
  eventTiming: null,
  eventNotificationDate: new Date(),
  eventEndDateTime: null,
  imageUrl: ""
}

interface AllZooEventsDatatableProps {
  zooEventsList: ZooEvent[];
  setRefresh: any;
}

const defaultFilters: DataTableFilterMeta = {
  eventIsPublic: { value: null, matchMode: FilterMatchMode.EQUALS },
};

function AllZooEventsDatatable(
  props: AllZooEventsDatatableProps
) {
  const apiJson = useApiJson();
  const navigate = useNavigate();

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };

  const { zooEventsList, setRefresh } = props;
  const [selectedZooEvent, setSelectedZooEvent] =
    useState<ZooEvent>(emptyZooEvent);

  const [deleteZooEventDialog, setDeleteZooEventDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);

  const dt = useRef<DataTable<ZooEvent[]>>(null);

  const toastShadcn = useToast().toast;

  //
  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  // delete event stuff
  const confirmDeleteZooEvent = (zooEvent: ZooEvent) => {
    setSelectedZooEvent(zooEvent);
    setDeleteZooEventDialog(true);
  };

  const hideDeleteZooEventDialog = () => {
    setDeleteZooEventDialog(false);
  };
  //
  const deleteZooEvent = async () => {
    let _zooEventsList = zooEventsList.filter(
      (val) => val.zooEventId !== selectedZooEvent?.zooEventId
    );

    const deleteZooEventApi = async () => {
      try {
        const responseJson = await apiJson.del(
          "http://localhost:3000/api/zooEvent/deleteZooEvent/" +
          selectedZooEvent.zooEventId
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description: "Successfully deleted event!",
        });
        setRefresh([]);
        setDeleteZooEventDialog(false);
        setSelectedZooEvent(emptyZooEvent);
        setFilters(defaultFilters);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while deleting event: \n" + error.message,
        });
      }
    };
    deleteZooEventApi();
  };

  const deleteZooEventDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeleteZooEventDialog}>
        <HiX className="mr-2" />
        No
      </Button>
      <Button variant={"destructive"} onClick={deleteZooEvent}>
        <HiCheck className="mr-2" />
        Yes
      </Button>
    </React.Fragment>
  );
  //
  const actionBodyTemplate = (zooEvent: ZooEvent) => {
    return (
      <React.Fragment>
        <div className="mx-auto">
          <Button
            className="mr-2"
            onClick={() => {
              navigate(`/zooevent/viewallzooevents/`, { replace: true })
              navigate(`/zooevent/viewzooeventdetails/${zooEvent.zooEventId}/details`)
            }}
          >
            <HiEye className="mr-auto" />
          </Button>
          <Button
            variant={"destructive"}
            className="mr-2"
            onClick={() => confirmDeleteZooEvent(zooEvent)}
          >
            <HiTrash className="mx-auto" />
          </Button>
        </div>
      </React.Fragment >
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Manage Events</h4>
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

  const eventIsPublicBodyTemplate = (rowData: ZooEvent) => {
    return <i className={classNames('pi', { 'text-green-500 pi-check-circle mx-auto': rowData.eventIsPublic, 'text-red-500 pi-times-circle mx-auto': !rowData.eventIsPublic })}></i>;
  };

  const eventIsPublicFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <div>
        <div className="flex align-items-center gap-2">
          <label htmlFor="eventIsPublic-filter" className="font-bold">
            Is Public?
          </label>
          <TriStateCheckbox id="eventIsPublic-filter" value={options.value} onChange={(e: TriStateCheckboxChangeEvent) => options.filterCallback(e.value)} />
        </div>
      </div>
    );
  };

  return (
    <div>
      <div>
        <div className="rounded-lg bg-white p-4">
          <DataTable
            ref={dt}
            value={zooEventsList}
            selection={selectedZooEvent}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setSelectedZooEvent(e.value);
              }
            }}
            dataKey="zooEventId"
            paginator
            // showGridlines
            rows={10}
            scrollable
            selectionMode={"single"}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} event"
            filters={filters}
            globalFilter={globalFilter}
            header={header}
          >
            <Column
              field="zooEventId"
              header="ID"
              sortable
              style={{ minWidth: "4rem" }}
            ></Column>
            <Column
              field="eventName"
              header="Name"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="eventDescription"
              header="Description"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="eventIsPublic"
              header="Is Public?"
              dataType="boolean"
              sortable
              body={(zooEvent) => {
                return zooEvent.eventIsPublic ? "Yes" : "No"
              }
              }
              bodyClassName={"text-center"}
              filter
              filterElement={eventIsPublicFilterTemplate}
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="eventType"
              header="Type"
              sortable
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              body={(zooEvent) => {
                return new Date(zooEvent.eventStartDateTime).toLocaleDateString(
                  "en-SG",
                  dateOptions
                );
              }}
              header="Start Date"
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
        visible={deleteZooEventDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteZooEventDialogFooter}
        onHide={hideDeleteZooEventDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedZooEvent && (
            <span>
              Are you sure you want to delete{" "}
              {selectedZooEvent.eventName}?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default AllZooEventsDatatable;
