import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import useApiJson from "../../hooks/useApiJson";
import AnimalActivity from "../../models/Event";
import EditEventForm from "../../components/EventManagement/EditEventPage/EditEventForm";

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
        setCurAnimalActivity(responseJson as AnimalActivity);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchAnimalActivity();
  }, [refreshSeed]);

  return (
    <div className="p-10">
      {curAnimalActivity && curAnimalActivity.animalActivityId != -1 && (
        <EditEventForm
          curAnimalActivity={curAnimalActivity}
          refreshSeed={refreshSeed}
          setRefreshSeed={setRefreshSeed}
        />
      )}
    </div>
  );
}

export default EditAnimalActivityPage;
