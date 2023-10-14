import { Rating } from "../enums/Rating";
import Animal from "./Animal";
import Keeper from "./Keeper";
import { ActivityType } from "../enums/ActivityType";
import { Reaction } from "../enums/Reaction";

interface AnimalActivityLog {
  animalActivityLogId: number;
  activityType: ActivityType;
  dateTime: Date;
  durationInMinutes: number;
  sessionRating: Rating;
  animalReaction: Reaction;
  details: string;
  animals: Animal[];
  keeper: Keeper;
}

export default AnimalActivityLog;
