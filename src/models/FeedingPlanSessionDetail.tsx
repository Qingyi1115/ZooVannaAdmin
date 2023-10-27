import FeedingItem from "./FeedingItem";
import FeedingPlan from "./FeedingPlan";
import ZooEvent from "./ZooEvent";

interface FeedingPlanSessionDetail {
  feedingPlanSessionDetailId: number;
  dayOfWeek: string;
  eventTimingType: string;
  durationInMinutes: number;
  isPublic: boolean;
  publicEventStartTime: string | null;
  requiredNumberOfKeeper: number;

  //--FK
  feedingPlan?: FeedingPlan;
  feedingItems?: FeedingItem[];
  zooEvents?: ZooEvent[];
}

export default FeedingPlanSessionDetail;
