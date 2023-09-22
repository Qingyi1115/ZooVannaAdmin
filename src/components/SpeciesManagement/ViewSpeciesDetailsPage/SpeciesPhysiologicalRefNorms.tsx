import React, { useEffect, useState } from "react";
import useApiJson from "../../../hooks/useApiJson";
import Species from "../../../models/Species";
import {
  AnimalFeedCategory,
  AnimalGrowthStage,
  PresentationContainer,
  PresentationLocation,
  PresentationMethod,
} from "../../../enums/Enumurated";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PhysioRefNormDatatable from "./PhysioRefNormDatatable";
import PhysiologicalReferenceNorms from "../../../models/PhysiologicalReferenceNorms";

interface SpeciesPhysiologicalRefNormsProps {
  curSpecies: Species;
}

function SpeciesPhysiologicalRefNorms(
  props: SpeciesPhysiologicalRefNormsProps
) {
  const { curSpecies } = props;
  const apiJson = useApiJson();

  const [physiologicalRefNormsList, setPhysiologicalRefNormsList] = useState<
    PhysiologicalReferenceNorms[]
  >([]);
  const [resetSeed, setResetSeed] = useState<number>(0);

  useEffect(() => {
    const fetchPhysioRefNormsList = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/species/getAllPhysiologicalReferenceNormsByCode/${curSpecies.speciesCode}`
        );
        setPhysiologicalRefNormsList(
          responseJson as PhysiologicalReferenceNorms[]
        );
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchPhysioRefNormsList();
  }, [resetSeed]);

  return (
    <div className="">
      <div className="my-4 flex justify-start gap-6">
        <NavLink to={`/species/createphysioref/${curSpecies.speciesCode}`}>
          <Button>Create New Physiological Reference Norms</Button>
        </NavLink>
      </div>

      {curSpecies && (
        <PhysioRefNormDatatable
          curSpecies={curSpecies}
          physiologicalRefNormsList={physiologicalRefNormsList}
          setPhysiologicalRefNormsList={setPhysiologicalRefNormsList}
        />
      )}
    </div>
  );
}

export default SpeciesPhysiologicalRefNorms;
