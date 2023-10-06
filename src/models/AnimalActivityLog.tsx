import { Rating } from "../enums/Rating";
import Animal from "./Animal";
import Employee from "./Employee";
import { ActivityType } from "../enums/ActivityType";
import { Reaction } from "../enums/Reaction";

interface AnimalActivityLog {
  animalTrainingLogId: number;
  activityType: ActivityType;
  dateTime: Date;
  durationInMinutes: number;
  sessionRating: Rating;
  animalReaction: Reaction;
  details: string;
  animals: Animal[];
  employee: Employee;
}

export default AnimalActivityLog;
