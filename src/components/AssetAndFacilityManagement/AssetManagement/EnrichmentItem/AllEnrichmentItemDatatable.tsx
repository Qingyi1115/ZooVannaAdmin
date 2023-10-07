import React, { useEffect, useState, useRef } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { ProductService } from './service/ProductService';
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import EnrichmentItem from "../../../../models/EnrichmentItem";
import useApiJson from "../../../../hooks/useApiJson";
import { HiCheck, HiEye, HiPencil, HiPlus, HiTrash, HiX } from "react-icons/hi";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { useAuthContext } from "../../../../hooks/useAuthContext";

function AllEnrichmentItemDatatable() {
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const employee = useAuthContext().state.user?.employeeData;

  let emptyEnrichmentItem: EnrichmentItem = {
    enrichmentItemId: -1,
    enrichmentItemName: "",
    enrichmentItemImageUrl: "",
  };

  const [enrichmentItemList, setEnrichmentItemList] = useState<
    EnrichmentItem[]
  >([]);
  const [selectedEnrichmentItem, setSelectedEnrichmentItem] =
    useState<EnrichmentItem>(emptyEnrichmentItem);
  const [deleteEnrichmentItemDialog, setDeleteEnrichmentItemDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<EnrichmentItem[]>>(null);
  const toastShadcn = useToast().toast;

  useEffect(() => {
    const fetchEnrichmentItem = async () => {
      try {
        const responseJson = await apiJson.get(
          "http://localhost:3000/api/assetfacility/getallenrichmentItem"
        );
        setEnrichmentItemList(responseJson as EnrichmentItem[]);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchEnrichmentItem();
  }, []);

  //
  const exportCSV = () => {
    dt.current?.exportCSV();
  };


  const imageBodyTemplate = (rowData: EnrichmentItem) => {
    return (
      <img
        src={"http://localhost:3000/" + rowData.enrichmentItemImageUrl}
        alt={rowData.enrichmentItemName}
        className="aspect-square w-16 rounded-full border border-white object-cover shadow-4"
      />
    );
  };

  const navigateEditProduct = (enrichmentItem: EnrichmentItem) => { };

  const confirmDeleteEnrichmentItem = (enrichmentItem: EnrichmentItem) => {
    setSelectedEnrichmentItem(enrichmentItem);
    setDeleteEnrichmentItemDialog(true);
  };

  const hideDeleteEnrichmentItemDialog = () => {
    setDeleteEnrichmentItemDialog(false);
  };

  // delete enrichmentItem stuff
  const deleteEnrichmentItem = async () => {
    let _enrichmentItem = enrichmentItemList.filter(
      (val) => val.enrichmentItemId !== selectedEnrichmentItem?.enrichmentItemId
    );

    const deleteEnrichmentItem = async () => {
      try {
        const responseJson = await apiJson.del(
          "http://localhost:3000/api/assetFacility/deleteEnrichmentItem/" +
          selectedEnrichmentItem.enrichmentItemName
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description:
            "Successfully deleted enrichment item: " +
            selectedEnrichmentItem.enrichmentItemName,
        });
        setEnrichmentItemList(_enrichmentItem);
        setDeleteEnrichmentItemDialog(false);
        setSelectedEnrichmentItem(emptyEnrichmentItem);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while deleting enrichmentItem: \n" +
            apiJson.error,
        });
      }
    };
    deleteEnrichmentItem();
  };

  const deleteEnrichmentItemDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeleteEnrichmentItemDialog}>
        <HiX className="mr-2" />
        No
      </Button>
      <Button variant={"destructive"} onClick={deleteEnrichmentItem}>
        <HiCheck className="mr-2" />
        Yes
      </Button>
    </React.Fragment>
  );
  // end delete enrichmentItem stuff

  const actionBodyTemplate = (enrichmentItem: EnrichmentItem) => {
    return (
      <React.Fragment>
          <Button className="mr-2" onClick={()=>{ 
                navigate(`/assetfacility/viewallassets/enrichmentItem`, { replace: true });
                navigate(`/assetfacility/editenrichmentitem/${enrichmentItem.enrichmentItemId}`);
              }}>
            <HiPencil className="mx-auto" />
          </Button>
        <Button
          variant={"destructive"}
          className="mr-2"
          onClick={() => confirmDeleteEnrichmentItem(enrichmentItem)}
        >
          <HiTrash className="mx-auto" />
        </Button>
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Manage Enrichment Items</h4>
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
      {(employee.superAdmin || employee.planningStaff?.plannerType == "CURATOR") ?
          <Button className="mr-2" onClick={()=>{ 
                navigate(`/assetfacility/viewallassets/enrichmentItem`, { replace: true });
                navigate("/assetfacility/createenrichmentitem");
              }}>
            <HiPlus className="mr-auto" />
            Add Enrichment Item
          </Button>: <Button disabled className="invisible">
          Export to .csv
        </Button>}
      <Button onClick={exportCSV}>Export to .csv</Button>
    </div>
  );

  return (
    <div>
      <div>
        <Toast ref={toast} />
        <div className="">

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
            rows={10}
            scrollable
            selectionMode={"single"}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} enrichment items"
            globalFilter={globalFilter}
            header={header}
          >
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
            <Column
              field="enrichmentItemImageUrl"
              header="Image"
              body={imageBodyTemplate}
            ></Column>
            {(employee.superAdmin || employee.planningStaff?.plannerType == "CURATOR") && (
              <Column
                body={actionBodyTemplate}
                header="Actions"
                frozen
                alignFrozen="right"
                exportable={false}
                style={{ minWidth: "9rem" }}
              ></Column>
            )}
          </DataTable>
        </div>
      </div>
      <Dialog
        visible={deleteEnrichmentItemDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteEnrichmentItemDialogFooter}
        onHide={hideDeleteEnrichmentItemDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedEnrichmentItem && (
            <span>
              Are you sure you want to delete{" "}
              <b>{selectedEnrichmentItem.enrichmentItemName}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default AllEnrichmentItemDatatable;
