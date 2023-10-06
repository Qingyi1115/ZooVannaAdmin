import React, { useEffect, useState } from "react";
import useApiJson from "../../../hooks/useApiJson";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";

import { NavLink } from "react-router-dom";
import {
  HiCheck,
  HiChevronRight,
  HiEye,
  HiPencil,
  HiPlus,
  HiTrash,
  HiX,
} from "react-icons/hi";
import Animal from "../../../models/Animal";
import Species from "../../../models/Species";
import {
  AcquisitionMethod,
  AnimalGrowthStage,
  AnimalSex,
} from "../../../enums/Enumurated";
import AnimalBasicInformation from "../../../components/AnimalManagement/ViewAnimalDetailsPage/AnimalBasicInformation";
import AnimalWeightInfo from "../../../components/AnimalManagement/ViewAnimalDetailsPage/AnimalWeightInfo";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import OneParentCard from "./OneParentCard";
interface AnimalParentsCardProps {
  curAnimal: Animal;
  refreshSeed: number;
  setRefreshSeed: any;
}
function AnimalParentsCard(props: AnimalParentsCardProps) {
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  const { curAnimal, refreshSeed, setRefreshSeed } = props;

  const [animalParent1Code, setAnimalParent1Code] = useState<string>("");
  const [animalParent2Code, setAnimalParent2Code] = useState<string>("");
  const [animalParent1, setAnimalParent1] = useState<Animal | null>(null);
  const [animalParent2, setAnimalParent2] = useState<Animal | null>(null);

  const [openDeleteParentDialog, setOpenDeleteParentDialog] =
    useState<boolean>(false);

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

  async function deleteParent(parentToDelete: Animal) {
    let childAnimalCode = curAnimal.animalCode;
    let parentAnimalCode = parentToDelete.animalCode;

    const deleteAnimalLineageObj = {
      childAnimalCode,
      parentAnimalCode,
    };

    const deleteParentApi = async () => {
      try {
        const response = await apiJson.put(
          "http://localhost:3000/api/animal/deleteAnimalLineage",
          deleteAnimalLineageObj
        );
        // success

        toastShadcn({
          description: "Successfully deleted parent!",
        });
        setOpenDeleteParentDialog(false);
        setAnimalParent1Code("");
        setAnimalParent2Code("");
        setAnimalParent1(null);
        setAnimalParent2(null);
        setRefreshSeed(refreshSeed + 1);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while deleting parents: \n" + error.message,
        });
      }
    };
    deleteParentApi();
  }

  // const deleteParentDialog = {}

  return (
    <div className="h-full">
      <Card className="h-full">
        <CardContent className="flex h-full flex-col justify-between gap-2 p-4">
          <div className="self-center font-bold text-slate-700">
            Known Parents
          </div>
          {!animalParent1 && (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-lg">
              <div>There is no known parent</div>
              <Button>
                <HiPlus />
              </Button>
            </div>
          )}
          <div className="flex w-full gap-4">
            <div className="h-full w-full">
              {animalParent1 && (
                <OneParentCard
                  curAnimal={curAnimal}
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
                      <Button>
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
