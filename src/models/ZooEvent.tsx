import { EventTimingType, EventType } from "../enums/Enumurated";
import Animal from "./Animal";
import AnimalActivity from "./AnimalActivity";
import Employee from "./Employee";
import Enclosure from "./Enclosure";
import FeedingPlanSessionDetail from "./FeedingPlanSessionDetail";
import InHouse from "./InHouse";
import Keeper from "./Keeper";
import PlanningStaff from "./PlanningStaff";
import PublicEventSession from "./PublicEventSession";

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
  enclosure?: Enclosure;
  animals?: Animal[];
  inHouse?: InHouse;
  employee?: Employee;
  // animalClinic?: AnimalClinic;
  animalActivity?: AnimalActivity;
  feedingPlanSessionDetail?: FeedingPlanSessionDetail;
  publicEventSession?: PublicEventSession;
}

export default ZooEvent;
