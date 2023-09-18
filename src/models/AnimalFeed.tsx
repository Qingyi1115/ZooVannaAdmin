import { AnimalFeedCategory } from "src/enums/Enumerated";

interface AnimalFeed {
  animalFeedName: string;
  animalFeedImageUrl: string;
  animalFeedCategory: AnimalFeedCategory;
}

export default AnimalFeed;
