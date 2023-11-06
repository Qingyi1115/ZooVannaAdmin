import React, { useEffect, useRef, useState } from "react";

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
// import { ProductService } from './service/ProductService';
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

import { HiCheck, HiPencil, HiPlus, HiTrash, HiX } from "react-icons/hi";
import useApiJson from "../../../../hooks/useApiJson";
import AnimalFeed from "../../../../models/AnimalFeed";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { AnimalFeedCategory } from "../../../../enums/AnimalFeedCategory";
import beautifyText from "../../../../hooks/beautifyText";
import { useAuthContext } from "../../../../hooks/useAuthContext";

function AllAnimalFeedDatatable() {
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const employee = useAuthContext().state.user?.employeeData;

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
    apiJson.get(
      "http://localhost:3000/api/assetfacility/getallanimalfeed")
      .then(res => { setAnimalFeedList(res.animalFeeds as AnimalFeed[]); })
      .catch(e => console.log(e));
  }, []);

  //
  const exportCSV = () => {
    dt.current?.exportCSV();
  };


  const imageBodyTemplate = (rowData: AnimalFeed) => {
    return (
      (rowData.animalFeedImageUrl ?
        <img
          src={"http://localhost:3000/" + rowData.animalFeedImageUrl}
          alt={rowData.animalFeedName}
          className="aspect-square w-16 rounded-full border border-white object-cover shadow-4"
        /> : "-")
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
        <Button className="mr-2" onClick={() => {
          navigate(`/assetfacility/viewallassets/animalFeed`, { replace: true });
          navigate(`/assetfacility/editanimalfeed/${animalFeed.animalFeedId}`);
        }}>
          <HiPencil className="mx-auto" />
        </Button>
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
      <h4 className="m-1">Manage Animal Feed</h4>
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
        <Button className="mr-2" onClick={() => {
          navigate(`/assetfacility/viewallassets/animalFeed`, { replace: true });
          navigate(`/assetfacility/createanimalfeed`);
        }}>
          <HiPlus className="mr-auto" />
          Add Animal Feed
        </Button> :
        <Button disabled className="invisible">
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
            scrollable
            selectionMode={"single"}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} animal feeds"
            globalFilter={globalFilter}
            header={header}
          >
            <Column
              field="animalFeedImageUrl"
              header="Image"
              frozen
              body={imageBodyTemplate}
              style={{ minWidth: "6rem" }}
            ></Column>
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
              field="animalFeedCategory"
              body={(animalFeed: AnimalFeed) => beautifyText(animalFeed.animalFeedCategory)}
              header="Animal Feed Category"
              sortable
              style={{ minWidth: "16rem" }}
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
