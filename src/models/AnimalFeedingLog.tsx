import Animal from "./Animal";
import Keeper from "./Keeper";

interface AnimalFeedingLog {
  animalFeedingLogId: number;
  dateTime: Date;
  durationInMinutes: number;
  details: string;
  animals: Animal[];
  keeper: Keeper;
}

export default AnimalFeedingLog;
