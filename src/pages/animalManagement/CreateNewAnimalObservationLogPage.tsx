import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApiJson from "../../hooks/useApiJson";
import Animal from "../../models/Animal";
import CreateNewAnimalObservationLogForm from "../../components/AnimalManagement/ViewAnimalDetailsPage/CreateNewAnimalObservationLogForm";
import { AnimalSex, AcquisitionMethod, AnimalGrowthStage, ActivityType, EventTimingType, RecurringPattern } from "../../enums/Enumurated";
import Species from "../../models/Species";
import AnimalActivity from "../../models/AnimalActivity";
import Employee from "../../models/Employee";

function CreateNewAnimalObservationLogPage() {
  const apiJson = useApiJson();
  const { animalActivityId } = useParams<{ animalActivityId: string }>();
  // const { speciesCode } = useParams<{ speciesCode: string }>();

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

  let emptyEmployee: Employee = {
    employeeId: -1,
    employeeName: "",
    employeeEmail: "",
    employeeAddress: "",
    employeePhoneNumber: "",
    employeeDoorAccessCode: "",
    employeeEducation: "",
    employeeBirthDate: new Date(),
    isAccountManager: false,
    dateOfResignation: new Date(),
    employeeProfileUrl: "",
  };

  let emptyAnimalActivity: AnimalActivity = {
    animalActivityId: -1,
    activityType: ActivityType.ENRICHMENT,
    title: "",
    details: "",
    recurringPattern: RecurringPattern.DAILY,
    dayOfMonth: null,
    dayOfWeek: null,
    startDate: new Date(),
    endDate: new Date(),
    eventTimingType: EventTimingType.AFTERNOON,
    durationInMinutes: -1,
    animalActivityLogs: [],
    requiredNumberOfKeeper: 0
  }

  const [curAnimalActivity, setCurAnimalActivity] = useState<AnimalActivity>(emptyAnimalActivity);

  useEffect(() => {
    apiJson.get(`http://localhost:3000/api/animal/getAnimalActivityById/${animalActivityId}`).then(res => {
      setCurAnimalActivity(res["animalActivity"]);
      console.log("res", res)
    });
  }, []);

  // const [curAnimalList, setCurAnimalList] = useState<Animal[]>([]);

  // useEffect(() => {
  //   apiJson.get(`http://localhost:3000/api/animal/getAllAnimals/`).then(res => {
  //     setCurAnimalList(res.allAnimals as Animal[]);
  //   });
  // }, []);


  return (
    <div className="p-10">
      <CreateNewAnimalObservationLogForm curAnimalActivity={curAnimalActivity} />
    </div>
  );
}

export default CreateNewAnimalObservationLogPage;
