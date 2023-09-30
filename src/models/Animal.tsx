import {
  AcquisitionMethod,
  AnimalGrowthStage,
  AnimalSex,
} from "../enums/Enumurated";
import Species from "./Species";

interface Animal {
  animalId: number;
  animalCode: string;
  imageUrl: string;
  houseName: string;
  sex: AnimalSex;
  dateOfBirth: Date;
  placeOfBirth: string;
  rfidTagNum: string;
  acquisitionMethod: AcquisitionMethod;
  dateOfAcquisition: Date;
  acquisitionRemarks: string;
  weight: number;
  physicalDefiningCharacteristics: string;
  behavioralDefiningCharacteristics: string;
  dateOfDeath: Date | null;
  locationOfDeath: string | null;
  causeOfDeath: string | null;
  growthStage: AnimalGrowthStage;
  animalStatus: string;

  location?: string;

  species: Species;
  parents?: Animal[];
  children?: Animal[];
  //  enclosure?: Enclosure;
  //  animalLog?: AnimalLog;
  events?: Event[];
}

export default Animal;
