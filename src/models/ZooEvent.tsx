import { EventTimingType, EventType } from "../enums/Enumurated";
import Animal from "./Animal";
import AnimalActivity from "./AnimalActivity";
import InHouse from "./InHouse";
import Keeper from "./Keeper";
import PlanningStaff from "./PlanningStaff";

interface ZooEvent {
  zooEventId: number;
  eventName: String;
  eventNotificationDate: Date;
  eventStartDateTime: Date;
  eventEndDateTime: Date | null;
  eventDurationHrs: number;
  eventTiming: EventTimingType | null;
  eventDescription: string;
  eventIsPublic: boolean;
  eventType?: EventType;

  planningStaff?: PlanningStaff;
  keepers?: Keeper[]; // work
  //   enclosure?: Enclosure;
  animal?: Animal;
  inHouse?: InHouse;
  AnimalActivity?: AnimalActivity;
}

export default ZooEvent;
