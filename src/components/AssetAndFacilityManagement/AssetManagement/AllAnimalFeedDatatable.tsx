import React, { useEffect, useState, useRef } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { ProductService } from './service/ProductService';
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import AnimalFeed from "../../../models/AnimalFeed";
import useApiJson from "../../../hooks/useApiJson";
import { HiCheck, HiPencil, HiTrash, HiX } from "react-icons/hi";

import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { AnimalFeedCategory } from "src/enums/Enumerated";

function AllAnimalFeedDatatable() {
  const apiJson = useApiJson();

  let emptyAnimalFeed: AnimalFeed = {
    animalFeedId: -1,
    animalFeedName: "",
    animalFeedImageUrl: "",
    animalFeedCategory: AnimalFeedCategory.OTHERS
  };

  const [animalFeedList, setAnimalFeedList] = useState<AnimalFeed[]>([]);
  const [selectedAnimalFeed, setSelectedAnimalFeed] = useState<AnimalFeed>(emptyAnimalFeed);
  const [deleteAnimalFeedDialog, setDeleteAnimalFeedDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<AnimalFeed[]>>(null);

  useEffect(() => {
    apiJson.get("http://localhost:3000/api/animalFeed/getallanimalFeed");
  }, []);

  useEffect(() => {
    const animalFeedData = apiJson.result as AnimalFeed[];
    setAnimalFeedList(animalFeedData);
  }, [apiJson.loading]);

  //
  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const rightToolbarTemplate = () => {
    return <Button onClick={exportCSV}>Export to .csv</Button>;
  };

  const imageBodyTemplate = (rowData: AnimalFeed) => {
    return (
      <img
        src={rowData.animalFeedImageUrl}
        alt={rowData.animalFeedName}
        className="border-round shadow-2"
        style={{ width: "64px" }}
      />
    );
  };

  const navigateEditProduct = (animalFeed: AnimalFeed) => {};

  const confirmDeleteAnimalFeed = (animalFeed: AnimalFeed) => {
    setSelectedAnimalFeed(animalFeed);
    setDeleteAnimalFeedDialog(true);
  };

  const hideDeleteAnimalFeedDialog = () => {
    setDeleteAnimalFeedDialog(false);
  };

  // delete animalFeed stuff
  const deleteAnimalFeed = () => {
    let _animalFeed = animalFeedList.filter(
      (val) => val.animalFeedId !== selectedAnimalFeed?.animalFeedId
    );

    setAnimalFeedList(_animalFeed);
    setDeleteAnimalFeedDialog(false);
    setSelectedAnimalFeed(emptyAnimalFeed);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "AnimalFeed Deleted",
      life: 3000,
    });
  };

  const deleteAnimalFeedDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeleteAnimalFeedDialog}>
        <HiX />
        No
      </Button>
      <Button variant={"destructive"} onClick={deleteAnimalFeed}>
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>
  );
  // end delete animalFeed stuff

  const actionBodyTemplate = (animalFeed: AnimalFeed) => {
    return (
      <React.Fragment>
        <NavLink to={`/animalFeed/editanimalFeed/${animalFeed.animalFeedName}`}>
          <Button className="mr-2">
            <HiPencil />
            <span>Edit</span>
          </Button>
        </NavLink>
        <Button
          variant={"destructive"}
          className="mr-2"
          onClick={() => confirmDeleteAnimalFeed(animalFeed)}
        >
          <HiTrash />
          <span>Delete</span>
        </Button>
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Manage AnimalFeed</h4>
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
            value={animalFeedList}
            selection={selectedAnimalFeed}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setSelectedAnimalFeed(e.value);
              }
            }}
            dataKey="animalFeedId"
            paginator
            rows={10}
            selectionMode={"single"}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} animalFeed"
            globalFilter={globalFilter}
            header={header}
          >
            <Column
              field="animalFeedName"
              header="Name"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="animalFeedImageUrl"
              header="Image"
              body={imageBodyTemplate}
            ></Column>
            <Column
              field="animalFeedCategory"
              header="Animal Feed Category"
              sortable
              style={{ minWidth: "16rem" }}
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
        visible={deleteAnimalFeedDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteAnimalFeedDialogFooter}
        onHide={hideDeleteAnimalFeedDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedAnimalFeed && (
            <span>
              Are you sure you want to delete{" "}
              <b>{selectedAnimalFeed.animalFeedName}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default AllAnimalFeedDatatable;
