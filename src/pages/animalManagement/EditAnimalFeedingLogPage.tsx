import { useEffect, useState } from "react";
import { useParams } from "react-router";
import EditAnimalFeedingLogForm from "../../components/AnimalManagement/ViewAnimalDetailsPage/EditAnimalFeedingLogForm";
<<<<<<< HEAD
import {
  AnimalSex,
  AcquisitionMethod,
  AnimalGrowthStage,
  KeeperType,
  Specialization,
} from "../../enums/Enumurated";
=======
import { AcquisitionMethod, AnimalGrowthStage, AnimalSex, KeeperType, Specialization } from "../../enums/Enumurated";
import useApiJson from "../../hooks/useApiJson";
>>>>>>> ed3fa67af0c56d8b0ecfa75d9d9b76bcc68344e4
import { useAuthContext } from "../../hooks/useAuthContext";
import Animal from "../../models/Animal";
import AnimalFeedingLog from "../../models/AnimalFeedingLog";
import Employee from "../../models/Employee";
import FeedingPlan from "../../models/FeedingPlan";
import Keeper from "../../models/Keeper";
import Species from "../../models/Species";

function EditAnimalFeedingLogPage() {
  const apiJson = useApiJson();
  const { animalFeedingLogId } = useParams<{ animalFeedingLogId: string }>();
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
  };

  let emptyKeeper: Keeper = {
    id: 0,
    keeperType: KeeperType.SENIOR_KEEPER,
    specialization: Specialization.MAMMAL,
    isDisabled: false,
    employee: emptyEmployee,
  };

  let emptyFeedingPlan: FeedingPlan = {
    feedingPlanId: -1,
    feedingPlanDesc: "",
    startDate: new Date(),
    endDate: new Date(),
    animals: [],
    feedingPlanSessionDetails: [],
    title: "",
  };

  let emptyAnimalFeedingLog: AnimalFeedingLog = {
    animalFeedingLogId: 0,
    dateTime: new Date(),
    durationInMinutes: 0,
    amountOffered: "",
    amountConsumed: "",
    amountLeftovers: "",
    presentationMethod: "",
    extraRemarks: "",
    animals: [],
    keeper: emptyKeeper,
<<<<<<< HEAD
=======
    feedingPlan: emptyFeedingPlan
>>>>>>> ed3fa67af0c56d8b0ecfa75d9d9b76bcc68344e4
  };

  const [curAnimalFeedingLog, setCurAnimalFeedingLog] =
    useState<AnimalFeedingLog>(emptyAnimalFeedingLog);

  useEffect(() => {
    apiJson
      .get(
        `http://localhost:3000/api/animal/getAnimalFeedingLogById/${animalFeedingLogId}`
      )
      .then((res) => {
        setCurAnimalFeedingLog(res["animalFeedingLog"]);
      });
  }, [0]);

  return (
    <div className="p-10">
      {curAnimalFeedingLog && curAnimalFeedingLog.animalFeedingLogId != -1 && (
        <EditAnimalFeedingLogForm curAnimalFeedingLog={curAnimalFeedingLog} />
      )}
    </div>
  );
}

export default EditAnimalFeedingLogPage;
