import { ActivityType } from "../enums/ActivityType";
import { Rating } from "../enums/Rating";
import { Reaction } from "../enums/Reaction";
import Animal from "./Animal";
import AnimalActivity from "./AnimalActivity";
import Keeper from "./Keeper";

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
  animalActivity: AnimalActivity;
}

export default AnimalActivityLog;
