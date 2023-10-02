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
  AnimalGrowthStage,
  AnimalSex,
} from "../../../enums/Enumurated";
import AnimalWeight from "../../../models/AnimalWeight";

let emptyAnimalWeight: AnimalWeight = {
  animalWeightId: -1,
  dateOfMeasure: new Date(),
  weightInKg: -1,
};

interface AnimalWeightDatatableProps {
  animalWeightList: AnimalWeight[];
  setAnimalWeightList: any;
}

function AnimalWeightDatatable(props: AnimalWeightDatatableProps) {
  const apiJson = useApiJson();

  const { animalWeightList, setAnimalWeightList } = props;

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };

  //   const [animalWeightList, setAnimalWeightList] = useState<AnimalWeight[]>([]);
  const [selectedAnimalWeight, setSelectedAnimalWeight] =
    useState<AnimalWeight>(emptyAnimalWeight);
  const [deleteAnimalWeightDialog, setDeleteAnimalWeightDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | Animal[]
  >([]);

  const dt = useRef<DataTable<AnimalWeight[]>>(null);

  const toastShadcn = useToast().toast;

  //
  useEffect(() => {
    const fetchAnimalWeight = async () => {
      try {
        const responseJson = await apiJson.get(
          "http://localhost:3000/api/animal/getanimalweight/"
        );
        setAnimalWeightList(responseJson as AnimalWeight[]);
      } catch (error: any) {
        console.log(error);
      }
    };
    // fetchAnimalWeight();
  }, []);

  //
  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  // delete animal stuff
  const confirmDeleteAnimalWeight = (animalWeight: AnimalWeight) => {
    setSelectedAnimalWeight(animalWeight);
    setDeleteAnimalWeightDialog(true);
  };

  const hideDeleteAnimalWeightDialog = () => {
    setDeleteAnimalWeightDialog(false);
  };

  const deleteAnimal = async () => {
    let _animalWeights = animalWeightList.filter(
      (val) => val.animalWeightId !== selectedAnimalWeight?.animalWeightId
    );

    const deleteAnimalWeightApi = async () => {
      try {
        const responseJson = await apiJson.del(
          "http://localhost:3000/api/animal/deleteanimalweight/" +
            selectedAnimalWeight.animalWeightId
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description: "Successfully deleted animal weight entry",
        });
        setAnimalWeightList(_animalWeights);
        setDeleteAnimalWeightDialog(false);
        setSelectedAnimalWeight(emptyAnimalWeight);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while deleting animal weight entry" +
            apiJson.error,
        });
      }
    };
    // deleteAnimalApi();
  };

  const deleteAnimalWeightDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeleteAnimalWeightDialog}>
        <HiX className="mr-2" />
        No
      </Button>
      <Button variant={"destructive"} onClick={deleteAnimal}>
        <HiCheck className="mr-2" />
        Yes
      </Button>
    </React.Fragment>
  );
  // end delete animal stuff

  const actionBodyTemplate = (animalWeight: AnimalWeight) => {
    return (
      <React.Fragment>
        <div className="mx-auto">
          {/* <NavLink to={`/animal/viewanimaldetails/${animal.animalCode}`}>
            <Button className="mr-2">
              <HiEye className="mr-auto" />
            </Button>
          </NavLink> */}
          <Button
            variant={"destructive"}
            className="mr-2"
            onClick={() => confirmDeleteAnimalWeight(animalWeight)}
          >
            <HiTrash className="mx-auto" />
          </Button>
        </div>
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Weight Records</h4>
      {/* <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          placeholder="Search..."
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            setGlobalFilter(target.value);
          }}
        />
      </span> */}
    </div>
  );

  return (
    <div>
      <div>
        <div className="rounded-lg bg-white p-4">
          <DataTable
            ref={dt}
            value={animalWeightList}
            selection={selectedAnimalWeight}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setSelectedAnimalWeight(e.value);
              }
            }}
            dataKey="animalWeightId"
            paginator
            // showGridlines
            rows={10}
            scrollable
            selectionMode={"single"}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} individual/group animals"
            globalFilter={globalFilter}
            header={header}
          >
            {/* <Column
          field="imageUrl"
          header="Image"
          frozen
          body={imageBodyTemplate}
          style={{ minWidth: "6rem" }}
        ></Column> */}
            <Column
              field="animalWeightId"
              header="ID"
              sortable
              style={{ minWidth: "4rem" }}
            ></Column>
            <Column
              body={(animalWeight) => {
                return new Date(animalWeight.dateOfMeasure).toLocaleDateString(
                  "en-SG",
                  dateOptions
                );
              }}
              field="dateOfMeasure"
              header="Date of Measurement"
              sortable
              style={{ minWidth: "4rem" }}
            ></Column>
            <Column
              field="weightInKg"
              header="Weight (kg)"
              sortable
              style={{ minWidth: "4rem" }}
            ></Column>
            {/*  */}
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
        visible={deleteAnimalWeightDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteAnimalWeightDialogFooter}
        onHide={hideDeleteAnimalWeightDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedAnimalWeight && (
            <span>
              Are you sure you want to delete this animal weight entry?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default AnimalWeightDatatable;
