import {
  ActivityType,
  DayOfWeek,
  EventTimingType,
  RecurringPattern,
} from "../enums/Enumurated";
import Animal from "./Animal";
import AnimalActivityLog from "./AnimalActivityLog";
import AnimalObservationLog from "./AnimalObservationLog";
import EnrichmentItem from "./EnrichmentItem";
import ZooEvent from "./ZooEvent";

interface AnimalActivity {
  animalActivityId: number;
  activityType: ActivityType;
  title: string;
  details: string;
  startDate: Date;
  endDate: Date;
  recurringPattern: RecurringPattern;
  dayOfWeek: DayOfWeek | null;
  dayOfMonth: number | null;
  eventTimingType: EventTimingType;
  durationInMinutes: number;
  requiredNumberOfKeeper: number;

  // -- FK
  animals?: Animal[];
  enrichmentItems?: EnrichmentItem[];
  zooEvents?: ZooEvent[];
  animalActivityLogs?: AnimalActivityLog[];
  animalObservationLogs?: AnimalObservationLog[];
}

export default AnimalActivity;
