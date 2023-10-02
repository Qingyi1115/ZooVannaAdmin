import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useApiJson from "../../hooks/useApiJson";
import Species from "../../models/Species";
import EditEnclosureRequirementsForm from "../../components/SpeciesManagement/ViewSpeciesDetailsPage/EditEnclosureRequirementsForm";
import SpeciesEnclosureNeed from "../../models/SpeciesEnclosureNeed";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CreateDietaryRequirementsForm from "../../components/SpeciesManagement/ViewSpeciesDetailsPage/CreateDietaryRequirementsForm";
import Animal from "../../models/Animal";
import CreateWeightRecordForm from "../../components/AnimalManagement/ViewAnimalDetailsPage/CreateWeightRecordForm";

import {
  AcquisitionMethod,
  AnimalGrowthStage,
  AnimalSex,
} from "../../enums/Enumurated";
import AnimalBasicInformation from "../../components/AnimalManagement/ViewAnimalDetailsPage/AnimalBasicInformation";
import AnimalWeightInfo from "../../components/AnimalManagement/ViewAnimalDetailsPage/AnimalWeightInfo";

let testPandaSpecies: Species = {
  speciesId: 1,
  speciesCode: "SPE001",
  commonName: "Giant Panda",
  scientificName: "Ailuropoda Melanoleuca",
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
  imageUrl: "img/species/panda.jpg",
  generalDietPreference: "",
  lifeExpectancyYears: 65,
};

let testPandaAnimal: Animal = {
  animalId: 1,
  animalCode: "ANI001",
  imageUrl: "",
  houseName: "Kai Kai",
  sex: AnimalSex.MALE,
  dateOfBirth: new Date("1983-06-06"),
  placeOfBirth: "Place of Birth haha",
  rfidTagNum: "RFID00001",
  acquisitionMethod: AcquisitionMethod.INHOUSE_CAPTIVE_BRED,
  dateOfAcquisition: new Date(),
  acquisitionRemarks: "Acquisition Remarks blabla",
  weight: -1,
  physicalDefiningCharacteristics: "Big head",
  behavioralDefiningCharacteristics: "Lazy",
  dateOfDeath: null,
  locationOfDeath: null,
  causeOfDeath: null,
  growthStage: AnimalGrowthStage.JUVENILE,
  animalStatus: "NORMAL",
  species: testPandaSpecies,
};

function CreateNewWeightRecord() {
  const apiJson = useApiJson();

  const { animalId } = useParams<{ animalId: string }>();
  const [curAnimal, setCurAnimal] = useState<Animal | null>(testPandaAnimal);

  useEffect(() => {
    const fetchCurAnimal = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/animal/getAnimal/${animalId}`
        );
        setCurAnimal(responseJson as Animal);
      } catch (error: any) {
        console.log(error);
      }
    };

    // fetchCurAnimal();
  }, []);

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark">
        {curAnimal && <CreateWeightRecordForm curAnimal={curAnimal} />}
      </div>
    </div>
  );
}

export default CreateNewWeightRecord;
