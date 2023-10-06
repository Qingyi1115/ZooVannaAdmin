import { Rating } from "../enums/Rating";
import Animal from "./Animal";
import Employee from "./Employee";

interface AnimalObservationLog {
  animalObservationLogId: number;
  dateTime: Date;
  durationInMinutes: number;
  observationQuality: Rating;
  details: string;
  animals: Animal[];
  employee: Employee;
}

export default AnimalObservationLog;
