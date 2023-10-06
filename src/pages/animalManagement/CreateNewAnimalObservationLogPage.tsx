import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApiJson from "../../hooks/useApiJson";
import Animal from "../../models/Animal";
import CreateNewAnimalObservationLogForm from "../../components/AnimalManagement/ViewAnimalDetailsPage/CreateNewAnimalObservationLogForm";
import { AnimalSex, AcquisitionMethod, AnimalGrowthStage } from "../../enums/Enumurated";
import Species from "../../models/Species";

function CreateNewAnimalObservationLogPage() {
  const apiJson = useApiJson();
  const { animalId } = useParams<{ animalId: string }>();
  
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
    ageToJuvenile: 0,
    ageToAdolescent: 1,
    ageToAdult: 2,
    ageToElder: 3,
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

  const [curAnimal, setCurAnimal] = useState<Animal>(emptyAnimal);

  useEffect(() => {
    apiJson.post(`http://localhost:3000/api/assetAnimal/getAnimal/${animalId}`, { includes: [] }).then(res => {
      setCurAnimal(res.animal as Animal);
    });
  }, []);


  return (
    <div className="p-10">
      <CreateNewAnimalObservationLogForm curAnimal={curAnimal} />
    </div>
  );
}

export default CreateNewAnimalObservationLogPage;
