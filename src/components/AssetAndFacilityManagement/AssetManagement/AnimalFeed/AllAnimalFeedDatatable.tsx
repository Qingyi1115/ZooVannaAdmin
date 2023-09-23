import React, { useEffect, useState, useRef } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { ProductService } from './service/ProductService';
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import AnimalFeed from "../../../../models/AnimalFeed";
import useApiJson from "../../../../hooks/useApiJson";
import { HiCheck, HiEye, HiPencil, HiTrash, HiX } from "react-icons/hi";

import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import { AnimalFeedCategory } from "../../../../enums/AnimalFeedCategory";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

function AllAnimalFeedDatatable() {
  const apiJson = useApiJson();
  const navigate = useNavigate();

  let emptyAnimalFeed: AnimalFeed = {
    animalFeedId: -1,
    animalFeedName: "",
    animalFeedImageUrl: "",
    animalFeedCategory: AnimalFeedCategory.OTHERS,
  };

  const [animalFeedList, setAnimalFeedList] = useState<AnimalFeed[]>([]);
  const [selectedAnimalFeed, setSelectedAnimalFeed] =
    useState<AnimalFeed>(emptyAnimalFeed);
  const [deleteAnimalFeedDialog, setDeleteAnimalFeedDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<AnimalFeed[]>>(null);
  const toastShadcn = useToast().toast;

  useEffect(() => {
    const fetchAnimalFeed = async () => {
      try {
        const responseJson = await apiJson.get(
          "http://localhost:3000/api/assetfacility/getallanimalfeed"
        );
        setAnimalFeedList(responseJson as AnimalFeed[]);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchAnimalFeed();
  }, []);

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
        src={"http://localhost:3000/" + rowData.animalFeedImageUrl}
        alt={rowData.animalFeedName}
        className="aspect-square w-16 rounded-full border border-white object-cover shadow-4"
      />
    );
  };

  const navigateEditProduct = (animalFeed: AnimalFeed) => { };

  const confirmDeleteAnimalFeed = (animalFeed: AnimalFeed) => {
    setSelectedAnimalFeed(animalFeed);
    setDeleteAnimalFeedDialog(true);
  };

  const hideDeleteAnimalFeedDialog = () => {
    setDeleteAnimalFeedDialog(false);
  };

  // delete animalFeed stuff
  const deleteAnimalFeed = async () => {
    let _animalFeed = animalFeedList.filter(
      (val) => val.animalFeedId !== selectedAnimalFeed?.animalFeedId
    );

    const deleteAnimalFeed = async () => {
      try {
        const responseJson = await apiJson.del(
          "http://localhost:3000/api/assetFacility/deleteAnimalFeed/" +
          selectedAnimalFeed.animalFeedName
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description:
            "Successfully deleted animal feed: " +
            selectedAnimalFeed.animalFeedName,
        });
        setAnimalFeedList(_animalFeed);
        setDeleteAnimalFeedDialog(false);
        setSelectedAnimalFeed(emptyAnimalFeed);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while deleting animalFeed: \n" +
            apiJson.error,
        });
      }
    };
    deleteAnimalFeed();
  };

  const deleteAnimalFeedDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeleteAnimalFeedDialog}>
        <HiX className="mr-2" />
        No
      </Button>
      <Button variant={"destructive"} onClick={deleteAnimalFeed}>
        <HiCheck className="mr-2" />
        Yes
      </Button>
    </React.Fragment>
  );
  // end delete animalFeed stuff

  const actionBodyTemplate = (animalFeed: AnimalFeed) => {
    return (
      <React.Fragment>
        <NavLink
          to={`/assetfacility/editanimalfeed/${animalFeed.animalFeedName}`}
        >
          <Button className="mr-2">
            <HiPencil className="mr-auto" />
          </Button>
        </NavLink>
        <Button
          variant={"destructive"}
          className="mr-2"
          onClick={() => confirmDeleteAnimalFeed(animalFeed)}
        >
          <HiTrash className="mx-auto" />
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
          {/* Title Header and back button */}
          <div className="flex flex-col">
            <div className="mb-4 flex justify-between">
              <Button variant={"outline"} type="button" onClick={() => navigate(-1)} className="">
                Back
              </Button>
              <span className="self-center text-title-xl font-bold">
                All Animal Feed
              </span>
              <Button disabled className="invisible">
                Back
              </Button>
            </div>
            <Separator />
          </div>

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
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} animal feeds"
            globalFilter={globalFilter}
            header={header}
          >
            <Column
              field="animalFeedId"
              header="ID"
              sortable
              style={{ minWidth: "4rem" }}
            ></Column>
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
              style={{ minWidth: "9rem" }}
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
