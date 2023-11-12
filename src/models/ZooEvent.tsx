import { EventTimingType, EventType } from "../enums/Enumurated";
import Animal from "./Animal";
import AnimalActivity from "./AnimalActivity";
import FeedingPlanSessionDetail from "./FeedingPlanSessionDetail";
import InHouse from "./InHouse";
import Keeper from "./Keeper";
import PlanningStaff from "./PlanningStaff";

interface ZooEvent {
  zooEventId: number;
  eventName: string;
  eventDescription: string;
  eventIsPublic: boolean;
  eventType?: EventType | string;
  eventStartDateTime: Date;
  requiredNumberOfKeeper: number;

  // Internal Event
  eventDurationHrs: number;
  eventTiming: EventTimingType | null;

  // External Event
  eventNotificationDate: Date;
  eventEndDateTime: Date | null;
  imageUrl: string;

  planningStaff?: PlanningStaff;
  keepers?: Keeper[]; // work
  // enclosure?: Enclosure;
  animals?: Animal[];
  inHouse?: InHouse;
  // animalClinic?: AnimalClinic;
  animalActivity?: AnimalActivity;
  feedingPlanSessionDetail?: FeedingPlanSessionDetail;
}

export default ZooEvent;
