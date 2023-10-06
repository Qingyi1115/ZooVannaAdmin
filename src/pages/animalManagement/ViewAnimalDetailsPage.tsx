import React, { useState, useEffect } from "react";
import useApiJson from "../../hooks/useApiJson";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Animal from "../../models/Animal";
import Species from "../../models/Species";
import {
  AcquisitionMethod,
  AnimalGrowthStage,
  AnimalSex,
} from "../../enums/Enumurated";
import AnimalBasicInformation from "../../components/AnimalManagement/ViewAnimalDetailsPage/AnimalBasicInformation";
import AnimalWeightInfo from "../../components/AnimalManagement/ViewAnimalDetailsPage/AnimalWeightInfo";
import AllAnimalObservationLogsDatatable from "../../components/AnimalManagement/ViewAnimalDetailsPage/AllAnimalObservationLogsDatatable";

function ViewAnimalDetailsPage() {
  const apiJson = useApiJson();
  const location = useLocation();

  const { animalCode } = useParams<{ animalCode: string }>();
  const { tab } = useParams<{ tab: string }>();

  const [curAnimal, setCurAnimal] = useState<Animal | null>(null);
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  // useEffect to fetch animal
  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/animal/getAnimalByAnimalCode/${animalCode}`
        );
        console.log("test");
        setCurAnimal(responseJson as Animal);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchAnimal();
  }, [refreshSeed, location.pathname]);

  return (
    <div className="p-10">
      {curAnimal && (
        <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
          {/* header */}
          <div className="flex flex-col">
            <div className="mb-4 flex justify-between">
              <NavLink className="flex" to={`/animal/viewallanimals/`}>
                <Button variant={"outline"} type="button" className="">
                  Back
                </Button>
              </NavLink>
              <span className="self-center text-lg text-graydark">
                Animal Details
              </span>
              <Button disabled className="invisible">
                Back
              </Button>
            </div>
            <Separator />
            <span className="mt-4 self-center text-title-xl font-bold">
              {curAnimal.houseName}{" "}
              {curAnimal.isGroup ? (
                ""
              ) : (
                <span>the {curAnimal.species.commonName}</span>
              )}
              <div className="text-center text-lg">
                {curAnimal.isGroup ? (
                  <span>(Group)</span>
                ) : (
                  <span>(Individual)</span>
                )}
              </div>
            </span>
            <img
              src={"http://localhost:3000/" + curAnimal.imageUrl}
              alt="Current animal image"
              className="my-4 aspect-square w-1/5 self-center rounded-full border object-cover shadow-4"
            />
          </div>
          {/*  */}
          <Tabs defaultValue={tab ? `${tab}` : "basicinfo"} className="w-full">
            <TabsList className="no-scrollbar mb-4 w-full justify-around overflow-x-auto px-4 text-xs xl:text-base">
              <span className="invisible">_____</span>
              <TabsTrigger value="basicinfo">Basic Information</TabsTrigger>
              <TabsTrigger value="weight">Weight</TabsTrigger>
              <TabsTrigger value="feeding">Feeding</TabsTrigger>
              <TabsTrigger value="trainingenrichment">
                Training and Enrichment
              </TabsTrigger>
              <TabsTrigger value="behaviour">
                Behaviour Observations
              </TabsTrigger>
              <TabsTrigger value="medical">Medical</TabsTrigger>
            </TabsList>
            <TabsContent value="basicinfo">
              <AnimalBasicInformation
                curAnimal={curAnimal}
                setCurAnimal={setCurAnimal}
                refreshSeed={refreshSeed}
                setRefreshSeed={setRefreshSeed}
              />
            </TabsContent>
            <TabsContent value="weight">
              <div>
                <AnimalWeightInfo curAnimal={curAnimal} />
              </div>
            </TabsContent>
            <TabsContent value="feeding">
              <div>
                <span>Feeding Plan</span>
              </div>
            </TabsContent>
            <TabsContent value="trainingenrichment">
              <div>
                <span>Training and Enrichment Plan</span>
              </div>
            </TabsContent>
            <TabsContent value="behaviour">
              <div>
                <AllAnimalObservationLogsDatatable
                  animalId={curAnimal.animalId}
                />
              </div>
            </TabsContent>
            <TabsContent value="medical">
              Medical Logs and whatever else here
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}

export default ViewAnimalDetailsPage;
