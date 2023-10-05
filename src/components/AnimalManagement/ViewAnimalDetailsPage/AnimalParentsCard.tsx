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
import { HiCheck, HiChevronRight, HiX } from "react-icons/hi";
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
interface AnimalParentsCardProps {
  curAnimal: Animal;
}
function AnimalParentsCard(props: AnimalParentsCardProps) {
  const apiJson = useApiJson();

  const { curAnimal } = props;

  const [animalParent1Code, setAnimalParent1Code] = useState<string>("");
  const [animalParent2Code, setAnimalParent2Code] = useState<string>("");
  const [animalParent1, setAnimalParent1] = useState<Animal | null>(null);
  const [animalParent2, setAnimalParent2] = useState<Animal | null>(null);

  const [openDeleteParentDialog, setOpenDeleteParentDialog] =
    useState<boolean>(false);

  // useEffect to fetch parents
  useEffect(() => {
    if (curAnimal.parents && curAnimal.parents.length == 2) {
      setAnimalParent1Code(curAnimal.parents[0].animalCode);
      setAnimalParent2Code(curAnimal.parents[1].animalCode);
    } else if (curAnimal.parents && curAnimal.parents.length == 1) {
      setAnimalParent1Code(curAnimal.parents[0].animalCode);
    }
  });

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
  }, [animalParent1Code, animalParent2Code]);

  async function deleteParent() {}

  return (
    <div>
      <Card className=" w-max">
        <CardContent className="flex flex-col gap-4 p-4">
          <div className="flex gap-10">
            {/* Parent 1 */}
            {animalParent1 ? (
              <NavLink
                to={`/animal/viewanimaldetails/${animalParent1.animalCode}`}
              >
                <div className="flex flex-col items-center gap-2 rounded-md border border-strokedark/20 p-4 transition-all hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <img
                      alt={"Parent 1 image"}
                      src={"http://localhost:3000/"}
                      className="aspect-square w-20 rounded-full border border-white object-cover shadow-4"
                    />
                    <div>
                      <p>Parent 1:</p>
                      <p className="">
                        Name:{" "}
                        <span className="text-lg font-bold">
                          {animalParent1.houseName}
                        </span>
                      </p>
                      <p className="">
                        <span className="text-sm">Species:</span>{" "}
                        {animalParent1.species.commonName}
                      </p>
                      <p
                        className={`${
                          animalParent1.sex == "MALE"
                            ? "text-[#3b82f6]"
                            : animalParent1.sex == "FEMALE"
                            ? "text-[#ec4899]"
                            : "text-black"
                        }`}
                      >
                        <span className="text-sm text-black">Sex:</span>{" "}
                        {animalParent1.sex}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex w-full gap-2">
                    <Dialog
                      open={openDeleteParentDialog}
                      onOpenChange={setOpenDeleteParentDialog}
                    >
                      <DialogTrigger>
                        <Button variant={"destructive"} className="w-full">
                          Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="h-3/5">
                        <DialogHeader>
                          <DialogTitle>Confirm</DialogTitle>
                        </DialogHeader>
                        Are you sure you want to delete{" "}
                        {animalParent1.houseName} as {curAnimal.houseName}'s
                        parent?
                        <DialogFooter>
                          <Button
                            onClick={() => setOpenDeleteParentDialog(false)}
                          >
                            <HiX className="mr-2" />
                            No
                          </Button>
                          <Button
                            variant={"destructive"}
                            // onClick={deleteParent}
                          >
                            <HiCheck className="mr-2" />
                            Yes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button className="w-full">Change</Button>
                  </div>
                  <div className="flex items-center">
                    Click to view details <HiChevronRight className="h-6 w-6" />
                  </div>
                </div>
              </NavLink>
            ) : (
              <div>There is no known parent</div>
            )}
            {animalParent1 && animalParent2 ? (
              <NavLink
                to={`/animal/viewanimaldetails/${animalParent2.animalCode}`}
              >
                <div className="flex flex-col items-center gap-2 rounded-md border border-stroke p-4 transition-all hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <img
                      alt={"Parent 1 image"}
                      src={"http://localhost:3000/"}
                      className="aspect-square w-20 rounded-full border border-white object-cover shadow-4"
                    />
                    <div>
                      <p>Parent 2:</p>
                      <p className="">
                        Name:{" "}
                        <span className="text-lg font-bold">
                          {animalParent2.houseName}
                        </span>
                      </p>
                      <p className="">
                        <span className="text-sm">Species:</span>{" "}
                        {animalParent2.species.commonName}
                      </p>
                      <p
                        className={`${
                          animalParent2.sex == "MALE"
                            ? "text-[#3b82f6]"
                            : animalParent2.sex == "FEMALE"
                            ? "text-[#ec4899]"
                            : "text-black"
                        }`}
                      >
                        <span className="text-sm text-black">Sex:</span>{" "}
                        {animalParent2.sex}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center">
                    Click to view details <HiChevronRight className="h-6 w-6" />
                  </div>
                </div>
              </NavLink>
            ) : (
              <div>
                {animalParent1 && <div>There is no known second parent</div>}
              </div>
            )}
          </div>
          <NavLink to={`/animal/viewfulllineage/${curAnimal.animalCode}`}>
            <Button className="w-full">View Full Lineage (Family Tree)</Button>
          </NavLink>
        </CardContent>
      </Card>
    </div>
  );
}

export default AnimalParentsCard;
