import {
  AnimalFeedCategory,
  AnimalGrowthStage,
  PresentationContainer,
  PresentationLocation,
  PresentationMethod,
} from "../enums/Enumurated";
import Species from "./Species";
interface PhysiologicalReferenceNorms {
  physiologicalRefId: number;
  sizeMaleCm: number;
  sizeFemaleCm: number;
  weightMaleKg: number;
  weightFemaleKg: number;
  minAge: number;
  maxAge: number;
  growthStage: AnimalGrowthStage;

  species?: Species;
}

export default PhysiologicalReferenceNorms;
