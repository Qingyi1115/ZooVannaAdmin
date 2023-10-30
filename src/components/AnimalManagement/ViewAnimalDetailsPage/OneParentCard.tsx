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
import { Dialog as PrimeReactDialog } from "primereact/dialog";

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
import beautifyText from "../../../hooks/beautifyText";

interface OneParentCardProps {
  curAnimal: Animal;
  setCurAnimal: any;
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
    setCurAnimal,
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
  const [openUpdateParentDialog, setOpenUpdateParentDialog] =
    useState<boolean>(false);

  const [allAnimalsListToBecomeParent, setAllAnimalsListToBecomeParent] =
    useState<Animal[]>([]);
  const [selectedAnimalToBecomeParent, setSelectedAnimalToBecomeParent] =
    useState<Animal | null>(null);
  const [globalFilter, setGlobalFilter] = useState<string>(
    curAnimal.species.commonName
  );

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const responseJson = await apiJson.get(
          "http://localhost:3000/api/animal/getAllAnimals"
        );
        const animalListNoCurParent = (responseJson as Animal[]).filter(
          (animal) => animal.animalCode !== parent.animalCode
        );
        setAllAnimalsListToBecomeParent(animalListNoCurParent);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchAnimals();
  }, []);

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

  // change parent stuff
  const imageBodyTemplate = (rowData: Animal) => {
    return (
      (rowData.imageUrl ?
        <img
          src={"http://localhost:3000/" + rowData.imageUrl}
          alt={rowData.houseName}
          className="aspect-square w-16 rounded-full border border-white object-cover shadow-4"
        /> : "-")
    );
  };

  function handleUpdateParent() {
    if (!selectedAnimalToBecomeParent) {
      return;
    }
    let childAnimalCode = curAnimal.animalCode;
    let parentAnimalCode = parent.animalCode;
    let newParentAnimalCode = selectedAnimalToBecomeParent?.animalCode;

    const updateAnimalLineageObj = {
      childAnimalCode,
      parentAnimalCode,
      newParentAnimalCode,
    };

    const updateParentApi = async () => {
      try {
        const response = await apiJson.put(
          "http://localhost:3000/api/animal/updateAnimalLineage",
          updateAnimalLineageObj
        );
        // success

        toastShadcn({
          description: "Successfully updated parent!",
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
            "An error has occurred while updating parents: \n" + error.message,
        });
      }
    };
    updateParentApi();
  }

  const updateParentsHeader = (
    <React.Fragment>
      <div className="flex justify-center text-2xl">Change Parents</div>
    </React.Fragment>
  );

  const updateParentsBody = (
    <React.Fragment>
      <PrimeReactDialog
        visible={openUpdateParentDialog}
        onHide={() => setOpenUpdateParentDialog(false)}
        style={{ width: "64rem", height: "48rem" }}
        header={updateParentsHeader}
      >
        <div className="flex flex-col items-center">
          <div className="mb-2">
            Current Parent To Change:
            <span className="font-bold"> {parent.houseName}</span>
          </div>
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
            onClick={handleUpdateParent}
          >
            Add {selectedAnimalToBecomeParent?.houseName}
          </Button>
        </div>
      </PrimeReactDialog>
    </React.Fragment>
  );

  return (
    <div className="flex w-full flex-col items-center gap-2 rounded-md border border-strokedark/20 p-4 transition-all">
      <div className="text-sm font-bold">Parent {parentNum}</div>
      <div className="mb-2 flex w-full items-center justify-center gap-4">
        <img
          alt={"Parent 1 image"}
          src={`http://localhost:3000/${parent.imageUrl}`}
          className="aspect-square w-20 rounded-full border border-white object-cover shadow-4"
        />
        <div>
          <p className="text-lg font-bold">{parent.houseName}</p>
          <p className="text-sm">{parent.species.commonName}</p>
          <p
            className={`${parent.sex == "MALE"
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
          to={`/animal/viewanimaldetails/${parent.animalCode}`}
          onClick={() => {
            setCurAnimal(null);
            setRefreshSeed(refreshSeed + 1);
          }}
          className={"w-full"}
        >
          <Button className="w-full">
            <HiEye />
          </Button>
        </NavLink>
        <div className="w-full">
          <Button
            className="w-full"
            onClick={() => setOpenUpdateParentDialog(true)}
          >
            <HiPencil />
          </Button>
        </div>
        {updateParentsBody}
        {/* <Dialog
          open={openUpdateParentDialog}
          onOpenChange={setOpenUpdateParentDialog}
        >
          <DialogTrigger className="w-full">
            <Button className="w-full">
              <HiPencil />
            </Button>
          </DialogTrigger>
          <DialogContent className="h-3/5">
            <DialogHeader>Update Parents</DialogHeader>
            {updateParentsBody}
          </DialogContent>
        </Dialog> */}
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
