import React, { useEffect, useState, useRef } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { ProductService } from './service/ProductService';
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import EnrichmentItem from "../../../models/EnrichmentItem";
import useApiJson from "../../../hooks/useApiJson";
import { HiCheck, HiPencil, HiTrash, HiX } from "react-icons/hi";

import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

function AllEnrichmentItemDatatable() {
  const apiJson = useApiJson();

  let emptyEnrichmentItem: EnrichmentItem = {
    enrichmentItemId: -1,
    enrichmentItemName: "",
    enrichmentItemImageUrl: ""
  };

  const [enrichmentItemList, setEnrichmentItemList] = useState<EnrichmentItem[]>([]);
  const [selectedEnrichmentItem, setSelectedEnrichmentItem] = useState<EnrichmentItem>(emptyEnrichmentItem);
  const [deleteEnrichmentItemDialog, setDeleteEnrichmentItemDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<EnrichmentItem[]>>(null);

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

  const rightToolbarTemplate = () => {
    return <Button onClick={exportCSV}>Export to .csv</Button>;
  };

  const imageBodyTemplate = (rowData: EnrichmentItem) => {
    return (
      <img
      src={"http://localhost:3000/" + rowData.enrichmentItemImageUrl}
      alt={rowData.enrichmentItemName}
        className="border-round shadow-2"
        style={{ width: "64px" }}
      />
    );
  };

  const navigateEditProduct = (enrichmentItem: EnrichmentItem) => {};

  const confirmDeleteEnrichmentItem = (enrichmentItem: EnrichmentItem) => {
    setSelectedEnrichmentItem(enrichmentItem);
    setDeleteEnrichmentItemDialog(true);
  };

  const hideDeleteEnrichmentItemDialog = () => {
    setDeleteEnrichmentItemDialog(false);
  };

  // delete enrichmentItem stuff
  const deleteEnrichmentItem = () => {
    let _enrichmentItem = enrichmentItemList.filter(
      (val) => val.enrichmentItemId !== selectedEnrichmentItem?.enrichmentItemId
    );

    setEnrichmentItemList(_enrichmentItem);
    setDeleteEnrichmentItemDialog(false);
    setSelectedEnrichmentItem(emptyEnrichmentItem);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "EnrichmentItem Deleted",
      life: 3000,
    });
  };

  const deleteEnrichmentItemDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeleteEnrichmentItemDialog}>
        <HiX />
        No
      </Button>
      <Button variant={"destructive"} onClick={deleteEnrichmentItem}>
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>
  );
  // end delete enrichmentItem stuff

  const actionBodyTemplate = (enrichmentItem: EnrichmentItem) => {
    return (
      <React.Fragment>
        <NavLink to={`/assetfacility/editenrichmentitem/${enrichmentItem.enrichmentItemName}`}>
          <Button className="mr-2">
            <HiPencil />
            <span>Edit</span>
          </Button>
        </NavLink>
        <Button
          variant={"destructive"}
          className="mr-2"
          onClick={() => confirmDeleteEnrichmentItem(enrichmentItem)}
        >
          <HiTrash />
          <span>Delete</span>
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
    </div>
  );

  return (
    <div>
      <div>
        <Toast ref={toast} />
        <div className="rounded-lg bg-white p-4">
          <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

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
            selectionMode={"single"}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} enrichmentItem"
            globalFilter={globalFilter}
            header={header}
          >
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
            <Column
              body={actionBodyTemplate}
              header="Actions"
              exportable={false}
              style={{ minWidth: "18rem" }}
            ></Column>
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
