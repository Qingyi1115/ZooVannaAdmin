import { useEffect, useState } from "react";
import { useParams } from "react-router";
import AnimalFeed from "src/models/AnimalFeed";
import EditAnimalFeedForm from "../../../components/AssetAndFacilityManagement/AssetManagement/AnimalFeed/EditAnimalFeedForm";
import { AnimalFeedCategory } from "../../../enums/AnimalFeedCategory";
import useApiJson from "../../../hooks/useApiJson";


function EditAnimalFeedPage() {
  const apiJson = useApiJson();

  let emptyAnimalFeed: AnimalFeed = {
    animalFeedId: -1,
    animalFeedName: "",
    animalFeedImageUrl: "",
    animalFeedCategory: AnimalFeedCategory.OTHERS
  };

  const { animalFeedId } = useParams<{ animalFeedId: string }>();
  const [curAnimalFeed, setCurAnimalFeed] = useState<AnimalFeed>(emptyAnimalFeed);
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  useEffect(() => {
    const fetchAnimalFeed = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/assetfacility/getAnimalFeedById/${animalFeedId}`
        );
        setCurAnimalFeed(responseJson.animalFeed as AnimalFeed);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchAnimalFeed();
  }, [refreshSeed]);


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