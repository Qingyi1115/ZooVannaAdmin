import { EventTimingType } from "../enums/Enumurated";
import ZooEvent from "./ZooEvent";

enum DayOfWeek{
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY",
}


interface FeedingPlanSessionDetail {
    feedingPlanSessionDetailId: number;
    dayOfWeek : DayOfWeek;
    eventTimingType: EventTimingType;
    durationInMinutes: number;

    feedingPlan?: any;
    feedingItems?: any[];
    zooEvents?: ZooEvent[];
    
}

export {DayOfWeek};
export default FeedingPlanSessionDetail;