import Animal from "./Animal";
import {
  ActivityType,
  DayOfWeek,
  EventTimingType,
  RecurringPattern,
} from "../enums/Enumurated";
import EnrichmentItem from "./EnrichmentItem";
import Employee from "./Employee";
import ZooEvent from "./ZooEvent";
import AnimalActivityLog from "./AnimalActivityLog";

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

  // -- FK
  animals?: Animal[];
  enrichmentItems?: EnrichmentItem[];
  zooEvents?: ZooEvent[];
  animalActivityLogs: AnimalActivityLog[];
}

export default AnimalActivity;
