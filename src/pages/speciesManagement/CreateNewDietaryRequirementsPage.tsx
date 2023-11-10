import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CreateDietaryRequirementsForm from "../../components/SpeciesManagement/ViewSpeciesDetailsPage/CreateDietaryRequirementsForm";
import useApiJson from "../../hooks/useApiJson";
import Species from "../../models/Species";

function CreateNewDietaryRequirementsPage() {
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
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark">
        {curSpecies && (
          <CreateDietaryRequirementsForm curSpecies={curSpecies} />
        )}
      </div>
    </div>
  );
}

export default CreateNewDietaryRequirementsPage;
