import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useApiJson from "../../hooks/useApiJson";
import Species from "../../models/Species";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import EditDietaryRequirementsForm from "../../components/SpeciesManagement/ViewSpeciesDetailsPage/EditDietaryRequirementsForm";
import SpeciesDietNeed from "../../models/SpeciesDietNeed";

function EditDietaryRequirementsPage() {
  const apiJson = useApiJson();

  const { speciesDietNeedId } = useParams<{ speciesDietNeedId: string }>();
  const { speciesCode } = useParams<{ speciesCode: string }>();
  const [curSpecies, setCurSpecies] = useState<Species | null>(null);
  const [curSpeciesDietNeed, setCurSpeciesDietNeed] =
    useState<SpeciesDietNeed | null>(null);

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

  useEffect(() => {
    const fetchSpeciesDietNeed = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/species/getDietNeedById/${speciesDietNeedId}`
        );
        setCurSpeciesDietNeed(responseJson as SpeciesDietNeed);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchSpeciesDietNeed();
  }, []);

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark">
        {curSpecies && curSpeciesDietNeed && (
          <EditDietaryRequirementsForm
            curSpecies={curSpecies}
            curSpeciesDietNeed={curSpeciesDietNeed}
          />
        )}
      </div>
    </div>
  );
}

export default EditDietaryRequirementsPage;
