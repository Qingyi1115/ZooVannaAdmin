import { AnimalFeedCategory } from "src/enums/AnimalFeedCategory";

interface AnimalFeed {
  animalFeedId: number;
  animalFeedName: string;
  animalFeedImageUrl: string;
  animalFeedCategory: AnimalFeedCategory;
}

export default AnimalFeed;
