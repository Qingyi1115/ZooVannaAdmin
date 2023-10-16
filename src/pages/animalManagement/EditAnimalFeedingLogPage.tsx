import { useState, useEffect } from "react";
import { useParams } from "react-router";
import useApiJson from "../../hooks/useApiJson";
import { Rating } from "../../enums/Rating";
import EditAnimalFeedingLogForm from "../../components/AnimalManagement/ViewAnimalDetailsPage/EditAnimalFeedingLogForm";
import { AnimalSex, AcquisitionMethod, AnimalGrowthStage, KeeperType, Specialization } from "../../enums/Enumurated";
import { useAuthContext } from "../../hooks/useAuthContext";
import Animal from "../../models/Animal";
import AnimalFeedingLog from "../../models/AnimalFeedingLog";
import Employee from "../../models/Employee";
import Species from "../../models/Species";
import Keeper from "../../models/Keeper";

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
    employeeProfileUrl: "",
  };

  let emptyKeeper: Keeper = {
    id: 0,
    keeperType: KeeperType.SENIOR_KEEPER,
    specialization: Specialization.MAMMAL,
    isDisabled: false,
    employee: emptyEmployee
  }

  let emptyAnimalFeedingLog: AnimalFeedingLog = {
    animalFeedingLogId: 0,
    dateTime: new Date(),
    durationInMinutes: 0,
    details: "",
    animals: [],
    keeper: emptyKeeper
  };

  const [curAnimalFeedingLog, setCurAnimalFeedingLog] = useState<AnimalFeedingLog>(emptyAnimalFeedingLog);

  useEffect(() => {
    apiJson.get(`http://localhost:3000/api/animal/getAnimalFeedingLogById/${animalFeedingLogId}`).then(res => {
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
