import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CreateNewAnimalFeedingLogForm from "../../components/AnimalManagement/ViewAnimalDetailsPage/CreateNewAnimalFeedingLogForm";
import useApiJson from "../../hooks/useApiJson";
import { useAuthContext } from "../../hooks/useAuthContext";
import FeedingPlan from "../../models/FeedingPlan";

function CreateAnimalFeedingLogPage() {
  const apiJson = useApiJson();
  const { feedingPlanId } = useParams<{ feedingPlanId: string }>();
  const employee = useAuthContext().state.user?.employeeData;

  const [curFeedingPlan, setCurFeedingPlan] = useState<FeedingPlan | null>(
    null
  );
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  useEffect(() => {
    const fetchFeedingPlan = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/animal/getFeedingPlanById/${feedingPlanId}`
        );
        setCurFeedingPlan(responseJson as FeedingPlan);
        console.log("aaaa test");
        console.log(responseJson as FeedingPlan);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchFeedingPlan();
  }, [refreshSeed]);

  return (
    <div className="p-10">
      <CreateNewAnimalFeedingLogForm curFeedingPlan={curFeedingPlan} />
    </div>
  );
}

export default CreateAnimalFeedingLogPage;
