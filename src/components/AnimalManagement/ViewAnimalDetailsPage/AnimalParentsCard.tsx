import React, { useEffect, useState } from "react";
import useApiJson from "../../../hooks/useApiJson";

import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Dialog as PrimeReactDialog } from "primereact/dialog";

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";

import { Button } from "@/components/ui/button";
import {
  HiPlus
} from "react-icons/hi";
import { NavLink } from "react-router-dom";
import Animal from "../../../models/Animal";

import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import beautifyText from "../../../hooks/beautifyText";
import OneParentCard from "./OneParentCard";
interface AnimalParentsCardProps {
  curAnimal: Animal;
  setCurAnimal: any;
  refreshSeed: number;
  setRefreshSeed: any;
}
function AnimalParentsCard(props: AnimalParentsCardProps) {
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  const { curAnimal, setCurAnimal, refreshSeed, setRefreshSeed } = props;

  const [animalParent1Code, setAnimalParent1Code] = useState<string>("");
  const [animalParent2Code, setAnimalParent2Code] = useState<string>("");
  const [animalParent1, setAnimalParent1] = useState<Animal | null>(null);
  const [animalParent2, setAnimalParent2] = useState<Animal | null>(null);

  const [openAddParentDialog, setOpenAddParentDialog] =
    useState<boolean>(false);

  const [allAnimalsListToBecomeParent, setAllAnimalsListToBecomeParent] =
    useState<Animal[]>([]);
  const [selectedAnimalToBecomeParent, setSelectedAnimalToBecomeParent] =
    useState<Animal | null>(null);
  const [globalFilter, setGlobalFilter] = useState<string>(
    curAnimal.species.commonName
  );

  const [addParentError, setAddParentError] = useState<string | null>(null);

  // useEffect to fetch parents
  useEffect(() => {
    console.log("in get parents code");
    console.log(curAnimal);
    if (curAnimal.parents && curAnimal.parents.length == 2) {
      setAnimalParent1Code(curAnimal.parents[0].animalCode);
      setAnimalParent2Code(curAnimal.parents[1].animalCode);
    } else if (curAnimal.parents && curAnimal.parents.length == 1) {
      setAnimalParent1Code(curAnimal.parents[0].animalCode);
    }
  }, [curAnimal]);

  useEffect(() => {
    const fetchParent1 = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/animal/getAnimalByAnimalCode/${animalParent1Code}`
        );
        setAnimalParent1(responseJson as Animal);
      } catch (error: any) {
        console.log(error);
      }
    };
    const fetchParent2 = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/animal/getAnimalByAnimalCode/${animalParent2Code}`
        );
        setAnimalParent2(responseJson as Animal);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchParent1();
    fetchParent2();
  }, [animalParent1Code, animalParent2Code, curAnimal]);

  // fetch animals for create/add
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const responseJson = await apiJson.get(
          "http://localhost:3000/api/animal/getAllAnimals"
        );
        const animalListNoCurParent = (responseJson as Animal[]).filter(
          (animal) => animal.animalCode !== curAnimal.animalCode
        );
        setAllAnimalsListToBecomeParent(animalListNoCurParent);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchAnimals();
  }, []);

  // Add parent stuff
  const imageBodyTemplate = (rowData: Animal) => {
    return (
      (rowData.imageUrl ?
        <img
          src={"http://localhost:3000/" + rowData.imageUrl}
          alt={rowData.houseName}
          className="aspect-square w-16 rounded-full border border-white object-cover shadow-4"
        />
        : "-")
    );
  };

  function handleAddParent() {
    if (!selectedAnimalToBecomeParent) {
      return;
    }
    let childAnimalCode = curAnimal.animalCode;
    let parentAnimalCode = selectedAnimalToBecomeParent.animalCode;

    const createAnimalLineageObj = {
      childAnimalCode,
      parentAnimalCode,
    };

    const addParentApi = async () => {
      try {
        const response = await apiJson.post(
          "http://localhost:3000/api/animal/addAnimalLineage",
          createAnimalLineageObj
        );
        // success

        toastShadcn({
          description: "Successfully updated parent!",
        });
        setOpenAddParentDialog(false);
        setAnimalParent1Code("");
        setAnimalParent2Code("");
        setAnimalParent1(null);
        setAnimalParent2(null);
        setRefreshSeed(refreshSeed + 1);
        setGlobalFilter(curAnimal.species.commonName);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while adding parents: \n" + error.message,
        });
        // setAddParentError(error.message);
      }
    };
    addParentApi();
  }

  const addParentsHeader = (
    <React.Fragment>
      <div className="flex justify-center text-2xl">Add Parent</div>
    </React.Fragment>
  );

  const addParentsBody = (
    <React.Fragment>
      <PrimeReactDialog
        visible={openAddParentDialog}
        onHide={() => setOpenAddParentDialog(false)}
        style={{ width: "64rem", height: "48rem" }}
        header={addParentsHeader}
      >
        <div className="flex flex-col items-center">
          <InputText
            type="search"
            placeholder="Search..."
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              setGlobalFilter(target.value);
            }}
            className="mb-2 h-min w-60"
          />
        </div>
        <DataTable
          value={allAnimalsListToBecomeParent}
          scrollable
          scrollHeight="100%"
          selection={selectedAnimalToBecomeParent!}
          selectionMode="single"
          globalFilter={globalFilter}
          onSelectionChange={(e) => setSelectedAnimalToBecomeParent(e.value)}
          dataKey="animalCode"
          className="h-3/4 overflow-hidden rounded border border-graydark/30"
        >
          <Column
            field="imageUrl"
            body={imageBodyTemplate}
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
            field="sex"
            header="Sex"
            body={(animal: Animal) => beautifyText(animal.sex)}
            sortable
            style={{ minWidth: "7rem" }}
          ></Column>
          <Column
            field="species.commonName"
            header="Species"
            sortable
            style={{ minWidth: "7rem" }}
          ></Column>
        </DataTable>
        <div className="mt-6 flex justify-center">
          <Button
            disabled={selectedAnimalToBecomeParent == null}
            onClick={handleAddParent}
          >
            Add {selectedAnimalToBecomeParent?.houseName}
          </Button>
        </div>
        <div>
          {addParentError && (
            <div className="mt-2 flex justify-center font-bold text-danger">
              {addParentError}
            </div>
          )}
        </div>
      </PrimeReactDialog>
    </React.Fragment>
  );

  return (
    <div className="h-full">
      <Card className="h-full">
        <CardContent className="flex h-full flex-col justify-between gap-2 p-4">
          <div className="self-center font-bold text-slate-700">
            Known Parents
          </div>
          {addParentsBody}
          {!animalParent1 && (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-lg">
              <div>There is no known parent</div>
              <Button
                onClick={() => {
                  setOpenAddParentDialog(true);
                  setGlobalFilter(curAnimal.species.commonName);
                }}
              >
                <HiPlus />
              </Button>
            </div>
          )}
          <div className="flex w-full gap-4">
            <div className="h-full w-full">
              {animalParent1 && (
                <OneParentCard
                  curAnimal={curAnimal}
                  setCurAnimal={setCurAnimal}
                  parent={animalParent1}
                  parentNum={1}
                  refreshSeed={refreshSeed}
                  setRefreshSeed={setRefreshSeed}
                  setAnimalParent1={setAnimalParent1}
                  setAnimalParent1Code={setAnimalParent1Code}
                  setAnimalParent2={setAnimalParent2}
                  setAnimalParent2Code={setAnimalParent2Code}
                />
                // <div className="flex w-full flex-col items-center gap-2 rounded-md border border-strokedark/20 p-4 transition-all">
                //   <div className="text-sm font-bold">Parent 1</div>
                //   <div className="mb-2 flex w-full items-center justify-center gap-4">
                //     <img
                //       alt={"Parent 1 image"}
                //       src={"http://localhost:3000/img/species/panda.jpg"}
                //       className="aspect-square w-20 rounded-full border border-white object-cover shadow-4"
                //     />
                //     <div>
                //       <p className="text-lg font-bold">
                //         {animalParent1.houseName}
                //       </p>
                //       <p className="text-sm">
                //         {animalParent1.species.commonName}
                //       </p>
                //       <p
                //         className={`${
                //           animalParent1.sex == "MALE"
                //             ? "text-[#3b82f6]"
                //             : animalParent1.sex == "FEMALE"
                //             ? "text-[#ec4899]"
                //             : animalParent1.sex == "UNKNOWN"
                //             ? "text-slate-900"
                //             : animalParent1.sex == "ASEXUAL"
                //             ? "text-purple-600"
                //             : "text-black"
                //         }`}
                //       >
                //         {animalParent1.sex}
                //       </p>
                //     </div>
                //   </div>
                //   <Separator />
                //   <div className="flex w-full gap-2">
                //     <NavLink
                //       to={`/animal/viewanimaldetails/${animalParent1.animalCode}`}
                //       className={"w-full"}
                //     >
                //       <Button className="w-full">
                //         <HiEye />
                //       </Button>
                //     </NavLink>

                //     <Dialog
                //       open={openDeleteParentDialog}
                //       onOpenChange={setOpenDeleteParentDialog}
                //     >
                //       <DialogTrigger className="w-full">
                //         <Button className="w-full">
                //           <HiPencil />
                //         </Button>
                //       </DialogTrigger>
                //       <DialogContent className="">
                //         <DialogHeader>
                //           <DialogTitle>Confirm</DialogTitle>
                //         </DialogHeader>
                //         Are you sure you want to delete{" "}
                //         {animalParent1.houseName} as {curAnimal.houseName}'s
                //         parent?
                //         <DialogFooter>
                //           <Button
                //             onClick={() => setOpenDeleteParentDialog(false)}
                //           >
                //             <HiX className="mr-2" />
                //             No
                //           </Button>
                //           <Button
                //             variant={"destructive"}
                //             onClick={() => deleteParent(animalParent1)}
                //           >
                //             <HiCheck className="mr-2" />
                //             Yes
                //           </Button>
                //         </DialogFooter>
                //       </DialogContent>
                //     </Dialog>
                //     <Dialog
                //       open={openDeleteParentDialog}
                //       onOpenChange={setOpenDeleteParentDialog}
                //     >
                //       <DialogTrigger className="w-full">
                //         <Button variant={"destructive"} className="w-full">
                //           <HiTrash />
                //         </Button>
                //       </DialogTrigger>
                //       <DialogContent className="">
                //         <DialogHeader>
                //           <DialogTitle>Confirm</DialogTitle>
                //         </DialogHeader>
                //         Are you sure you want to delete{" "}
                //         {animalParent1.houseName} as {curAnimal.houseName}'s
                //         parent?
                //         <DialogFooter>
                //           <Button
                //             onClick={() => setOpenDeleteParentDialog(false)}
                //           >
                //             <HiX className="mr-2" />
                //             No
                //           </Button>
                //           <Button
                //             variant={"destructive"}
                //             onClick={() => deleteParent(animalParent1)}
                //           >
                //             <HiCheck className="mr-2" />
                //             Yes
                //           </Button>
                //         </DialogFooter>
                //       </DialogContent>
                //     </Dialog>
                //   </div>
                // </div>
              )}
            </div>
            <div className="h-full w-full">
              {animalParent1 && animalParent2 ? (
                <OneParentCard
                  curAnimal={curAnimal}
                  setCurAnimal={setCurAnimal}
                  parent={animalParent2}
                  parentNum={2}
                  refreshSeed={refreshSeed}
                  setRefreshSeed={setRefreshSeed}
                  setAnimalParent1={setAnimalParent1}
                  setAnimalParent1Code={setAnimalParent1Code}
                  setAnimalParent2={setAnimalParent2}
                  setAnimalParent2Code={setAnimalParent2Code}
                />
              ) : (
                <div className="h-full w-full">
                  {animalParent1 && (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-md border border-strokedark/20 p-4 transition-all">
                      <div>There is no known second parent</div>
                      <Button
                        onClick={() => {
                          setOpenAddParentDialog(true);
                          setGlobalFilter(curAnimal.species.commonName);
                        }}
                      >
                        <HiPlus />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <NavLink to={`/animal/viewfulllineage/${curAnimal.animalCode}`}>
            <Button className="w-full" type="button">
              View Full Lineage (Family Tree)
            </Button>
          </NavLink>
        </CardContent>
      </Card>
    </div>
  );
}

export default AnimalParentsCard;
