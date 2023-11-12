import React, { useRef, useState } from "react";
import {
  AnimalGrowthStage
} from "../../../enums/Enumurated";
import useApiJson from "../../../hooks/useApiJson";

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
// import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import { HiCheck, HiPencil, HiTrash, HiX } from "react-icons/hi";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { NavLink, useNavigate } from "react-router-dom";
import beautifyText from "../../../hooks/beautifyText";
import PhysiologicalReferenceNorms from "../../../models/PhysiologicalReferenceNorms";
import Species from "../../../models/Species";

interface PhysioRefNormDatatableProps {
  physiologicalRefNormsList: PhysiologicalReferenceNorms[];
  setPhysiologicalRefNormsList: React.Dispatch<
    React.SetStateAction<PhysiologicalReferenceNorms[]>
  >;
  curSpecies: Species;
}

const emptyPhysioRefNorm: PhysiologicalReferenceNorms = {
  physiologicalRefId: -1,
  minSizeMaleCm: 100,
  minSizeFemaleCm: 90,
  minWeightMaleKg: 200,
  minWeightFemaleKg: 190,
  maxSizeMaleCm: 100,
  maxSizeFemaleCm: 90,
  maxWeightMaleKg: 200,
  maxWeightFemaleKg: 190,
  minAge: 10,
  maxAge: 15,
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
            <HiPencil className="mr-auto" />
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
        dataKey="physiologicalRefId"
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
          body={(physiologicalReferenceNorm: PhysiologicalReferenceNorms) => beautifyText(physiologicalReferenceNorm.growthStage)}
          sortable
          style={{ minWidth: "10rem" }}
        ></Column>
        <Column
          field="minAge"
          header="Start Age (years)"
          sortable
          style={{ minWidth: "6rem" }}
        ></Column>
        <Column
          field="maxAge"
          header="End Age (years)"
          sortable
          style={{ minWidth: "6rem" }}
        ></Column>
        <Column
          field="minSizeMaleCm"
          header="Min Size Male (cm)"
          sortable
          style={{ minWidth: "12rem" }}
        ></Column>
        <Column
          field="maxSizeMaleCm"
          header="Max Size Male (cm)"
          sortable
          style={{ minWidth: "12rem" }}
        ></Column>
        <Column
          field="minWeightMaleKg"
          header="Min Weight Male (kg)"
          sortable
          style={{ minWidth: "12rem" }}
        ></Column>
        <Column
          field="maxWeightMaleKg"
          header="Max Weight Male (kg)"
          sortable
          style={{ minWidth: "12rem" }}
        ></Column>
        <Column
          field="minSizeFemaleCm"
          header="Min Size Female (cm)"
          sortable
          style={{ minWidth: "12rem" }}
        ></Column>
        <Column
          field="maxSizeFemaleCm"
          header="Max Size Female (cm)"
          sortable
          style={{ minWidth: "12rem" }}
        ></Column>
        <Column
          field="minWeightFemaleKg"
          header="Min Weight Female (kg)"
          sortable
          style={{ minWidth: "12rem" }}
        ></Column>
        <Column
          field="maxWeightFemaleKg"
          header="Max Weight Female (kg)"
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
