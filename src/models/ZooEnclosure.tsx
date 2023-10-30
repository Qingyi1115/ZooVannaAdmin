import { EnclosureStatus } from "../enums/Enumurated";
import BarrierType from "./BarrierType";
import EnrichmentItem from "./EnrichmentItem";
import Keeper from "./Keeper";
import Plantation from "./Plantation";
import TerrainDistribution from "./TerrainDistribution";

interface ZooEnclosure {
  enclosureId: number;
  name: string;
  length: number;
  width: number;
  height: number;
  landArea: number;
  waterArea: number;
  plantationCoveragePercent: number;
  standoffBarrierDist: number;
  safetyFeatures: string;
  acceptableTempMin: number;
  acceptableTempMax: number;
  acceptableHumidityMin: number;
  acceptableHumidityMax: number;
  enclosureStatus: EnclosureStatus;

  // Foreign Keys
  enrichmentItems: EnrichmentItem[];
  // geographicalFeatures: GeographicalFeatures[];
  // waterFeatures: WaterFeatures[];
  terrainDistribution: TerrainDistribution;
  plantations: Plantation[] | null;
  keepers: Keeper[];
  barrierType: BarrierType | null;
}
export default ZooEnclosure;
