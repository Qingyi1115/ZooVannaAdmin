import React, { useEffect, useRef, useState } from "react";
import Enclosure from "../../../models/Enclosure";

import { Column } from "primereact/column";
import { DataTable, DataTableExpandedRows } from "primereact/datatable";

import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import useApiJson from "../../../hooks/useApiJson";

import EnrichmentItem from "../../../models/EnrichmentItem";

import { Button } from "@/components/ui/button";
import { Checkbox, CheckboxClickEvent } from "primereact/checkbox";
import {
  HiCheck,
  HiX
} from "react-icons/hi";


interface EnclosureEnrichmentItemDatatableProps {
  curEnclosure: Enclosure;
  enrichmentItemList: EnrichmentItem[];
  setEnrichmentItemList: any;
  refreshSeed: number;
  setRefreshSeed: any;
}
function EnclosureEnrichmentItemDatatable(props: EnclosureEnrichmentItemDatatableProps) {
  const apiJson = useApiJson();

  const {
    curEnclosure,
    enrichmentItemList,
    setEnrichmentItemList,
    refreshSeed,
    setRefreshSeed,
  } = props;

  const emptyEnrichmentItem: EnrichmentItem = {
    enrichmentItemId: -1,
    enrichmentItemName: "",
    enrichmentItemImageUrl: "",
  }

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };


  const [selectedEnrichmentItem, setSelectedEnrichmentItem] = useState<EnrichmentItem>(emptyEnrichmentItem);
  const [removeEnrichmentItemDialog, setRemoveEnrichmentItemDialog] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const navigate = useNavigate();

  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | EnrichmentItem[]
  >([]);

  // add enrichmentItem vars
  const [enrichmentItemBulkAssignmentDialog, setEnrichmentItemBulkAssignmentDialog] =
    useState<boolean>(false);
  const [availableEnrichmentItems, setAvailableEnrichmentItems] = useState<EnrichmentItem[]>([]);
  const [selectedAvailableEnrichmentItems, setSelectedAvailableEnrichmentItems] = useState<
    EnrichmentItem[]
  >([]);
  const [enrichmentItemAssignmentDialog, setEnrichmentItemAssignmentDialog] =
    useState<boolean>(false);
  const [isCompatibleOnlyFilter, setIsCompatibleOnlyFilter] = useState<
    boolean | undefined
  >(false);
  //

  const dt = useRef<DataTable<EnrichmentItem[]>>(null);

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

  // remove enrichmentItem stuff
  const confirmRemoveEnrichmentItem = (enrichmentItem: EnrichmentItem) => {
    setSelectedEnrichmentItem(enrichmentItem);
    setRemoveEnrichmentItemDialog(true);
  };

  const hideRemoveEnrichmentItemDialog = () => {
    setRemoveEnrichmentItemDialog(false);
  };

  const removeEnrichmentItem = async () => {
    let _enrichmentItems = enrichmentItemList.filter(
      (val) => val.enrichmentItemId !== selectedEnrichmentItem?.enrichmentItemId
    );

    const removeEnrichmentItemApiObj = {
      enclosureId: curEnclosure.enclosureId,
      enrichmentItemId: selectedEnrichmentItem.enrichmentItemId,
    };

    const removeEnrichmentItemApi = async () => {
      console.log(selectedEnrichmentItem.enrichmentItemId);
      try {
        const responseJson = await apiJson.put(
          "http://localhost:3000/api/enclosure/removeEnrichmentItemFromEnclosure/",
          removeEnrichmentItemApiObj
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description:
            "Successfully removed enrichment item: " +
            selectedEnrichmentItem.enrichmentItemName +
            "from the enclosure",
        });
        setEnrichmentItemList(_enrichmentItems);
        setRemoveEnrichmentItemDialog(false);
        setSelectedEnrichmentItem(emptyEnrichmentItem);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while removing enrichment item: \n" + apiJson.error,
        });
      }
    };
    removeEnrichmentItemApi();
  };

  const removeEnrichmentItemDialogFooter = (
    <React.Fragment>
      <Button onClick={hideRemoveEnrichmentItemDialog}>
        <HiX className="mr-2" />
        No
      </Button>
      <Button variant={"destructive"} onClick={removeEnrichmentItem}>
        <HiCheck className="mr-2" />
        Yes
      </Button>
    </React.Fragment>
  );
  // end remove enrichmentItem stuff

  const actionBodyTemplate = (enrichmentItem: EnrichmentItem) => {
    return (
      <React.Fragment>
        <div className="mx-auto">
          <Button
            variant={"destructive"}
            className="mr-2"
            onClick={() => confirmRemoveEnrichmentItem(enrichmentItem)}
          >
            <HiX className="mx-auto" />
          </Button>
        </div>
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      {/* <h4 className="m-1">Manage Individuals/Groups </h4> */}
      <Button
        onClick={() => setEnrichmentItemBulkAssignmentDialog(true)}
        disabled={availableEnrichmentItems.length == 0}
      >
        Add Enrichment Item To Enclosure
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
  const calculateAnimalPerSpeciesTotal = (enrichmentItemName: string) => {
    let total = 0;

    if (enrichmentItemList) {
      for (let enrichmentItem of enrichmentItemList) {
        if (enrichmentItem.enrichmentItemName === enrichmentItemName) {
          total++;
        }
      }
    }

    return total;
  };

  // add enrichmentItem stuff

  useEffect(() => {
    const fetchAvailableEnrichmentItems = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/assetFacility/getAllEnrichmentItem`
        );
        const allEnrichmentItemsList = responseJson as EnrichmentItem[];

        const availableEnrichmentItemsList = allEnrichmentItemsList.filter(
          (enrichmentItem1) =>
            !enrichmentItemList.some(
              (enrichmentItem2) =>
                enrichmentItem1.enrichmentItemId === enrichmentItem2.enrichmentItemId
            )
        );

        setAvailableEnrichmentItems(availableEnrichmentItemsList);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchAvailableEnrichmentItems();
  }, [enrichmentItemList, isCompatibleOnlyFilter]);

  const hideEnrichmentItemBulkAssignmentDialog = () => {
    setEnrichmentItemBulkAssignmentDialog(false);
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

  const onSelectedAvailableEnrichmentItemsOnClick = (e: CheckboxClickEvent) => {
    let _selectedAvailableEnrichmentItems = [...selectedAvailableEnrichmentItems];
    if (e.checked) {
      _selectedAvailableEnrichmentItems.push(e.value);
    } else {
      _selectedAvailableEnrichmentItems.splice(
        _selectedAvailableEnrichmentItems.indexOf(e.value),
        1
      );
    }
    setSelectedAvailableEnrichmentItems(_selectedAvailableEnrichmentItems);
  };

  const availableEnrichmentItemCheckbox = (enrichmentItem: EnrichmentItem) => {
    return (
      <React.Fragment>
        <div className="mb-4 flex">
          <Checkbox
            name="toAssignEnrichmentItems"
            value={enrichmentItem}
            onChange={onSelectedAvailableEnrichmentItemsOnClick}
            checked={selectedAvailableEnrichmentItems.includes(enrichmentItem)}
          ></Checkbox>
        </div>
      </React.Fragment>
    );
  };

  const hideEnrichmentItemAssignmentDialog = () => {
    setEnrichmentItemAssignmentDialog(false);
  };

  const confirmAssignment = () => {
    setEnrichmentItemAssignmentDialog(true);
  };

  const bulkAssignEnrichmentItems = async () => {
    selectedAvailableEnrichmentItems.forEach(async (enrichmentItem) => {
      const assignEnrichmentItemApiObj = {
        enclosureId: curEnclosure.enclosureId,
        enrichmentItemId: enrichmentItem.enrichmentItemId,
      };
      const responseJson = await apiJson
        .put(
          `http://localhost:3000/api/enclosure/addEnrichmentItemToEnclosure/`,
          assignEnrichmentItemApiObj
        )
        .then((res) => {
          setRefreshSeed([]);

          toastShadcn({
            title: "Assignment Successful",
            description: "Successfully assigned selected enrichment items ",
          });
          setEnrichmentItemAssignmentDialog(false);
          setEnrichmentItemBulkAssignmentDialog(false);
          setSelectedAvailableEnrichmentItems([]);
        })
        .catch((err) => {

          toastShadcn({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description:
              "An error has occurred while assigning enrichment items: \n" +
              apiJson.error,
          });
        });

    });
  };

  const enrichmentItemAssignmentDialogFooter = (
    <React.Fragment>
      <Button variant={"destructive"} onClick={hideEnrichmentItemAssignmentDialog}>
        <HiX />
        No
      </Button>
      <Button onClick={bulkAssignEnrichmentItems}>
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>
  );

  const imageBodyTemplate = (rowData: EnrichmentItem) => {
    return (
      (rowData.enrichmentItemImageUrl ?
        <img
          src={"http://localhost:3000/" + rowData.enrichmentItemImageUrl}
          alt={rowData.enrichmentItemName}
          className="aspect-square w-16 rounded-full border border-white object-cover shadow-4"
        /> : "-")
    );
  };

  return (
    <div>
      <DataTable
        ref={dt}
        value={enrichmentItemList}
        selection={selectedEnrichmentItem}
        onSelectionChange={(e) => {
          if (Array.isArray(e.value)) {
            setSelectedEnrichmentItem(e.value);
          }
        }}
        dataKey="enrichmentItemId"
        paginator
        // showGridlines
        rows={25}
        scrollable
        selectionMode={"single"}
        rowsPerPageOptions={[10, 25, 50, 100]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} enrichment items"
        globalFilter={globalFilter}
        header={header}
        sortField={"species.enrichmentItemName"}
      >
        <Column
          field="enrichmentItemImageUrl"
          header="Image"
          frozen
          body={imageBodyTemplate}
          style={{ minWidth: "6rem" }}
        ></Column>
        <Column
          field="enrichmentItemId"
          header="ID"
          sortable
          style={{ minWidth: "4rem" }}
        ></Column>
        <Column
          field="enrichmentItemName"
          header="Name"
          sortable
          style={{ minWidth: "5rem" }}
        ></Column>
        <Column
          body={actionBodyTemplate}
          header="Actions"
          frozen
          alignFrozen="right"
          exportable={false}
        ></Column>
      </DataTable>{" "}
      <Dialog
        visible={removeEnrichmentItemDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={removeEnrichmentItemDialogFooter}
        onHide={hideRemoveEnrichmentItemDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedEnrichmentItem && (
            <span>
              Are you sure you want to remove{" "}
              <b>
                {selectedEnrichmentItem.enrichmentItemName}
              </b>{" "}
              from the current enclosure? ?
            </span>
          )}
        </div>
      </Dialog>
      {/* Dialogs to add enrichmentItem */}
      <Dialog
        visible={enrichmentItemAssignmentDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={enrichmentItemAssignmentDialogFooter}
        onHide={hideEnrichmentItemAssignmentDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedEnrichmentItem && (
            <span>
              Are you sure you want to assign the selected enrichment items to the
              current enclosure?
            </span>
          )}
        </div>
      </Dialog>
      <Dialog
        visible={enrichmentItemBulkAssignmentDialog}
        style={{ width: "50vw", height: "70vh" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Assign Enrichment Items"
        footer={
          <Button
            onClick={confirmAssignment}
            disabled={selectedAvailableEnrichmentItems.length == 0}
          >
            Assign Selected Enrichment Items
          </Button>
        }
        onHide={hideEnrichmentItemBulkAssignmentDialog}
      >
        <div className="confirmation-content">
          <DataTable
            ref={dt}
            value={availableEnrichmentItems}
            selection={selectedEnrichmentItem}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setSelectedEnrichmentItem(e.value);
              }
            }}
            dataKey="enrichmentItemId"
            paginator
            rows={10}
            scrollable
            selectionMode={"single"}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} enrichment items"
            globalFilter={globalFilter}
            header={bulkAssignmentHeader}
          >
            <Column
              body={availableEnrichmentItemCheckbox}
            ></Column>
            <Column
              field="enrichmentItemImageUrl"
              header="Image"
              frozen
              body={imageBodyTemplate}
              style={{ minWidth: "6rem" }}
            ></Column>
            <Column
              field="enrichmentItemId"
              header="ID"
              sortable
              style={{ minWidth: "4rem" }}
            ></Column>
            <Column
              field="enrichmentItemName"
              header="Name"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
          </DataTable>
        </div>
      </Dialog>
    </div>
  );
}

export default EnclosureEnrichmentItemDatatable;
