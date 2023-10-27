import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useApiJson from "../../hooks/useApiJson";
import AnimalActivityLog from "../../models/AnimalActivityLog";

import { Button } from "@/components/ui/button";
import Employee from "../../models/Employee";
import { useAuthContext } from "../../hooks/useAuthContext";
import { AnimalSex, AcquisitionMethod, AnimalGrowthStage, KeeperType, Specialization, EventTimingType, RecurringPattern } from "../../enums/Enumurated";
import Animal from "../../models/Animal";
import Species from "../../models/Species";
import { Rating } from "../../enums/Rating";
import ViewAnimalActivityLogDetails from "../../components/AnimalManagement/ViewAnimalDetailsPage/ViewAnimalActivityLogDetails";
import Keeper from "../../models/Keeper";
import { Reaction } from "../../enums/Reaction";
import { ActivityType } from "../../enums/ActivityType";
import AnimalActivity from "../../models/AnimalActivity";



function ViewAnimalActivityLogDetailsPage() {
  const apiJson = useApiJson();
  const { animalActivityLogId } = useParams<{ animalActivityLogId: string }>();
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
    animalActivity: emptyAnimalActivity
  };

  const [curAnimalActivityLog, setCurAnimalActivityLog] = useState<AnimalActivityLog>(emptyAnimalActivityLog);
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  useEffect(() => {
    apiJson.get(
      `http://localhost:3000/api/animal/getAnimalActivityLogById/${animalActivityLogId}`)
      .then(res => {
        setCurAnimalActivityLog(res.animalActivityLog as AnimalActivityLog);
      })
      .catch(e => console.log(e));
    console.log(curAnimalActivityLog);
  }, []);


  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
        <div className="flex justify-between">
          <Button variant={"outline"} type="button" onClick={() => navigate(-1)} className="">
            Back
          </Button>
          <span className="self-center text-lg text-graydark">
            View Animal Activity Log Details
          </span>
          <Button disabled className="invisible">
            Back
          </Button>
        </div>

        <hr className="bg-stroke opacity-20" />
        <span className=" self-center text-title-xl font-bold">
          {curAnimalActivityLog.activityType + " at " + new Date(curAnimalActivityLog.dateTime).toLocaleString()}
        </span>
        <ViewAnimalActivityLogDetails curAnimalActivityLog={curAnimalActivityLog} />

      </div>
    </div>
  );
}

















export default ViewAnimalActivityLogDetailsPage;