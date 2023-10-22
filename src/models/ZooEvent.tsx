import { EventTimingType, EventType } from "../enums/Enumurated";
import Animal from "./Animal";
import AnimalActivity from "./AnimalActivity";
import InHouse from "./InHouse";
import Keeper from "./Keeper";
import PlanningStaff from "./PlanningStaff";

interface ZooEvent {
  zooEventId: number;
  eventName: String;
  eventDescription: string;
  eventIsPublic: boolean;
  eventType?: EventType;
  eventStartDateTime: Date;

  // Internal Event
  eventDurationHrs: number;
  eventTiming: EventTimingType | null;

  // External Event
  eventNotificationDate: Date;
  eventEndDateTime: Date | null;
  imageUrl: string;

  planningStaff?: PlanningStaff;
  keepers?: Keeper[]; // work
  //   enclosure?: Enclosure;
  animal?: Animal;
  inHouse?: InHouse;
  // animalClinic?: AnimalClinic;
  animalActivity?: AnimalActivity;
}

export default ZooEvent;
