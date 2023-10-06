import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import EditFacilityForm from "../../components/AssetAndFacilityManagement/FacilityManagement/EditFacilityForm";
import useApiJson from "../../hooks/useApiJson";
import Facility from "../../models/Facility";
import { Rating } from "../../enums/Rating";
import EditAnimalObservationLogForm from "../../components/AnimalManagement/ViewAnimalDetailsPage/EditAnimalObservationLogForm";
import { AnimalSex, AcquisitionMethod, AnimalGrowthStage } from "../../enums/Enumurated";
import { useAuthContext } from "../../hooks/useAuthContext";
import Animal from "../../models/Animal";
import AnimalObservationLog from "../../models/AnimalObservationLog";
import Employee from "../../models/Employee";
import Species from "../../models/Species";

function EditFacilityPage() {
  const apiJson = useApiJson();
  const { animalObservationLogId } = useParams<{ animalObservationLogId: string }>();
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

  let emptyAnimalObservationLog: AnimalObservationLog = {
    animalObservationLogId: 0,
    dateTime: new Date(),
    durationInMinutes: 0,
    observationQuality: Rating.NOT_RECORDED,
    details: "",
    animals: [],
    employee: emptyEmployee
  };

  const [curAnimalObservationLog, setCurAnimalObservationLog] = useState<AnimalObservationLog>(emptyAnimalObservationLog);

  useEffect(() => {
    apiJson.post(`http://localhost:3000/api/animal/getAnimalObservationLog/${animalObservationLogId}`, { includes: ["animals", "employee"] }).then(res => {
      setCurAnimalObservationLog(res["animalObservationLog"]);
    });
  }, [0]);

  return (
    <div className="p-10">
      {curAnimalObservationLog && curAnimalObservationLog.animalObservationLogId != -1 && (
        <EditAnimalObservationLogForm curAnimalObservationLog={curAnimalObservationLog} />
      )}
    </div>
  );
}

export default EditFacilityPage;
