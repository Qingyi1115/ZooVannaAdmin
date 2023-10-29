import React, { useEffect, useState, useRef } from "react";
import useApiJson from "../../../hooks/useApiJson";
import {
  AnimalFeedCategory,
  AnimalGrowthStage,
  PresentationContainer,
  PresentationLocation,
  PresentationMethod,
} from "../../../enums/Enumurated";

import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
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
import SpeciesDietNeed from "../../../models/SpeciesDietNeed";

import { HiCheck, HiEye, HiPencil, HiTrash, HiX } from "react-icons/hi";

import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Species from "../../../models/Species";
import beautifyText from "../../../hooks/beautifyText";

interface DietNeedDatatableProps {
  dietNeedsList: SpeciesDietNeed[];
  setDietNeedsList: React.Dispatch<React.SetStateAction<SpeciesDietNeed[]>>;
  curSpecies: Species;
}

const emptyDietNeeds: SpeciesDietNeed = {
  speciesDietNeedId: -1,
  animalFeedCategory: AnimalFeedCategory.FISH,
  amountPerMealGram: 100,
  amountPerWeekGram: 1000,
  presentationContainer: PresentationContainer.SILICONE_DISH,
  presentationMethod: PresentationMethod.CHOPPED,
  presentationLocation: PresentationLocation.IN_CONTAINER,
  growthStage: AnimalGrowthStage.ADULT,
};

function DietNeedDatatable(props: DietNeedDatatableProps) {
  const { curSpecies, dietNeedsList, setDietNeedsList } = props;
  const apiJson = useApiJson();
  const [selectedDietNeeds, setSelectedDietNeeds] =
    useState<SpeciesDietNeed>(emptyDietNeeds);
  const [deleteSpeciesDietNeedsDialog, setDeleteSpeciesDietNeedsDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const dt = useRef<DataTable<SpeciesDietNeed[]>>(null);

  const toastShadcn = useToast().toast;

  //
  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  // Delete stuff
  const confirmDeleteDietaryReq = (speciesDietNeed: SpeciesDietNeed) => {
    setSelectedDietNeeds(speciesDietNeed);
    setDeleteSpeciesDietNeedsDialog(true);
  };

  const hideDeleteDietaryReqDialog = () => {
    setDeleteSpeciesDietNeedsDialog(false);
  };

  // delete species stuff
  const deleteSpeciesDietaryReq = async () => {
    let _dietNeedsList = dietNeedsList.filter(
      (val) => val.speciesDietNeedId !== selectedDietNeeds?.speciesDietNeedId
    );

    const deleteSpeciesDietaryReqApi = async () => {
      try {
        const responseJson = await apiJson.del(
          "http://localhost:3000/api/species/deleteDietNeed/" +
          selectedDietNeeds?.speciesDietNeedId
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description: "Successfully deleted species dietary requirements",
        });
        setDietNeedsList(_dietNeedsList);
        setDeleteSpeciesDietNeedsDialog(false);
        setSelectedDietNeeds(emptyDietNeeds);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while deleting species dietary requirements: \n" +
            apiJson.error,
        });
      }
    };
    deleteSpeciesDietaryReqApi();
  };

  const deleteSpeciesDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeleteDietaryReqDialog}>
        <HiX className="mr-2" />
        No
      </Button>
      <Button variant={"destructive"} onClick={deleteSpeciesDietaryReq}>
        <HiCheck className="mr-2" />
        Yes
      </Button>
    </React.Fragment>
  );
  // end delete stuff

  const actionBodyTemplate = (speciesDietNeed: SpeciesDietNeed) => {
    return (
      <React.Fragment>
        <NavLink
          to={`/species/editdietaryrequirements/${curSpecies.speciesCode}/${speciesDietNeed.speciesDietNeedId}`}
        >
          <Button className="mr-2">
            <HiPencil className="mr-auto" />
            {/* <span>View Details</span> */}
          </Button>
        </NavLink>
        <Button
          variant={"destructive"}
          className="mr-2"
          onClick={() => confirmDeleteDietaryReq(speciesDietNeed)}
        >
          <HiTrash className="mx-auto" />
          {/* <span>Delete</span> */}
        </Button>
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Dietary Requirements</h4>
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
      <DataTable
        ref={dt}
        value={dietNeedsList}
        selection={selectedDietNeeds}
        onSelectionChange={(e) => {
          if (Array.isArray(e.value)) {
            setDietNeedsList(e.value);
          }
        }}
        dataKey="speciesDietNeedId"
        paginator
        // showGridlines
        rows={10}
        scrollable
        selectionMode={"single"}
        rowsPerPageOptions={[5, 10, 25]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} dietary requirements"
        globalFilter={globalFilter}
        header={header}
      >
        <Column
          field="growthStage"
          header="Growth Stage"
          body={(dietNeed: SpeciesDietNeed) => beautifyText(dietNeed.growthStage)}
          sortable
          style={{ minWidth: "10rem" }}
        ></Column>
        <Column
          field="animalFeedCategory"
          header="Feed Category"
          body={(dietNeed: SpeciesDietNeed) => beautifyText(dietNeed.animalFeedCategory)}
          sortable
          style={{ minWidth: "10rem" }}
        ></Column>
        <Column
          field="amountPerMealGramMale"
          header="Amount Per Meal (grams)"
          sortable
          style={{ minWidth: "10rem" }}
        ></Column>
        <Column
          field="amountPerWeekGramMale"
          header="Amount Per Week (grams)"
          sortable
          style={{ minWidth: "10rem" }}
        ></Column>
        <Column
          field="amountPerMealGramFemale"
          header="Amount Per Meal (grams)"
          sortable
          style={{ minWidth: "10rem" }}
        ></Column>
        <Column
          field="amountPerWeekGramFemale"
          header="Amount Per Week (grams)"
          sortable
          style={{ minWidth: "10rem" }}
        ></Column>
        <Column
          field="presentationContainer"
          header="Recommended Container"
          body={(dietNeed: SpeciesDietNeed) => beautifyText(dietNeed.presentationContainer)}
          sortable
          style={{ minWidth: "10rem" }}
        ></Column>
        <Column
          field="presentationMethod"
          header="Recommended Method"
          body={(dietNeed: SpeciesDietNeed) => beautifyText(dietNeed.presentationMethod)}
          sortable
          style={{ minWidth: "10rem" }}
        ></Column>
        <Column
          field="presentationLocation"
          header="Feed Location"
          body={(dietNeed: SpeciesDietNeed) => beautifyText(dietNeed.presentationLocation)}
          sortable
          style={{ minWidth: "10rem" }}
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
      <Dialog
        visible={deleteSpeciesDietNeedsDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteSpeciesDialogFooter}
        onHide={hideDeleteDietaryReqDialog}
      >
        <div className="confirmation-content">
          <i className="" />
          {selectedDietNeeds && (
            <span>
              Are you sure you want to delete the current dietary requirements?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default DietNeedDatatable;
