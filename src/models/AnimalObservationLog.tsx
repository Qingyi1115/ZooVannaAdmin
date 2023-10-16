import { Rating } from "../enums/Rating";
import Animal from "./Animal";
import Keeper from "./Keeper";

interface AnimalObservationLog {
  animalObservationLogId: number;
  dateTime: Date;
  durationInMinutes: number;
  observationQuality: Rating;
  details: string;
  animals: Animal[];
  keeper: Keeper;
}

export default AnimalObservationLog;
