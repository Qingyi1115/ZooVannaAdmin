import React, { useState, useEffect } from "react";
import useApiJson from "../../hooks/useApiJson";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { DataTable } from "primereact/datatable";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { InputText } from "primereact/inputtext";

import Animal from "../../models/Animal";
import { HiEye } from "react-icons/hi";
import { MultiSelect } from "primereact/multiselect";
import Species from "../../models/Species";

function FatAnimalsCard() {
  const apiJson = useApiJson();
  const location = useLocation();
  const navigate = useNavigate();

  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [animalList, setAnimalList] = useState<Animal[]>([]);

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const responseJson = await apiJson.get(
          "http://localhost:3000/api/species/getallspecies"
        );
        setSpeciesList(responseJson as Species[]);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchSpecies();
  }, []);

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/animal/getAllAbnormalWeights/`
        );
        console.log("test");
        setAnimalList(responseJson as Animal[]);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchAnimal();
  }, []);

  // animal table
  const [animalGlobalFiler, setAnimalGlobalFilter] = useState<string>("");
  const animalImageBodyTemplate = (rowData: Animal) => {
    return (
      <img
        src={"http://localhost:3000/" + rowData.imageUrl}
        alt={rowData.houseName}
        className="aspect-square w-16 rounded-full border border-white object-cover shadow-4"
      />
    );
  };
  const animalActionBodyTemplate = (animal: Animal) => {
    return (
      <React.Fragment>
        <div className="mx-auto">
          {/* <NavLink to={`/animal/viewanimaldetails/${animal.animalCode}`}> */}
          <Button
            className="mr-2"
            onClick={() =>
              navigate(`/animal/viewanimaldetails/${animal.animalCode}/weight`)
            }
          >
            <HiEye className="mx-auto" />
          </Button>
          {/* </NavLink> */}
        </div>
      </React.Fragment>
    );
  };
  const speciesItemTemplate = (species: Species) => {
    return (
      <div className="align-items-center flex gap-2">
        <img
          alt={species.commonName}
          src={`"http://localhost:3000/"${species.imageUrl}`}
          width="32"
        />
        <span>{species.commonName}</span>
      </div>
    );
  };
  const speciesRowFilterTemplate = (
    options: ColumnFilterElementTemplateOptions
  ) => {
    return (
      <MultiSelect
        value={options.value}
        options={speciesList}
        itemTemplate={speciesItemTemplate}
        onChange={(e) => options.filterApplyCallback(e.value)}
        optionLabel="name"
        placeholder="Any"
        className="p-column-filter"
        maxSelectedLabels={1}
        style={{ minWidth: "14rem" }}
      />
    );
  };

  return (
    <Card className="h-max w-max">
      {" "}
      <CardHeader>
        <CardTitle>Abnormal Weight Warning!</CardTitle>
        <CardDescription className="w-[25vw]">
          The following animals have abnormal weights according to latest
          records
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          {/* <InputText
            type="search"
            placeholder="Search..."
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              setAnimalGlobalFilter(target.value);
            }}
            className="mb-2 h-full w-60"
          /> */}
        </div>
        <DataTable
          value={animalList}
          scrollable
          scrollHeight="100%"
          // selection={selectedAnimalToBecomeParent!}
          selectionMode="single"
          globalFilter={animalGlobalFiler}
          // onSelectionChange={(e) =>
          //   setSelectedAnimalToBecomeParent(e.value)
          // }
          style={{ height: "40vh", width: "25vw" }}
          dataKey="animalCode"
          className="h-1/2 overflow-hidden rounded border border-graydark/30"
          //   filterDisplay="row"
        >
          <Column
            field="imageUrl"
            body={animalImageBodyTemplate}
            style={{ minWidth: "3rem" }}
          ></Column>
          <Column
            field="species.commonName"
            header="Species"
            filterField="species.commonName"
            filter
            showFilterMenu={false}
            filterElement={speciesRowFilterTemplate}
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
            body={animalActionBodyTemplate}
            exportable={false}
            style={{ minWidth: "3rem" }}
          ></Column>
        </DataTable>
      </CardContent>
      {/* <CardFooter>
        <Button className="w-full"></Button>
      </CardFooter> */}
    </Card>
  );
}

export default FatAnimalsCard;
