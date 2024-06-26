import Species from "./Species";

interface SpeciesEnclosureNeed {
  speciesEnclosureNeedId: number;
  smallExhibitHeightRequired: number; // -1 if don't have
  minLandAreaRequired: number;
  minWaterAreaRequired: number;
  acceptableTempMin: number;
  acceptableTempMax: number;
  acceptableHumidityMin: number;
  acceptableHumidityMax: number;
  recommendedStandOffBarrierDistMetres: number;
  plantationCoveragePercentMin: number;
  plantationCoveragePercentMax: number;
  longGrassPercentMin: number;
  longGrassPercentMax: number;
  shortGrassPercentMin: number;
  shortGrassPercentMax: number;
  rockPercentMin: number;
  rockPercentMax: number;
  sandPercentMin: number;
  sandPercentMax: number;
  snowPercentMin: number;
  snowPercentMax: number;
  soilPercentMin: number;
  soilPercentMax: number;

  species?: Species;
}

export default SpeciesEnclosureNeed;
