import { ActivityType } from "../enums/ActivityType";
import { EventType } from "../enums/Enumurated";
import Animal from "./Animal";
import Customer from "./Customer";
import InHouse from "./InHouse";
import Keeper from "./Keeper";
import PublicEventSession from "./PublicEventSession";

interface PublicEvent {
  publicEventId: number;
  eventType: EventType;
  title: string;
  details: string;
  imageUrl: string;
  startDate: Date;
  endDate: Date | null;
  isDisabled: boolean;

  animals: Animal[];
  keepers: Keeper[];
  inHouse: InHouse;
  inHouseId: string;
  publicEventSessions: PublicEventSession[];
  customers: Customer[];
}

export default PublicEvent;
