import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApiJson from "../../hooks/useApiJson";
import Species from "../../models/Species";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Separator } from "@/components/ui/separator";
import { NavLink } from "react-router-dom";
import SpeciesBasicInfoDetails from "../../components/SpeciesManagement/ViewSpeciesDetailsPage/SpeciesBasicInfoDetails";
import SpeciesDietaryRequirements from "../../components/SpeciesManagement/ViewSpeciesDetailsPage/SpeciesDietaryRequirements";
import SpeciesEduContentDetails from "../../components/SpeciesManagement/ViewSpeciesDetailsPage/SpeciesEduContentDetails";
import SpeciesEnclosureCompatibilities from "../../components/SpeciesManagement/ViewSpeciesDetailsPage/SpeciesEnclosureCompatibilities";
import SpeciesEnclosureRequirements from "../../components/SpeciesManagement/ViewSpeciesDetailsPage/SpeciesEnclosureRequirements";
import SpeciesPhysiologicalRefNorms from "../../components/SpeciesManagement/ViewSpeciesDetailsPage/SpeciesPhysiologicalRefNorms";

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
    ageToJuvenile: 0,
    ageToAdolescent: 1,
    ageToAdult: 2,
    ageToElder: 3,
    lifeExpectancyYears: 0,
  };

  const { speciesCode } = useParams<{ speciesCode: string }>();
  const { tab } = useParams<{ tab: string }>();
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
          <div className="relative flex flex-col">
            <div className="mb-4 flex justify-between">
              <NavLink className="flex" to={`/species/viewallspecies`}>
                <Button variant={"outline"} type="button" className="">
                  Back
                </Button>
              </NavLink>
              <span className="self-center text-lg text-graydark">
                Species Details
              </span>
              <Button disabled className="invisible">
                Back
              </Button>
            </div>
            <Separator />
            <span className="mt-4 self-center text-title-xl font-bold">
              {curSpecies.commonName}
            </span>
            <img
              src={"http://localhost:3000/" + curSpecies.imageUrl}
              alt="Current species image"
              className="my-4 aspect-square w-1/5 self-center rounded-full border object-cover shadow-4"
            />
            <Tabs
              defaultValue={tab ? `${tab}` : "basicinfo"}
              className="w-full"
            >
              <TabsList className="no-scrollbar w-full justify-around overflow-x-auto px-4 text-xs xl:text-base">
                <span className="invisible">_____</span>
                <TabsTrigger value="basicinfo">Basic Information</TabsTrigger>
                <TabsTrigger value="educontent">
                  Educational Content
                </TabsTrigger>
                <TabsTrigger value="dietneed">Dietary Requirements</TabsTrigger>
                <TabsTrigger value="enclosureneed">
                  Enclosure Requirements
                </TabsTrigger>
                <TabsTrigger value="enclosurecompatibilities">
                  Enclosure Compatibilities
                </TabsTrigger>
                <TabsTrigger value="physioref">Physiological Ref</TabsTrigger>
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
              <TabsContent value="enclosurecompatibilities">
                <SpeciesEnclosureCompatibilities curSpecies={curSpecies} />
              </TabsContent>
              <TabsContent value="physioref">
                <SpeciesPhysiologicalRefNorms curSpecies={curSpecies} />
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
