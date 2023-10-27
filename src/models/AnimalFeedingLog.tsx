import Animal from "./Animal";
import FeedingPlan from "./FeedingPlan";
import Keeper from "./Keeper";

interface AnimalFeedingLog {
  animalFeedingLogId: number;
  dateTime: Date;
  durationInMinutes: number;
  amountOffered: string;
  amountConsumed: string;
  amountLeftovers: string;
  presentationMethod: string;
  extraRemarks: string;

  // FK
  animals: Animal[];
  keeper: Keeper;
  feedingPlan: FeedingPlan;
}

export default AnimalFeedingLog;
