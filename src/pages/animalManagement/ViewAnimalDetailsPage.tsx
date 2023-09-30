import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NavLink } from "react-router-dom";
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

let testPandaSpecies: Species = {
  speciesId: 1,
  speciesCode: "SPE001",
  commonName: "Giant Panda",
  scientificName: "Ailuropoda Melanoleuca",
  aliasName: "",
  conservationStatus: "",
  domain: "",
  kingdom: "",
  phylum: "",
  speciesClass: "",
  order: "",
  family: "",
  genus: "",
  nativeContinent: "",
  nativeBiomes: "",
  educationalDescription: "",
  educationalFunFact: "",
  groupSexualDynamic: "",
  habitatOrExhibit: "habitat",
  imageUrl: "img/species/panda.jpg",
  generalDietPreference: "",
  lifeExpectancyYears: 0,
};

let testPandaAnimal: Animal = {
  animalId: 1,
  animalCode: "ANI001",
  imageUrl: "",
  houseName: "Kai Kai",
  sex: AnimalSex.MALE,
  dateOfBirth: new Date(),
  placeOfBirth: "Place of Birth haha",
  rfidTagNum: "RFID00001",
  acquisitionMethod: AcquisitionMethod.INHOUSE_CAPTIVE_BRED,
  dateOfAcquisition: new Date(),
  acquisitionRemarks: "Acquisition Remarks blabla",
  weight: -1,
  physicalDefiningCharacteristics: "Big head",
  behavioralDefiningCharacteristics: "Lazy",
  dateOfDeath: null,
  locationOfDeath: null,
  causeOfDeath: null,
  growthStage: AnimalGrowthStage.JUVENILE,
  animalStatus: "NORMAL",
  species: testPandaSpecies,
};

function ViewAnimalDetailsPage() {
  const { animalCode } = useParams<{ animalCode: string }>();
  const { tab } = useParams<{ tab: string }>();

  const [curAnimal, setCurAnimal] = useState<Animal>(testPandaAnimal);

  return (
    <div className="p-10">
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
            {curAnimal.houseName} the {curAnimal.species.commonName}
          </span>
        </div>
        {/*  */}
        <Tabs defaultValue={tab ? `${tab}` : "basicinfo"} className="w-full">
          <TabsList className="no-scrollbar w-full justify-around overflow-x-auto px-4 text-xs xl:text-base">
            <span className="invisible">_____</span>
            <TabsTrigger value="basicinfo">Basic Information</TabsTrigger>
            <TabsTrigger value="feeding">Feeding</TabsTrigger>
            <TabsTrigger value="trainingenrichment">
              Training and Enrichment
            </TabsTrigger>
            <TabsTrigger value="behaviour">Behaviour Observations</TabsTrigger>
            <TabsTrigger value="medical">Medical</TabsTrigger>
          </TabsList>
          <TabsContent value="basicinfo">
            <div>
              <span>Current Status and the edit status button here?</span>
            </div>
            <div>
              <span>Basic table to show the basic details</span>
            </div>
            <div>
              <span>
                Show Species and Location (which Enclosure) it is inside as well
              </span>
            </div>
            <div>
              <span>Genealogy/Lineage</span>
            </div>
            <div>
              <span>
                Weight stuff??? Show historical weight-ins records on the graph
              </span>
            </div>
            <AnimalBasicInformation curAnimal={curAnimal} />
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
              <span>Behaviour Observation???</span>
            </div>
          </TabsContent>
          <TabsContent value="medical">
            Medical Logs and whatever else here
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ViewAnimalDetailsPage;
