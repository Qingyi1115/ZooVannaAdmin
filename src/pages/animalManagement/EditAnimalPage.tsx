import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import useApiJson from "../../hooks/useApiJson";
import Species from "../../models/Species";
import Animal from "../../models/Animal";
import {
  AcquisitionMethod,
  AnimalGrowthStage,
  AnimalSex,
} from "../../enums/Enumurated";
import EditAnimalForm from "../../components/AnimalManagement/EditAnimalPage/EditAnimalForm";

let emptySpecies: Species = {
  speciesId: -1,
  speciesCode: "",
  commonName: "",
  scientificName: "",
  aliasName: "",
  conservationStatus: "",
  domain: "",
  kingdom: "",
  phylum: "",
  speciesClass: "",
  order: "",
  family: "",
  genus: "",
  nativeContinent: "",
  nativeBiomes: "",
  educationalDescription: "",
  educationalFunFact: "",
  groupSexualDynamic: "",
  habitatOrExhibit: "habitat",
  imageUrl: "",
  generalDietPreference: "",
  lifeExpectancyYears: 0,
};
let emptyAnimal: Animal = {
  animalId: -1,
  animalCode: "",
  imageUrl: "",
  isGroup: false,
  houseName: "",
  identifierType: "",
  identifierValue: "",
  sex: AnimalSex.MALE,
  dateOfBirth: new Date(),
  placeOfBirth: "",
  acquisitionMethod: AcquisitionMethod.INHOUSE_CAPTIVE_BRED,
  dateOfAcquisition: new Date(),
  acquisitionRemarks: "",
  physicalDefiningCharacteristics: "",
  behavioralDefiningCharacteristics: "",
  dateOfDeath: null,
  locationOfDeath: null,
  causeOfDeath: null,
  growthStage: AnimalGrowthStage.ADOLESCENT,
  animalStatus: "",
  species: emptySpecies,
};

function EditAnimalPage() {
  const apiJson = useApiJson();

  const { animalCode } = useParams<{ animalCode: string }>();
  const [curAnimal, setCurAnimal] = useState<Animal | null>(null);
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/animal/getAnimalByAnimalCode/${animalCode}`
        );
        setCurAnimal(responseJson as Animal);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchAnimal();
  }, [refreshSeed]);

  return (
    <div className="p-10">
      {curAnimal && curAnimal.animalId != -1 && (
        <EditAnimalForm
          curAnimal={curAnimal}
          refreshSeed={refreshSeed}
          setRefreshSeed={setRefreshSeed}
        />
      )}
    </div>
  );
}

export default EditAnimalPage;
