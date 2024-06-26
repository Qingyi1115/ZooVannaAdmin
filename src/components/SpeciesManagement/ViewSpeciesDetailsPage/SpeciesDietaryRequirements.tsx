import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import useApiJson from "../../../hooks/useApiJson";
import Species from "../../../models/Species";
import SpeciesDietNeed from "../../../models/SpeciesDietNeed";
import DietNeedDatatable from "./DietNeedDatatable";

interface SpeciesDietaryRequirementsProps {
  curSpecies: Species;
}

function SpeciesDietaryRequirements(props: SpeciesDietaryRequirementsProps) {
  const { curSpecies } = props;
  const apiJson = useApiJson();

  const [dietNeedsList, setDietNeedsList] = useState<SpeciesDietNeed[]>([]);
  const [resetSeed, setResetSeed] = useState<number>(0);

  useEffect(() => {
    const fetchDietNeedsList = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/species/getAllDietNeedbySpeciesCode/${curSpecies.speciesCode}`
        );
        setDietNeedsList(responseJson as SpeciesDietNeed[]);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchDietNeedsList();
  }, [resetSeed]);

  return (
    <div className="">
      <div className="my-4 flex justify-start gap-6">
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
