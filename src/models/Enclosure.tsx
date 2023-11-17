import { EnclosureStatus } from "../enums/Enumurated";
import Animal from "./Animal";
import BarrierType from "./BarrierType";
import Facility from "./Facility";
import Keeper from "./Keeper";
import Plantation from "./Plantation";
import ZooEvent from "./ZooEvent";

interface Enclosure {
  enclosureId: number;
  name: string;
  remark: string | null;
  length: number;
  width: number;
  height: number;
  enclosureStatus: EnclosureStatus;
  standOffBarrierDist: number | null;
  designDiagramJsonUrl: string | null;

  // Terrain Distribution
  longGrassPercent: number | null;
  shortGrassPercent: number | null;
  rockPercent: number | null;
  sandPercent: number | null;
  snowPercent: number | null;
  soilPercent: number | null;

  // Virtual
  landArea?: number | null;
  waterArea?: number | null;
  plantationCoveragePercent?: number | null;
  acceptableTempMin?: number | null;
  acceptableTempMax?: number | null;
  acceptableHumidityMin?: number | null;
  acceptableHumidityMax?: number | null;

  // FK
  // declare terrainDistribution?: TerrainDistribution;
  animals?: Animal[];
  barrierType?: BarrierType;
  plantation?: Plantation;
  zooEvents?: ZooEvent[];
  facility?: Facility;
  keepers?: Keeper[];
}

export default Enclosure;
