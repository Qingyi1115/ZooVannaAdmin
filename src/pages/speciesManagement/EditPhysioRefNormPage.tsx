import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EditPhysioRefNormForm from "../../components/SpeciesManagement/ViewSpeciesDetailsPage/EditPhysioRefNormForm";
import useApiJson from "../../hooks/useApiJson";
import PhysiologicalReferenceNorms from "../../models/PhysiologicalReferenceNorms";
import Species from "../../models/Species";

function EditPhysioRefNormPage() {
  const apiJson = useApiJson();

  const { speciesCode, physiologicalRefId } = useParams<{
    speciesCode: string;
    physiologicalRefId: string;
  }>();
  const [curSpecies, setCurSpecies] = useState<Species | null>(null);
  const [curPhysioRefNorm, setCurPhysioRefNorm] =
    useState<PhysiologicalReferenceNorms | null>(null);

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
    const fetchSpecies = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/species/getPhysiologicalReferenceNormsById/${physiologicalRefId}`
        );
        setCurPhysioRefNorm(responseJson as PhysiologicalReferenceNorms);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchSpecies();
  }, []);

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark">
        {curSpecies && curPhysioRefNorm && (
          <EditPhysioRefNormForm
            curSpecies={curSpecies}
            curPhysioRefNorm={curPhysioRefNorm}
          />
        )}
      </div>
    </div>
  );
}

export default EditPhysioRefNormPage;
