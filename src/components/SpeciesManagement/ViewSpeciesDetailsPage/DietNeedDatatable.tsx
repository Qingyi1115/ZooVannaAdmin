import React, { useEffect, useState, useRef } from "react";

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

interface DietNeedDatatableProps {
  dietNeedsList: SpeciesDietNeed[];
  setDietNeedsList: React.Dispatch<React.SetStateAction<SpeciesDietNeed[]>>;
  curSpecies: Species;
}

const emptyDietNeeds: SpeciesDietNeed = {
  speciesDietNeedId: 1,
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
  const [selectedDietNeeds, setSelectedDietNeeds] =
    useState<SpeciesDietNeed>(emptyDietNeeds);
  const [deleteSpeciesDietNeedsDialog, setDeleteSpeciesDietNeedsDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const dt = useRef<DataTable<SpeciesDietNeed[]>>(null);

  //
  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const rightToolbarTemplate = () => {
    return <Button onClick={exportCSV}>Export to .csv</Button>;
  };

  const navigateEditProduct = (species: SpeciesDietNeed) => {};

  const confirmDeleteSpeciesDietNeed = (speciesDietNeed: SpeciesDietNeed) => {
    setSelectedDietNeeds(speciesDietNeed);
    setDeleteSpeciesDietNeedsDialog(true);
  };

  const hideDeleteSpeciesDialog = () => {
    setDeleteSpeciesDietNeedsDialog(false);
  };

  // delete species stuff
  const deleteSpecies = async () => {
    let _species = dietNeedsList.filter(
      (val) => val.speciesDietNeedId !== selectedDietNeeds?.speciesDietNeedId
    );

    // const deleteSpecies = async () => {
    //   try {
    //     const responseJson = await apiJson.del(
    //       "http://localhost:3000/api/species/deletespecies/" +
    //         selectedSpecies.speciesCode
    //     );

    //     toastShadcn({
    //       // variant: "destructive",
    //       title: "Deletion Successful",
    //       description:
    //         "Successfully deleted species: " + selectedSpeciesCommonName,
    //     });
    //     setSpeciesList(_species);
    //     setDeleteSpeciesDialog(false);
    //     setSelectedSpecies(emptySpecies);
    //   } catch (error: any) {
    //     // got error
    //     toastShadcn({
    //       variant: "destructive",
    //       title: "Uh oh! Something went wrong.",
    //       description:
    //         "An error has occurred while deleting species: \n" + apiJson.error,
    //     });
    //   }
    // };
    // deleteSpecies();
  };

  const deleteSpeciesDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeleteSpeciesDialog}>
        <HiX />
        No
      </Button>
      <Button variant={"destructive"} onClick={deleteSpecies}>
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>
  );
  // end delete species stuff

  const actionBodyTemplate = (speciesDietNeed: SpeciesDietNeed) => {
    return (
      <React.Fragment>
        <NavLink
          to={`/species/editdietaryrequirements/${curSpecies.speciesCode}/${speciesDietNeed.speciesDietNeedId}`}
        >
          <Button className="mb-1 mr-1">
            <HiEye className="mr-1" />
            <span>Edit</span>
          </Button>
        </NavLink>
        {/* <Button
          variant={"destructive"}
          className="mr-2"
          onClick={() => confirmDeleteSpecies(species)}
        >
          <HiTrash className="mr-1" />
          <span>Delete</span>
        </Button> */}
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
        dataKey="speciesId"
        paginator
        // showGridlines
        rows={10}
        scrollable
        selectionMode={"single"}
        rowsPerPageOptions={[5, 10, 25]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} species"
        globalFilter={globalFilter}
        header={header}
      >
        <Column
          field="growthStage"
          header="Growth Stage"
          sortable
          style={{ minWidth: "10rem" }}
        ></Column>
        <Column
          field="animalFeedCategory"
          header="Feed Category"
          sortable
          style={{ minWidth: "10rem" }}
        ></Column>
        <Column
          field="amountPerMealGram"
          header="Amount Per Meal (grams)"
          sortable
          style={{ minWidth: "10rem" }}
        ></Column>
        <Column
          field="amountPerWeekGram"
          header="Amount Per Week (grams)"
          sortable
          style={{ minWidth: "10rem" }}
        ></Column>
        <Column
          field="presentationContainer"
          header="Recommended Container"
          sortable
          style={{ minWidth: "10rem" }}
        ></Column>
        <Column
          field="presentationMethod"
          header="Recommended Method"
          sortable
          style={{ minWidth: "10rem" }}
        ></Column>
        <Column
          field="presentationLocation"
          header="Feed Location"
          sortable
          style={{ minWidth: "10rem" }}
        ></Column>
        <Column
          body={actionBodyTemplate}
          header="Actions"
          frozen
          alignFrozen="right"
          exportable={false}
          style={{ minWidth: "14rem" }}
        ></Column>
      </DataTable>
    </div>
  );
}

export default DietNeedDatatable;
