import { useEffect, useState } from "react";
import { useParams } from "react-router";
import EditAnimalActivityForm from "../../components/AnimalManagement/EditAnimalActivityPage/EditAnimalActivityForm";
import useApiJson from "../../hooks/useApiJson";
import AnimalActivity from "../../models/AnimalActivity";

function EditAnimalActivityPage() {
  const apiJson = useApiJson();

  const { animalActivityId } = useParams<{ animalActivityId: string }>();
  const [curAnimalActivity, setCurAnimalActivity] =
    useState<AnimalActivity | null>(null);
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  useEffect(() => {
    const fetchAnimalActivity = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/animal/getAnimalActivityById/${animalActivityId}`
        );
        setCurAnimalActivity(responseJson.animalActivity as AnimalActivity);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchAnimalActivity();
  }, [refreshSeed]);

  return (
    <div className="p-10">
      {curAnimalActivity && curAnimalActivity.animalActivityId != -1 && (
        <EditAnimalActivityForm
          curAnimalActivity={curAnimalActivity}
          refreshSeed={refreshSeed}
          setRefreshSeed={setRefreshSeed}
        />
      )}
    </div>
  );
}

export default EditAnimalActivityPage;
