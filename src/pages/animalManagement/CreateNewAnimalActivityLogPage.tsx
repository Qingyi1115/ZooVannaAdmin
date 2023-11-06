import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CreateNewAnimalActivityLogForm from "../../components/AnimalManagement/ViewAnimalDetailsPage/CreateNewAnimalActivityLogForm";
import { AcquisitionMethod, ActivityType, AnimalGrowthStage, AnimalSex, EventTimingType, KeeperType, RecurringPattern, Specialization } from "../../enums/Enumurated";
import useApiJson from "../../hooks/useApiJson";
import { useAuthContext } from "../../hooks/useAuthContext";
import Animal from "../../models/Animal";
import AnimalActivity from "../../models/AnimalActivity";
import Employee from "../../models/Employee";
import Keeper from "../../models/Keeper";
import Species from "../../models/Species";

function CreateAnimalActivityLogPage() {
  const apiJson = useApiJson();
  const { animalActivityId } = useParams<{ animalActivityId: string }>();
  const employee = useAuthContext().state.user?.employeeData;

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

  let emptyKeeper: Keeper = {
    id: 0,
    keeperType: KeeperType.SENIOR_KEEPER,
    specialization: Specialization.MAMMAL,
    isDisabled: false,
    employee: emptyEmployee
  }

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
  return (
    <div className="p-10">
      <CreateNewAnimalActivityLogForm curAnimalActivity={curAnimalActivity} />
    </div>
  );
}

export default CreateAnimalActivityLogPage;
