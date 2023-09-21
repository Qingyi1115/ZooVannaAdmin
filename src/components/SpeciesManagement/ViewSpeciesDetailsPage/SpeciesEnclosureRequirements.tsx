import React, { useEffect, useState } from "react";
import useApiJson from "../../../hooks/useApiJson";
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
import SpeciesEnclosureNeed from "../../../models/SpeciesEnclosureNeed";

interface SpeciesEnclosureRequirementsProps {
  curSpecies: Species;
}
function SpeciesEnclosureRequirements(
  props: SpeciesEnclosureRequirementsProps
) {
  const { curSpecies } = props;
  const apiJson = useApiJson();
  //   const [curEnclosureNeeds, setCurEnclosureNeeds] =
  //     useState<SpeciesEnclosureNeed | null>(null);

  //   useEffect(() => {
  //     const fetchSpecies = async () => {
  //       try {
  //         const responseJson = await apiJson.get(
  //           `http://localhost:3000/api/species/getEnclosureNeeds/${curSpecies.speciesCode}`
  //         );
  //         setCurEnclosureNeeds(responseJson as SpeciesEnclosureNeed);
  //       } catch (error: any) {
  //         console.log(error);
  //       }
  //     };

  //     fetchSpecies();
  //   }, []);
  const curEnclosureNeeds: SpeciesEnclosureNeed = {
    speciesEnclosureNeedId: 1,
    smallExhibitHeightRequired: 10, // nullable
    minLandAreaRequired: 10,
    minWaterAreaRequired: 10,
    acceptableTempMin: 10,
    acceptableTempMax: 10,
    acceptableHumidityMin: 10,
    acceptableHumidityMax: 20,
    recommendedStandOffBarrierDistMetres: 10,
    plantationCoveragePercentMin: 10,
    plantationCoveragePercentMax: 20,
    longGrassPercentMin: 10,
    longGrassPercentMax: 20,
    shortGrassPercentMin: 10,
    shortGrassPercentMax: 20,
    rockPercentMin: 10,
    rockPercentMax: 20,
    sandPercentMin: 0,
    sandPercentMax: 0,
    snowPercentMin: 0,
    snowPercentMax: 0,
    soilPercenMin: 20,
    soilPercenMax: 40,
  };

  return <div>{curEnclosureNeeds.acceptableHumidityMax}</div>;
}

export default SpeciesEnclosureRequirements;
