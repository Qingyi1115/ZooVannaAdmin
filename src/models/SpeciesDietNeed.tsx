import {
  AnimalFeedCategory,
  AnimalGrowthStage,
  PresentationContainer,
  PresentationLocation,
  PresentationMethod,
} from "../enums/Enumurated";
import Species from "./Species";

interface SpeciesDietNeed {
  speciesDietNeedId: number;
  animalFeedCategory: AnimalFeedCategory;
  amountPerMealGram: number;
  amountPerWeekGram: number;
  presentationContainer: PresentationContainer;
  presentationMethod: PresentationMethod;
  presentationLocation: PresentationLocation;
  growthStage: AnimalGrowthStage;

  species?: Species;
}

export default SpeciesDietNeed;
