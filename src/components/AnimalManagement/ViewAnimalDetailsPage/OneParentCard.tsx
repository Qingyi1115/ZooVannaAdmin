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

interface OneParentCardProps {
  curAnimal: Animal;
  parent: Animal;
  parentNum: number;
  refreshSeed: number;
  setRefreshSeed: any;
  setAnimalParent1Code: any;
  setAnimalParent2Code: any;
  setAnimalParent1: any;
  setAnimalParent2: any;
}

function OneParentCard(props: OneParentCardProps) {
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;
  const {
    curAnimal,
    parent,
    parentNum,
    refreshSeed,
    setRefreshSeed,
    setAnimalParent1,
    setAnimalParent1Code,
    setAnimalParent2,
    setAnimalParent2Code,
  } = props;

  const [openDeleteParentDialog, setOpenDeleteParentDialog] =
    useState<boolean>(false);

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

  return (
    <div className="flex w-full flex-col items-center gap-2 rounded-md border border-strokedark/20 p-4 transition-all">
      <div className="text-sm font-bold">Parent {parentNum}</div>
      <div className="mb-2 flex w-full items-center justify-center gap-4">
        <img
          alt={"Parent 1 image"}
          src={"http://localhost:3000/img/species/panda.jpg"}
          className="aspect-square w-20 rounded-full border border-white object-cover shadow-4"
        />
        <div>
          <p className="text-lg font-bold">{parent.houseName}</p>
          <p className="text-sm">{parent.species.commonName}</p>
          <p
            className={`${
              parent.sex == "MALE"
                ? "text-[#3b82f6]"
                : parent.sex == "FEMALE"
                ? "text-[#ec4899]"
                : parent.sex == "UNKNOWN"
                ? "text-slate-900"
                : parent.sex == "ASEXUAL"
                ? "text-purple-600"
                : "text-black"
            }`}
          >
            {parent.sex}
          </p>
        </div>
      </div>
      <Separator />
      <div className="flex w-full gap-2">
        <NavLink
          to={`/animal/viewanimaldetails/${curAnimal.animalCode}`}
          className={"w-full"}
        >
          <Button className="w-full">
            <HiEye />
          </Button>
        </NavLink>

        <Dialog
          open={openDeleteParentDialog}
          onOpenChange={setOpenDeleteParentDialog}
        >
          <DialogTrigger className="w-full">
            <Button className="w-full">
              <HiPencil />
            </Button>
          </DialogTrigger>
          <DialogContent className="">
            <DialogHeader>
              <DialogTitle>Confirm</DialogTitle>
            </DialogHeader>
            Are you sure you want to remove {parent.houseName} as{" "}
            {curAnimal.houseName}'s parent?
            <DialogFooter>
              <Button onClick={() => setOpenDeleteParentDialog(false)}>
                <HiX className="mr-2" />
                No
              </Button>
              <Button
                variant={"destructive"}
                onClick={() => deleteParent(parent)}
              >
                <HiCheck className="mr-2" />
                Yes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog
          open={openDeleteParentDialog}
          onOpenChange={setOpenDeleteParentDialog}
        >
          <DialogTrigger className="w-full">
            <Button variant={"destructive"} className="w-full">
              <HiTrash />
            </Button>
          </DialogTrigger>
          <DialogContent className="">
            <DialogHeader>
              <DialogTitle>Confirm</DialogTitle>
            </DialogHeader>
            Are you sure you want to remove {parent.houseName} as{" "}
            {curAnimal.houseName}'s parent?
            <DialogFooter>
              <Button onClick={() => setOpenDeleteParentDialog(false)}>
                <HiX className="mr-2" />
                No
              </Button>
              <Button
                variant={"destructive"}
                onClick={() => deleteParent(parent)}
              >
                <HiCheck className="mr-2" />
                Yes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default OneParentCard;
