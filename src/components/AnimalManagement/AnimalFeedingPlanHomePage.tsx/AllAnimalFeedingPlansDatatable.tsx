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
  ActivityType,
  AnimalGrowthStage,
  AnimalSex,
  EventTimingType,
  RecurringPattern,
} from "../../../enums/Enumurated";
import { useNavigate } from "react-router-dom";
import FeedingPlan from "../../../models/FeedingPlan";

let emptyFeedingPlan: FeedingPlan = {
  feedingPlanId: -1,
  feedingPlanDesc: "",
  startDate: new Date(),
  endDate: new Date(),
  animals: [],
  feedingPlanSessionDetails: [],
};

interface AllAnimalFeedingPlansDatatableProps {
  feedingPlansList: FeedingPlan[];
  setFeedingPlansList: any;
}

function AllAnimalFeedingPlansDatatable(
  props: AllAnimalFeedingPlansDatatableProps
) {
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };

  const { feedingPlansList, setFeedingPlansList } = props;
  const [selectedFeedingPlan, setSelectedFeedingPlan] =
    useState<FeedingPlan>(emptyFeedingPlan);

  const [deleteFeedingPlanDialog, setDeleteFeedingPlanDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const dt = useRef<DataTable<FeedingPlan[]>>(null);

  //
  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  // delete Feeding Plan stuff
  const confirmDeleteFeedingPlan = (feedingPlan: FeedingPlan) => {
    setSelectedFeedingPlan(feedingPlan);
    setDeleteFeedingPlanDialog(true);
  };

  const hideDeleteFeedingPlanDialog = () => {
    setDeleteFeedingPlanDialog(false);
  };
  //
  const deleteFeedingPlan = async () => {
    let _feedingPlanList = feedingPlansList.filter(
      (val) => val.feedingPlanId !== selectedFeedingPlan?.feedingPlanId
    );

    const deleteFeedingPlanApi = async () => {
      try {
        const responseJson = await apiJson.del(
          "http://localhost:3000/api/animal/deleteFeedingPlanById/" +
            selectedFeedingPlan.feedingPlanId
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description: "Successfully deleted feeding plan!",
        });
        setFeedingPlansList(_feedingPlanList);
        setDeleteFeedingPlanDialog(false);
        setSelectedFeedingPlan(emptyFeedingPlan);
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
    deleteFeedingPlanApi();
  };

  const deleteFeedingPlanDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeleteFeedingPlanDialog}>
        <HiX className="mr-2" />
        No
      </Button>
      <Button variant={"destructive"} onClick={deleteFeedingPlan}>
        <HiCheck className="mr-2" />
        Yes
      </Button>
    </React.Fragment>
  );
  // end delete feeding plan stuff

  //
  const actionBodyTemplate = (feedingPlan: FeedingPlan) => {
    return (
      <React.Fragment>
        <div className="mx-auto">
          <Button
            className="mr-2"
            onClick={() =>
              navigate(
                `/animal/viewfeedingplandetails/${feedingPlan.feedingPlanId}`
              )
            }
          >
            <HiEye className="mr-auto" />
          </Button>
          <Button
            variant={"destructive"}
            className="mr-2"
            onClick={() => confirmDeleteFeedingPlan(feedingPlan)}
          >
            <HiTrash className="mx-auto" />
          </Button>
        </div>
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Manage Feeding Plans</h4>
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
              <Button className="invisible"></Button>
              <span className="invisible">All Feeding Plans</span>
              <Button onClick={exportCSV}>Export to .csv</Button>
            </div>
            <Separator />
          </div>

          <DataTable
            ref={dt}
            value={feedingPlansList}
            selection={selectedFeedingPlan}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setSelectedFeedingPlan(e.value);
              }
            }}
            dataKey="feedingPlanId"
            paginator
            // showGridlines
            rows={10}
            scrollable
            selectionMode={"single"}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} feeding plans"
            globalFilter={globalFilter}
            header={header}
          >
            <Column
              field="feedingPlanId"
              header="ID"
              sortable
              style={{ minWidth: "4rem" }}
            ></Column>
            <Column
              field="feedingPlanDesc"
              header="Description"
              sortable
              style={{
                minWidth: "12rem",
                maxWidth: "15rem",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            ></Column>
            <Column
              body={(feedingPlan) => {
                return new Date(feedingPlan.startDate).toLocaleDateString(
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
              body={(feedingPlan) => {
                return new Date(feedingPlan.endDate).toLocaleDateString(
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
        visible={deleteFeedingPlanDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteFeedingPlanDialogFooter}
        onHide={hideDeleteFeedingPlanDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedFeedingPlan && (
            <span>
              Are you sure you want to delete the selected feeding plan (ID{" "}
              {selectedFeedingPlan.feedingPlanId})?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default AllAnimalFeedingPlansDatatable;
