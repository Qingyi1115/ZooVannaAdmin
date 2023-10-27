import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";

import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import useApiJson from "../../hooks/useApiJson";
import { Separator } from "@/components/ui/separator";
import Species from "../../models/Species";

import { DataTable, DataTableExpandedRows } from "primereact/datatable";
import { Column } from "primereact/column";
import FeedingPlan from "../../models/FeedingPlan";
import AllAnimalFeedingPlansDatatable from "../../components/AnimalManagement/AnimalFeedingPlanHomePage.tsx/AllAnimalFeedingPlansDatatable";

function AnimalFeedingPlanHomePage() {
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  const { speciesCode } = useParams<{ speciesCode: string }>();
  const [curSpecies, setCurSpecies] = useState<Species>();

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
  }, []);

  // feeding plans datatable
  const [feedingPlansList, setFeedingPlansList] = useState<FeedingPlan[]>([]);
  useEffect(() => {
    const fetchFeedingPlanCurSpecies = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/animal/getFeedingPlansBySpeciesCode/${speciesCode}`
        );
        setFeedingPlansList(responseJson as FeedingPlan[]);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchFeedingPlanCurSpecies();
  }, []);

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
        {/* Header */}
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">
            {/* <NavLink className="flex" to={(-1)}> */}
            <Button
              onClick={() => navigate("/animal/viewallanimals/")}
              variant={"outline"}
              type="button"
              className=""
            >
              Back
            </Button>
            {/* </NavLink> */}
            <span className="self-center text-lg text-graydark">
              Feeding Plan
            </span>
            <Button disabled className="invisible">
              Back
            </Button>
          </div>
          <Separator />
          <span className="mt-4 self-center text-title-xl font-bold">
            {curSpecies?.commonName}
          </span>
        </div>

        {/*  */}
        {/* <Button
          onClick={() => navigate(`/animal/createfeedingplan/${speciesCode}`)}
          className=""
        >
          Create New Feeding Plan
        </Button> */}
        <div>
          {speciesCode && (
            <AllAnimalFeedingPlansDatatable
              feedingPlansList={feedingPlansList}
              setFeedingPlansList={setFeedingPlansList}
              speciesCode={speciesCode}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AnimalFeedingPlanHomePage;
