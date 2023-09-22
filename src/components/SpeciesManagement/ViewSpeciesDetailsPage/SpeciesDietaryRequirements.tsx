import React, { useEffect, useState } from "react";
import useApiJson from "../../../hooks/useApiJson";
import Species from "../../../models/Species";
import SpeciesDietNeed from "../../../models/SpeciesDietNeed";
import {
  AnimalFeedCategory,
  AnimalGrowthStage,
  PresentationContainer,
  PresentationLocation,
  PresentationMethod,
} from "../../../enums/Enumurated";
import DietNeedDatatable from "./DietNeedDatatable";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface SpeciesDietaryRequirementsProps {
  curSpecies: Species;
}

function SpeciesDietaryRequirements(props: SpeciesDietaryRequirementsProps) {
  const { curSpecies } = props;
  const apiJson = useApiJson();

  const [dietNeedsList, setDietNeedsList] = useState<SpeciesDietNeed[]>([]);
  const [resetSeed, setResetSeed] = useState<number>(0);

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/species/getAllDietNeedbySpeciesCode/${curSpecies.speciesCode}`
        );
        setDietNeedsList(responseJson as SpeciesDietNeed[]);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchSpecies();
  }, [resetSeed]);

  return (
    <div>
      <div className="my-4 flex justify-center gap-6">
        <NavLink
          to={`/species/createdietaryrequirements/${curSpecies.speciesCode}`}
        >
          <Button>Create New Dietary Requirements</Button>
        </NavLink>
      </div>

      {curSpecies && (
        <DietNeedDatatable
          curSpecies={curSpecies}
          dietNeedsList={dietNeedsList}
          setDietNeedsList={setDietNeedsList}
        />
      )}
    </div>
  );
}

export default SpeciesDietaryRequirements;
