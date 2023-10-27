import React from "react";
import CreateNewAnimalFeedingLogForm from "../../components/AnimalManagement/ViewAnimalDetailsPage/CreateNewAnimalFeedingLogForm";
import useApiJson from "../../hooks/useApiJson";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

function CreateAnimalFeedingLogPage() {
  const apiJson = useApiJson();
  const { feedingPlanId } = useParams<{ feedingPlanId: string }>();
  const employee = useAuthContext().state.user?.employeeData;
  return (
    <div className="p-10">
      <CreateNewAnimalFeedingLogForm />
    </div>
  );
}

export default CreateAnimalFeedingLogPage;
