import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApiJson from "../../hooks/useApiJson";
import Animal from "../../models/Animal";
import CreateNewAnimalObservationLogForm from "../../components/AnimalManagement/ViewAnimalDetailsPage/CreateNewAnimalObservationLogForm";
import { AnimalSex, AcquisitionMethod, AnimalGrowthStage } from "../../enums/Enumurated";
import Species from "../../models/Species";

function CreateNewAnimalObservationLogPage() {
  const apiJson = useApiJson();
  // const { speciesCode } = useParams<{ speciesCode: string }>();

  // let emptySpecies: Species = {
  //   speciesId: -1,
  //   speciesCode: "",
  //   commonName: "",
  //   scientificName: "",
  //   aliasName: "",
  //   conservationStatus: "",
  //   domain: "",
  //   kingdom: "",
  //   phylum: "",
  //   speciesClass: "",
  //   order: "",
  //   family: "",
  //   genus: "",
  //   nativeContinent: "",
  //   nativeBiomes: "",
  //   educationalDescription: "",
  //   educationalFunFact: "",
  //   groupSexualDynamic: "",
  //   habitatOrExhibit: "habitat",
  //   imageUrl: "",
  //   generalDietPreference: "",
  //   ageToJuvenile: 0,
  //   ageToAdolescent: 1,
  //   ageToAdult: 2,
  //   ageToElder: 3,
  //   lifeExpectancyYears: 0,
  // };

  // const [curAnimalList, setCurAnimalList] = useState<Animal[]>([]);

  // useEffect(() => {
  //   apiJson.get(`http://localhost:3000/api/animal/getAllAnimals/`).then(res => {
  //     setCurAnimalList(res.allAnimals as Animal[]);
  //   });
  // }, []);


  return (
    <div className="p-10">
      <CreateNewAnimalObservationLogForm />
    </div>
  );
}

export default CreateNewAnimalObservationLogPage;
