import React, { useEffect, useState } from "react";
import CreateAnimalActivityForm from "../../components/AnimalManagement/CreateAnimalActivityPage/CreateAnimalActivityForm";
import { useParams } from "react-router-dom";
import AnimalActivityLog from "../../models/AnimalActivityLog";
import useApiJson from "../../hooks/useApiJson";

function CreateAnimalActivityPage() {
  const apiJson = useApiJson();
  const { animalActivityLogId } = useParams<{ animalActivityLogId: string }>();
  const [curAnimalActivityLog, setCurAnimalActivityLog] = useState<AnimalActivityLog>(emptyAnimalActivityLog);

  useEffect(() => {
    apiJson.get(`http://localhost:3000/api/animal/getAnimalActivityLogById/${animalActivityLogId}`).then(res => {
      setCurAnimalActivityLog(res["animalActivityLog"]);
    });
  }, [0]);


  return (
    <div className="p-10">
      <CreateAnimalActivityForm />
    </div>
  );
}

export default CreateAnimalActivityPage;
