import { spec } from "node:test/reporters";
import React from "react";
import { useParams } from "react-router-dom";

function AnimalFeedingPlanHomePage() {
  const { speciesCode } = useParams<{ speciesCode: string }>();

  return <div>AnimalFeedingPlanHomePage {speciesCode}</div>;
}

export default AnimalFeedingPlanHomePage;
