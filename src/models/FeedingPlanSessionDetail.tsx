import FeedingItem from "./FeedingItem";
import FeedingPlan from "./FeedingPlan";
import ZooEvent from "./ZooEvent";

interface FeedingPlanSessionDetail {
  feedingPlanSessionDetailId:number;
  feedingPlanDetailId: number;
  dayOfWeek: string;
  eventTimingType: string;

  //--FK
  feedingPlan?: FeedingPlan;
  feedingItems?: FeedingItem[];
  zooEvents?: ZooEvent[];
}

export default FeedingPlanSessionDetail;
