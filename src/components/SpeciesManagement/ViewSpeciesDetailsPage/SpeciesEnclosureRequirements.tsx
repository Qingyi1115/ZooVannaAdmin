import React from "react";
import Species from "../../../models/Species";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SpeciesEnclosureRequirementsProps {
  curSpecies: Species;
}
function SpeciesEnclosureRequirements(
  props: SpeciesEnclosureRequirementsProps
) {
  const { curSpecies } = props;
  return <div>{curSpecies.speciesEnclosureNeed?.acceptableHumidityMax}</div>;
}

export default SpeciesEnclosureRequirements;
