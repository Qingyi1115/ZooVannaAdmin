import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useApiJson from "../../hooks/useApiJson";
import AnimalObservationLog from "../../models/AnimalObservationLog";

import { Button } from "@/components/ui/button";
import ViewAnimalObservationLogDetails from "../../components/AnimalManagement/ViewAnimalDetailsPage/ViewAnimalObservationLogDetails";
import {
  AcquisitionMethod,
  ActivityType,
  AnimalGrowthStage,
  AnimalSex,
  EventTimingType,
  KeeperType,
  RecurringPattern,
  Specialization,
} from "../../enums/Enumurated";
import { Rating } from "../../enums/Rating";
import { useAuthContext } from "../../hooks/useAuthContext";
import Animal from "../../models/Animal";
import AnimalActivity from "../../models/AnimalActivity";
import Employee from "../../models/Employee";
import Keeper from "../../models/Keeper";
import Species from "../../models/Species";

function ViewAnimalObservationLogDetailsPage() {
  const apiJson = useApiJson();
  const { animalObservationLogId } = useParams<{
    animalObservationLogId: string;
  }>();
  const [assignedStaffIds, setAssignedStaffIds] = useState<number[]>([]);
  const [allStaffs, setAllStaffs] = useState<Employee[]>([]);
  const [empList, setEmpList] = useState<Employee[]>([]);
  const employee = useAuthContext().state.user?.employeeData;
  const navigate = useNavigate();

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
    activityType: ActivityType.TRAINING,
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

  let emptyAnimalObservationLog: AnimalObservationLog = {
    animalObservationLogId: 0,
    dateTime: new Date(),
    durationInMinutes: 0,
    observationQuality: Rating.NOT_RECORDED,
    details: "",
    animals: [],
    keeper: emptyKeeper,
    animalActivity: emptyAnimalActivity,
  };

  const [curAnimalObservationLog, setCurAnimalObservationLog] =
    useState<AnimalObservationLog>(emptyAnimalObservationLog);
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  useEffect(() => {
    apiJson
      .get(
        `http://localhost:3000/api/animal/getAnimalObservationLogById/${animalObservationLogId}`
      )
      .then((res) => {
        setCurAnimalObservationLog(
          res.animalObservationLog as AnimalObservationLog
        );
      })
      .catch((e) => console.log(e));
    console.log(curAnimalObservationLog);
  }, []);

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
        <div className="flex justify-between">
          <Button
            variant={"outline"}
            type="button"
            onClick={() => navigate(-1)}
            className=""
          >
            Back
          </Button>
          <span className="self-center text-title-xl font-bold">
            View Animal Observation Log Details
          </span>
          <Button disabled className="invisible">
            Back
          </Button>
        </div>

        <hr className="bg-stroke opacity-20" />
        {/* <span className=" self-center text-title-xl font-bold">
          {curAnimalObservationLog.animalObservationLogId}
        </span> */}
        <ViewAnimalObservationLogDetails
          curAnimalObservationLog={curAnimalObservationLog}
        />
      </div>
    </div>
  );
}

export default ViewAnimalObservationLogDetailsPage;
