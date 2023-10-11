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
  minSizeMaleCm: number;
  maxSizeMaleCm: number;
  minSizeFemaleCm: number;
  maxSizeFemaleCm: number;
  minWeightMaleKg: number;
  maxWeightMaleKg: number;
  minWeightFemaleKg: number;
  maxWeightFemaleKg: number;
  minAge: number;
  maxAge: number;
  growthStage: AnimalGrowthStage;

  species?: Species;
}

export default PhysiologicalReferenceNorms;
