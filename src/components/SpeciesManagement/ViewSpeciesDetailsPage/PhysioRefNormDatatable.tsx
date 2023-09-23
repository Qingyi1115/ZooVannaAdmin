import React, { useEffect, useState, useRef } from "react";
import useApiJson from "../../../hooks/useApiJson";
import {
  AnimalFeedCategory,
  AnimalGrowthStage,
  AnimalGrowthState,
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
import PhysiologicalReferenceNorms from "../../../models/PhysiologicalReferenceNorms";
import { useNavigate } from "react-router-dom";

interface PhysioRefNormDatatableProps {
  physiologicalRefNormsList: PhysiologicalReferenceNorms[];
  setPhysiologicalRefNormsList: React.Dispatch<
    React.SetStateAction<PhysiologicalReferenceNorms[]>
  >;
  curSpecies: Species;
}

const emptyPhysioRefNorm: PhysiologicalReferenceNorms = {
  physiologicalRefId: 1,
  sizeMaleCm: 100,
  sizeFemaleCm: 90,
  weightMaleKg: 200,
  weightFemaleKg: 190,
  ageToGrowthAge: 15,
  growthStage: AnimalGrowthStage.JUVENILE,
};

function PhysioRefNormDatatable(props: PhysioRefNormDatatableProps) {
  const {
    curSpecies,
    physiologicalRefNormsList,
    setPhysiologicalRefNormsList,
  } = props;

  const apiJson = useApiJson();
  const [selectedPhysioRefNorm, setSelectedPhysioRefNorm] =
    useState<PhysiologicalReferenceNorms>(emptyPhysioRefNorm);
  const [deletePhysioRefNormDialog, setDeletePhysioRefNormDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const dt = useRef<DataTable<PhysiologicalReferenceNorms[]>>(null);

  const toastShadcn = useToast().toast;
  const navigate = useNavigate();
  // Delete stuff
  const confirmDeletePhysioRefNorm = (
    physioRefNorm: PhysiologicalReferenceNorms
  ) => {
    setSelectedPhysioRefNorm(physioRefNorm);
    setDeletePhysioRefNormDialog(true);
  };

  const hideDeletePhysioRefNormDialog = () => {
    setDeletePhysioRefNormDialog(false);
  };

  // delete species stuff
  const deletePhysioRefNorm = async () => {
    let _physiologicalRefNormsList = physiologicalRefNormsList.filter(
      (val) =>
        val.physiologicalRefId !== selectedPhysioRefNorm?.physiologicalRefId
    );

    const deletePhysioRefNormApi = async () => {
      try {
        const responseJson = await apiJson.del(
          "http://localhost:3000/api/species/deletePhysiologicalReferenceNorms/" +
            selectedPhysioRefNorm?.physiologicalRefId
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description:
            "Successfully deleted the species physiological reference norm",
        });
        setPhysiologicalRefNormsList(_physiologicalRefNormsList);
        setDeletePhysioRefNormDialog(false);
        setSelectedPhysioRefNorm(emptyPhysioRefNorm);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while deleting species physiological reference norm: \n" +
            apiJson.error,
        });
      }
    };
    deletePhysioRefNormApi();
  };

  const deletePhysioRefNormDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeletePhysioRefNormDialog}>
        <HiX className="mr-2" />
        No
      </Button>
      <Button variant={"destructive"} onClick={deletePhysioRefNorm}>
        <HiCheck className="mr-2" />
        Yes
      </Button>
    </React.Fragment>
  );
  // end delete stuff

  const actionBodyTemplate = (physioRefNorm: PhysiologicalReferenceNorms) => {
    return (
      <React.Fragment>
        <NavLink
          to={`/species/editphysiorefnorm/${curSpecies.speciesCode}/${physioRefNorm.physiologicalRefId}`}
        >
          <Button className="mr-2">
            <HiEye className="mr-auto" />
            {/* <span>View Details</span> */}
          </Button>
        </NavLink>
        <Button
          variant={"destructive"}
          className="mr-2"
          onClick={() => confirmDeletePhysioRefNorm(physioRefNorm)}
        >
          <HiTrash className="mx-auto" />
          {/* <span>Delete</span> */}
        </Button>
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Physiological Reference Norms</h4>
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
        value={physiologicalRefNormsList}
        selection={selectedPhysioRefNorm}
        onSelectionChange={(e) => {
          if (Array.isArray(e.value)) {
            setPhysiologicalRefNormsList(e.value);
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
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} physiological reference norms"
        globalFilter={globalFilter}
        header={header}
      >
        <Column
          field="physiologicalRefId"
          header="ID"
          sortable
          style={{ minWidth: "4rem" }}
        ></Column>
        <Column
          field="growthStage"
          header="Growth Stage"
          sortable
          style={{ minWidth: "12rem" }}
        ></Column>
        <Column
          field="ageToGrowthAge"
          header="Age to Reach Growth Stage"
          sortable
          style={{ minWidth: "12rem" }}
        ></Column>
        <Column
          field="sizeMaleCm"
          header="Average Size Male (cm)"
          sortable
          style={{ minWidth: "12rem" }}
        ></Column>
        <Column
          field="weightMaleKg"
          header="Average Weight Male (kg)"
          sortable
          style={{ minWidth: "12rem" }}
        ></Column>
        <Column
          field="sizeFemaleCm"
          header="Average Size Female (cm)"
          sortable
          style={{ minWidth: "12rem" }}
        ></Column>
        <Column
          field="weightFemaleKg"
          header="Average Weight Female (kg)"
          sortable
          style={{ minWidth: "12rem" }}
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
        visible={deletePhysioRefNormDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deletePhysioRefNormDialogFooter}
        onHide={hideDeletePhysioRefNormDialog}
      >
        <div className="confirmation-content">
          <i className="" />
          {selectedPhysioRefNorm && (
            <span>
              Are you sure you want to delete the current physiological
              reference norm?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default PhysioRefNormDatatable;
