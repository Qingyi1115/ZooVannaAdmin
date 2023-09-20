import React from "react";
import { useParams } from "react-router-dom";

function ViewSpeciesDetails() {
  const { speciesCode } = useParams<{ speciesCode: string }>();
  return <div>ViewSpeciesDetails: {speciesCode}</div>;
}

export default ViewSpeciesDetails;
