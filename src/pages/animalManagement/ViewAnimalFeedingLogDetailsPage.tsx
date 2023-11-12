import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useApiJson from "../../hooks/useApiJson";
import AnimalFeedingLog from "../../models/AnimalFeedingLog";

import { Button } from "@/components/ui/button";
<<<<<<< HEAD
import Employee from "../../models/Employee";
import { useAuthContext } from "../../hooks/useAuthContext";
import {
  AnimalSex,
  AcquisitionMethod,
  AnimalGrowthStage,
  KeeperType,
  Specialization,
} from "../../enums/Enumurated";
import Animal from "../../models/Animal";
import Species from "../../models/Species";
import { Rating } from "../../enums/Rating";
=======
>>>>>>> ed3fa67af0c56d8b0ecfa75d9d9b76bcc68344e4
import ViewAnimalFeedingLogDetails from "../../components/AnimalManagement/ViewAnimalDetailsPage/ViewAnimalFeedingLogDetails";
import { AcquisitionMethod, AnimalGrowthStage, AnimalSex, KeeperType, Specialization } from "../../enums/Enumurated";
import { useAuthContext } from "../../hooks/useAuthContext";
import Animal from "../../models/Animal";
import Employee from "../../models/Employee";
import FeedingPlan from "../../models/FeedingPlan";
import Keeper from "../../models/Keeper";
import Species from "../../models/Species";

function ViewAnimalFeedingLogDetailsPage() {
  const apiJson = useApiJson();
  const { animalFeedingLogId } = useParams<{ animalFeedingLogId: string }>();
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
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  useEffect(() => {
<<<<<<< HEAD
    apiJson
      .get(
        `http://localhost:3000/api/animal/getAnimalFeedingLogById/${animalFeedingLogId}`
      )
      .then((res) => {
=======
    apiJson.get(
      `http://localhost:3000/api/animal/getAnimalFeedingLogById/${animalFeedingLogId}`)
      .then(res => {
        console.log("res", res);
>>>>>>> ed3fa67af0c56d8b0ecfa75d9d9b76bcc68344e4
        setCurAnimalFeedingLog(res.animalFeedingLog as AnimalFeedingLog);
      })
      .catch((e) => console.log(e));
    console.log(curAnimalFeedingLog);
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
            View Animal Feeding Log Details
          </span>
          <Button disabled className="invisible">
            Back
          </Button>
        </div>

        <hr className="bg-stroke opacity-20" />
        {/* <span className=" self-center text-title-xl font-bold">
          {curAnimalFeedingLog.animalFeedingLogId}
        </span> */}
        <ViewAnimalFeedingLogDetails
          curAnimalFeedingLog={curAnimalFeedingLog}
        />
      </div>
    </div>
  );
}

export default ViewAnimalFeedingLogDetailsPage;
