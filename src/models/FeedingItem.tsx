import Animal from "./Animal";
import FeedingPlan from "./FeedingPlan";

interface FeedingItem {
  feedingItemId: number;
  foodCategory: string;
  amount: number;
  unit: string;

  //--FK
  animal?: Animal;
  feedingPlans?: FeedingPlan;
}

export default FeedingItem;
