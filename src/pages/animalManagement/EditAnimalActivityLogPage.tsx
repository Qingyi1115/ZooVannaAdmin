import { useEffect, useState } from "react";
import { useParams } from "react-router";
import EditAnimalActivityLogForm from "../../components/AnimalManagement/ViewAnimalDetailsPage/EditAnimalActivityLogForm";
import { ActivityType } from "../../enums/ActivityType";
import {
  AcquisitionMethod,
  AnimalGrowthStage,
  AnimalSex,
  EventTimingType,
  KeeperType,
  RecurringPattern,
  Specialization,
} from "../../enums/Enumurated";
import { Rating } from "../../enums/Rating";
import { Reaction } from "../../enums/Reaction";
import useApiJson from "../../hooks/useApiJson";
import { useAuthContext } from "../../hooks/useAuthContext";
import Animal from "../../models/Animal";
import AnimalActivity from "../../models/AnimalActivity";
import AnimalActivityLog from "../../models/AnimalActivityLog";
import Employee from "../../models/Employee";
import Keeper from "../../models/Keeper";
import Species from "../../models/Species";

function EditAnimalActivityLogPage() {
  const apiJson = useApiJson();
  const { animalActivityLogId } = useParams<{ animalActivityLogId: string }>();
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
    requiredNumberOfKeeper: 0,
  };

  let emptyAnimalActivityLog: AnimalActivityLog = {
    animalActivityLogId: 0,
    dateTime: new Date(),
    durationInMinutes: 0,
    sessionRating: Rating.NOT_RECORDED,
    details: "",
    animals: [],
    keeper: emptyKeeper,
    activityType: ActivityType.TRAINING,
    animalReaction: Reaction.POSITIVE_RESPONSE,
    animalActivity: emptyAnimalActivity,
  };

  const [curAnimalActivityLog, setCurAnimalActivityLog] =
    useState<AnimalActivityLog>(emptyAnimalActivityLog);

  useEffect(() => {
    apiJson
      .get(
        `http://localhost:3000/api/animal/getAnimalActivityLogById/${animalActivityLogId}`
      )
      .then((res) => {
        setCurAnimalActivityLog(res["animalActivityLog"]);
      });
  }, [0]);

  return (
    <div className="p-10">
      {curAnimalActivityLog &&
        curAnimalActivityLog.animalActivityLogId != -1 && (
          <EditAnimalActivityLogForm
            curAnimalActivityLog={curAnimalActivityLog}
          />
        )}
    </div>
  );
}

export default EditAnimalActivityLogPage;
