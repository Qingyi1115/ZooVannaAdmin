import { ActivityType } from "../enums/ActivityType";
import Animal from "./Animal";
import Customer from "./Customer";
import InHouse from "./InHouse";
import Keeper from "./Keeper";
import PublicEventSession from "./PublicEventSession";

interface PublicEvent {
  publicEventId: number;
  activityType: ActivityType;
  title: string;
  details: string;
  imageUrl: string;
  startDate: Date;
  endDate: Date | null;
 
  animals: Animal[];
  keepers: Keeper[];
  inhouse: InHouse;
  publicEventSessions: PublicEventSession[];
  customers: Customer[];
}

export default PublicEvent;
