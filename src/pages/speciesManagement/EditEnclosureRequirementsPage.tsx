import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useApiJson from "../../hooks/useApiJson";
import Species from "../../models/Species";
import EditEnclosureRequirementsForm from "../../components/SpeciesManagement/ViewSpeciesDetailsPage/EditEnclosureRequirementsForm";

function EditEnclosureRequirementsPage() {
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
      {curSpecies && <EditEnclosureRequirementsForm curSpecies={curSpecies} />}
    </div>
  );
}

export default EditEnclosureRequirementsPage;
