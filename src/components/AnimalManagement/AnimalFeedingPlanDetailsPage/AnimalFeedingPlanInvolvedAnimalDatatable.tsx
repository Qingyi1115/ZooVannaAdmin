import React, { useEffect, useState, useRef } from "react";

import { classNames } from "primereact/utils";
import { DataTable, DataTableExpandedRows } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import useApiJson from "../../../hooks/useApiJson";

import { useToast } from "@/components/ui/use-toast";
import Animal from "../../../models/Animal";

interface AnimalFeedingPlanInvolvedAnimalDatatableProps {
  involvedAnimalList: Animal[];
}

function AnimalFeedingPlanInvolvedAnimalDatatable(
  props: AnimalFeedingPlanInvolvedAnimalDatatableProps
) {
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };

  const { involvedAnimalList } = props;
  const [involvedAnimalGlobalFiler, setInvolvedAnimalGlobalFilter] =
    useState<string>("");

  const animalImageBodyTemplate = (rowData: Animal) => {
    return (
      <img
        src={"http://localhost:3000/" + rowData.imageUrl}
        alt={rowData.houseName}
        className="aspect-square h-10 w-10 rounded-full border border-white object-cover shadow-4"
      />
    );
  };

  const statusTemplate = (animal: Animal) => {
    const statuses = animal.animalStatus.split(",");

    return (
      <React.Fragment>
        <div className="flex flex-col gap-1">
          {statuses.map((status, index) => (
            <div
              key={index}
              className={
                status === "NORMAL"
                  ? "flex items-center justify-center rounded bg-emerald-100 p-[0.1rem] text-sm font-bold text-emerald-900"
                  : status === "PREGNANT"
                  ? "flex items-center justify-center rounded bg-orange-100 p-[0.1rem] text-sm font-bold text-orange-900"
                  : status === "SICK"
                  ? "flex items-center justify-center rounded bg-yellow-100 p-[0.1rem] text-sm font-bold text-yellow-900"
                  : status === "INJURED"
                  ? "flex items-center justify-center rounded bg-red-100 p-[0.1rem] text-sm font-bold text-red-900"
                  : status === "OFFSITE"
                  ? "flex items-center justify-center rounded bg-blue-100 p-[0.1rem] text-sm font-bold text-blue-900"
                  : status === "RELEASED"
                  ? "flex items-center justify-center rounded bg-fuchsia-100 p-[0.1rem] text-sm font-bold text-fuchsia-900"
                  : status === "DECEASED"
                  ? "flex items-center justify-center rounded bg-slate-300 p-[0.1rem] text-sm font-bold text-slate-900"
                  : "bg-gray-100 flex items-center justify-center rounded p-[0.1rem] text-sm font-bold text-black"
              }
            >
              {status}
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  };

  return (
    <div>
      <DataTable
        value={involvedAnimalList}
        scrollable
        scrollHeight="100%"
        // selection={selectedAnimalToBecomeParent!}
        selectionMode="single"
        globalFilter={involvedAnimalGlobalFiler}
        // onSelectionChange={(e) =>
        //   setSelectedAnimalToBecomeParent(e.value)
        // }
        style={{ height: "35vh" }}
        dataKey="animalCode"
        className="h-1/2 overflow-hidden rounded border border-graydark/30"
      >
        <Column
          field="imageUrl"
          body={animalImageBodyTemplate}
          style={{ minWidth: "3rem" }}
        ></Column>
        <Column
          field="animalCode"
          header="Code"
          sortable
          style={{ minWidth: "7rem" }}
        ></Column>
        <Column
          field="houseName"
          header="House Name"
          sortable
          style={{ minWidth: "5rem" }}
        ></Column>
        <Column
          body={statusTemplate}
          // field="animalStatus"
          header="Animal Status"
          sortable
          style={{ minWidth: "5rem" }}
        ></Column>
        <Column
          field="age"
          header="Animal Age"
          sortable
          style={{ minWidth: "5rem" }}
        ></Column>
        <Column
          field="growthStage"
          header="Growth Stage"
          sortable
          style={{ minWidth: "7rem" }}
        ></Column>
      </DataTable>
    </div>
  );
}

export default AnimalFeedingPlanInvolvedAnimalDatatable;
