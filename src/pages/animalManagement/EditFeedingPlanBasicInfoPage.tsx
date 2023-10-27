import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import useApiJson from "../../hooks/useApiJson";
import FeedingPlan from "../../models/FeedingPlan";
import EditFeedingPlanBasicInfoForm from "../../components/AnimalManagement/EditFeedingPlanBasicInfoPage/EditFeedingPlanBasicInfoForm";

function EditFeedingPlanBasicInfoPage() {
  const apiJson = useApiJson();

  const { feedingPlanId } = useParams<{ feedingPlanId: string }>();
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
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchFeedingPlan();
  }, [refreshSeed]);

  return (
    <div className="p-10">
      {curFeedingPlan && curFeedingPlan.feedingPlanId != -1 && (
        <EditFeedingPlanBasicInfoForm
          curFeedingPlan={curFeedingPlan}
          setCurFeedingPlan={setCurFeedingPlan}
          refreshSeed={refreshSeed}
          setRefreshSeed={setRefreshSeed}
        />
      )}
    </div>
  );
}

export default EditFeedingPlanBasicInfoPage;
