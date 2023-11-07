import { DayOfWeek, RecurringPattern } from "../enums/Enumurated";
import PublicEvent from "./PublicEvent";
import ZooEvent from "./ZooEvent";

interface PublicEventSession {
  publicEventSessionId: number;
  recurringPattern: RecurringPattern;
  dayOfWeek: DayOfWeek | null; //nullable
  dayOfMonth: number | null;  //nullable
  durationInMinutes: number;
  time: string;
  daysInAdvanceNotification: number;

  publicEvent: PublicEvent;
  zooEvents: ZooEvent[];
}

export default PublicEventSession;
