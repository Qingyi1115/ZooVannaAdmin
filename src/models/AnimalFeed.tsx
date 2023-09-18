import { AnimalFeedCategory } from "src/enums/Enumerated";

interface AnimalFeed {
  animalFeedId: number;
  animalFeedName: string;
  animalFeedImageUrl: string;
  animalFeedCategory: AnimalFeedCategory;
}

export default AnimalFeed;
