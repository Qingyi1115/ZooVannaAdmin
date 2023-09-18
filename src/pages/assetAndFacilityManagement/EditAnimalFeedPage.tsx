import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import EditAnimalFeedForm from "../../components/AssetAndFacilityManagement/AssetManagement/EditAnimalFeedForm";
import useApiJson from "../../hooks/useApiJson";
import AnimalFeed from "src/models/AnimalFeed";

function EditAnimalFeedPage() {
  const apiJson = useApiJson();

  let emptyAnimalFeed: AnimalFeed = {
    animalFeedId: -1,
    animalFeedCode: "",
    commonName: "",
    scientificName: "",
    aliasName: "",
    conservationStatus: "",
    domain: "",
    kingdom: "",
    phylum: "",
    animalFeedClass: "",
    order: "",
    family: "",
    genus: "",
    nativeContinent: "",
    nativeBiomes: "",
    educationalDescription: "",
    groupSexualDynamic: "",
    habitatOrExhibit: "habitat",
    imageUrl: "",
    generalDietPreference: "",
  };

  const { animalFeedCode } = useParams<{ animalFeedCode: string }>();
  const [curAnimalFeed, setCurAnimalFeed] = useState<AnimalFeed>(emptyAnimalFeed);

  useEffect(() => {
    apiJson.get(`http://localhost:3000/api/animalFeed/getanimalFeed/${animalFeedCode}`);
  }, []);

  useEffect(() => {
    const animalFeed = apiJson.result as AnimalFeed;
    setCurAnimalFeed(animalFeed);
  }, [apiJson.loading]);

  return (
    <div className="p-10">
      {curAnimalFeed && curAnimalFeed.animalFeedId != -1 && (
        <EditAnimalFeedForm curAnimalFeed={curAnimalFeed} />
      )}
    </div>
  );
}

export default EditAnimalFeedPage;
