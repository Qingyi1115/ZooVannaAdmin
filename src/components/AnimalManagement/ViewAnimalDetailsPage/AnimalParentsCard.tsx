import React, { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NavLink } from "react-router-dom";
import { HiChevronRight } from "react-icons/hi";
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
  const { curAnimal } = props;

  const [animalParent1, setAnimalParent1] = useState<Animal | null>(null);
  const [animalParent2, setAnimalParent2] = useState<Animal | null>(null);

  // useEffect to fetch parents
  // no need, already inside, just assign
  useEffect(() => {
    if (curAnimal.parents && curAnimal.parents.length == 2) {
      setAnimalParent1(curAnimal.parents[0]);
      setAnimalParent2(curAnimal.parents[1]);
    } else if (curAnimal.parents && curAnimal.parents.length == 1) {
      setAnimalParent1(curAnimal.parents[0]);
    }
  });

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
                <div className="flex flex-col items-center gap-2 rounded-md border border-stroke p-4 transition-all hover:bg-muted/50">
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
