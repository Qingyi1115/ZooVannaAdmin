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

interface SpeciesDietaryRequirementsProps {
  curSpecies: Species;
}

function SpeciesDietaryRequirements(props: SpeciesDietaryRequirementsProps) {
  const { curSpecies } = props;
  const apiJson = useApiJson();

  const [dietNeedsList, setDietNeedsList] = useState<SpeciesDietNeed[]>([]);

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
  }, []);

  return (
    <div>
      <DietNeedDatatable
        dietNeedsList={dietNeedsList}
        setDietNeedsList={setDietNeedsList}
      />
    </div>
  );
}

export default SpeciesDietaryRequirements;
