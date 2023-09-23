import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import EditAnimalFeedForm from "../../../components/AssetAndFacilityManagement/AssetManagement/AnimalFeed/EditAnimalFeedForm";
import useApiJson from "../../../hooks/useApiJson";
import AnimalFeed from "src/models/AnimalFeed";
import { AnimalFeedCategory } from "../../../enums/AnimalFeedCategory";


function EditAnimalFeedPage() {
  const apiJson = useApiJson();

  let emptyAnimalFeed: AnimalFeed = {
    animalFeedId: -1,
    animalFeedName: "",
    animalFeedImageUrl: "",
    animalFeedCategory: AnimalFeedCategory.OTHERS
  };

  const { animalFeedName } = useParams<{ animalFeedName: string }>();
  const [curAnimalFeed, setCurAnimalFeed] = useState<AnimalFeed>(emptyAnimalFeed);
  const [refreshSeed, setRefreshSeed] = useState<number>(0);
 
  useEffect(() => {
    const fetchAnimalFeed = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/assetfacility/getAnimalFeed/${animalFeedName}`
        );
        setCurAnimalFeed(responseJson as AnimalFeed);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchAnimalFeed();
  }, [refreshSeed]);

  useEffect(() => {
    const animalFeed = apiJson.result as AnimalFeed;
    setCurAnimalFeed(animalFeed);
  }, [apiJson.loading]);

  return (
    <div className="p-10">
      {curAnimalFeed && curAnimalFeed.animalFeedId != -1 && (
        <EditAnimalFeedForm 
        curAnimalFeed={curAnimalFeed} 
        refreshSeed={refreshSeed} 
        setRefreshSeed={setRefreshSeed} />
      )}
    </div>
  );
}

export default EditAnimalFeedPage;