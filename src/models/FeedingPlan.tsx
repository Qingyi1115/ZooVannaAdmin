import Animal from "./Animal";
import AnimalFeedingLog from "./AnimalFeedingLog";
import FeedingPlanSessionDetail from "./FeedingPlanSessionDetail";
import Species from "./Species";

interface FeedingPlan {
  feedingPlanId: number;
  feedingPlanDesc: string;
  startDate: Date;
  endDate: Date;

  //--FK
  species?: Species;
  animals?: Animal[];
  feedingPlanSessionDetails?: FeedingPlanSessionDetail[];
  animalFeedingLog?: AnimalFeedingLog[];
}

export default FeedingPlan;
