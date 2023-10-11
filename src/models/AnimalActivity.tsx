import Animal from "./Animal";
import { ActivityType, EventTimingType } from "../enums/Enumurated";
import EnrichmentItem from "./EnrichmentItem";
import Employee from "./Employee";

interface AnimalActivity {
  animalActivityId: number;
  activityType: ActivityType;
  title: string;
  details: string;
  date: Date;
  session: EventTimingType;
  durationInMinutes: number;

  // -- FK
  animals?: Animal[];
  enrichmentItems?: EnrichmentItem[];
  employee?: Employee;
}

export default AnimalActivity;
