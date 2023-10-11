import Animal from "./Animal";
import Employee from "./Employee";

interface AnimalFeedingLog {
  animalFeedingLogId: number;
  dateTime: Date;
  durationInMinutes: number;
  details: string;
  animals: Animal[];
  employee: Employee;
}

export default AnimalFeedingLog;
