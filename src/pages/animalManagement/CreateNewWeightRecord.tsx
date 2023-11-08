import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CreateWeightRecordForm from "../../components/AnimalManagement/ViewAnimalDetailsPage/CreateWeightRecordForm";
import useApiJson from "../../hooks/useApiJson";
import Animal from "../../models/Animal";
import Species from "../../models/Species";

import {
  AcquisitionMethod,
  AnimalGrowthStage,
  AnimalSex,
} from "../../enums/Enumurated";

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

function CreateNewWeightRecord() {
  const apiJson = useApiJson();

  const { animalCode } = useParams<{ animalCode: string }>();
  const [curAnimal, setCurAnimal] = useState<Animal | null>(emptyAnimal);

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
