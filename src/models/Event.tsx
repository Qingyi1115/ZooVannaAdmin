import { EventTimingType, EventType } from "../enums/Enumurated";
import Hub from "./HubProcessor";
import Keeper from "./Keeper";
import PlanningStaff from "./PlanningStaff";

interface ZooEvent {
  zooEventId: number;
  eventName: string;
  eventNotificationDate: Date;
  eventStartDateTime: Date;
  eventEndDateTime: Date;
  eventDurationHrs: number;
  isFlexible: boolean;
  eventDescription: string;
  eventIsPublic: boolean;
  eventType: EventType;
  eventTimingType: EventTimingType;
  
  //FK
  hubProcessor: Hub;
  keeper: Keeper;
  planningStaff: PlanningStaff;
}

export default ZooEvent;
