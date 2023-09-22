import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useApiJson from "../../../hooks/useApiJson";
import Facility from "../../../models/Facility";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
import ViewFacilityDetails from "../../../components/AssetAndFacilityManagement/FacilityManagement/ViewFacilityDetails";

function ViewFacilityDetailsPage() {
    const apiJson = useApiJson();
    let facility: Facility = {
      facilityId: -1,
      facilityName: "",
      xCoordinate: 0,
      yCoordinate: 0,
      facilityDetail: "",
      facilityDetailJson: undefined
    };

    const { facilityId } = useParams<{ facilityId: string}>();
    const [curFacility, setCurFacility] = useState<Facility>(facility);
    const [refreshSeed, setRefreshSeed] = useState<number>(0);

    useEffect(() => {
        const fetchFacilities = async () => {
          try {
            const responseJson = await apiJson.get(
              `http://localhost:3000/api/facility/getFacility/${facilityId}`
            );
            console.log(responseJson);
            setCurFacility(responseJson.facility as Facility);
          } catch (error: any) {
            console.log(error);
          }
        };
    
        fetchFacilities();
    }, [refreshSeed]);


      return (
        <div className="p-10">
          <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default">
            {curFacility && curFacility.facilityId != -1 && (
              <div className="flex flex-col">
                <span className="self-center text-xl font-bold">
                  Facility Details
                </span>{" "}
                <br />
                <span className="self-center text-title-xl font-bold">
                  {curFacility.facilityName}
                </span>
                <hr className="opacity-2 my-2 bg-stroke" />
                {/*<img
                  src={"http://localhost:3000/" + curSpecies.imageUrl}
                  alt="Current species image"
                  className="my-4 aspect-square w-1/5 self-center rounded-full border shadow-4"
                />*/}
                <Accordion type="multiple">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Personal Information</AccordionTrigger>
                    <AccordionContent>
                        <ViewFacilityDetails curFacility={curFacility} refreshSeed={refreshSeed} setRefreshSeed={setRefreshSeed} />
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Access Role</AccordionTrigger>
                    <AccordionContent>
                        <ViewFacilityDetails curFacility={curFacility} refreshSeed={refreshSeed} setRefreshSeed={setRefreshSeed}/>
                    </AccordionContent>
                  </AccordionItem>
                  {/*<AccordionItem value="item-2">
                    <AccordionTrigger>Species Educational Content</AccordionTrigger>
                    <AccordionContent>
                      <SpeciesEduContentDetails curSpecies={curSpecies} />
                    </AccordionContent>
                    </AccordionItem>*/}
                </Accordion>
              </div>
            )}
          </div>
        </div>
      );
}

export default ViewFacilityDetailsPage;