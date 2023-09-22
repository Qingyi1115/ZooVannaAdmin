import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CreateEnclosureRequirementsForm from "../../components/SpeciesManagement/ViewSpeciesDetailsPage/CreateEnclosureRequirementsForm";
import useApiJson from "../../hooks/useApiJson";
import Species from "../../models/Species";

function CreateNewEnclosureRequirementsPage() {
  const apiJson = useApiJson();

  const { speciesCode } = useParams<{ speciesCode: string }>();
  const [curSpecies, setCurSpecies] = useState<Species | null>(null);

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

  return (
    <div className="p-10">
      {curSpecies && (
        <CreateEnclosureRequirementsForm curSpecies={curSpecies} />
      )}
    </div>
  );
}

export default CreateNewEnclosureRequirementsPage;
