import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useApiJson from "../../hooks/useApiJson";
import Species from "../../models/Species";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import SpeciesBasicInfoDetails from "../../components/SpeciesManagement/ViewSpeciesDetailsPage/SpeciesBasicInfoDetails";
import SpeciesEduContentDetails from "../../components/SpeciesManagement/ViewSpeciesDetailsPage/SpeciesEduContentDetails";
import SpeciesEnclosureRequirements from "../../components/SpeciesManagement/ViewSpeciesDetailsPage/SpeciesEnclosureRequirements";
import SpeciesDietaryRequirements from "../../components/SpeciesManagement/ViewSpeciesDetailsPage/SpeciesDietaryRequirements";
import { NavLink } from "react-router-dom";

function ViewSpeciesDetailsPage() {
  const apiJson = useApiJson();

  let emptySpecies: Species = {
    speciesId: -1,
    speciesCode: "",
    commonName: "",
    scientificName: "",
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
    imageUrl: "",
    generalDietPreference: "",
    lifeExpectancyYears: 0,
  };

  const { speciesCode } = useParams<{ speciesCode: string }>();
  const [curSpecies, setCurSpecies] = useState<Species>(emptySpecies);
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/species/getspecies/${speciesCode}`
        );
        setCurSpecies(responseJson as Species);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchSpecies();
  }, [refreshSeed]);

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
        {curSpecies && curSpecies.speciesId != -1 && (
          <div className="flex flex-col">
            <NavLink
              className="mb-8 w-1/3 self-center"
              to={`/species/viewallspecies`}
            >
              <Button
                type="button"
                className="h-12 w-full self-center rounded-full px-4 text-lg"
              >
                Back to All Species
              </Button>
            </NavLink>
            <span className="self-center text-xl font-bold">
              Species Details
            </span>{" "}
            <br />
            <span className="self-center text-title-xl font-bold">
              {curSpecies.commonName}
            </span>
            <hr className="opacity-2 my-2 bg-stroke" />
            <img
              src={"http://localhost:3000/" + curSpecies.imageUrl}
              alt="Current species image"
              className="my-4 aspect-square w-1/5 self-center rounded-full border object-cover shadow-4"
            />
            <Tabs defaultValue="basicinfo" className="w-full">
              <TabsList className="no-scrollbar w-full justify-around overflow-x-auto text-xs xl:text-base">
                <TabsTrigger value="basicinfo">Basic Information</TabsTrigger>
                <TabsTrigger value="educontent">
                  Educational Content
                </TabsTrigger>
                <TabsTrigger value="dietneed">Dietary Requirements</TabsTrigger>
                <TabsTrigger value="enclosureneed">
                  Enclosure Requirements
                </TabsTrigger>
                <TabsTrigger value="physioref">
                  Physiological Reference
                </TabsTrigger>
              </TabsList>
              <TabsContent value="basicinfo">
                <SpeciesBasicInfoDetails curSpecies={curSpecies} />
              </TabsContent>
              <TabsContent value="educontent">
                <SpeciesEduContentDetails curSpecies={curSpecies} />
              </TabsContent>
              <TabsContent value="dietneed">
                <SpeciesDietaryRequirements curSpecies={curSpecies} />
              </TabsContent>
              <TabsContent value="enclosureneed">
                <SpeciesEnclosureRequirements curSpecies={curSpecies} />
              </TabsContent>
              <TabsContent value="physioref">
                Change your password here.
              </TabsContent>
            </Tabs>
            {/* <Accordion type="multiple">
              <AccordionItem value="item-1">
                <AccordionTrigger>Species Basic Information</AccordionTrigger>
                <AccordionContent>
                  <SpeciesBasicInfoDetails curSpecies={curSpecies} />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Species Educational Content</AccordionTrigger>
                <AccordionContent>
                  <SpeciesEduContentDetails curSpecies={curSpecies} />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  Species Dietary Requirements
                </AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  Species Enclosure Requirements
                </AccordionTrigger>
                <AccordionContent>
                  <SpeciesEnclosureRequirements curSpecies={curSpecies} />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>
                  Species Physiological Reference Norms
                </AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
            </Accordion> */}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewSpeciesDetailsPage;