import Keeper from "./Keeper";
import ZooEvent from "./ZooEvent";
import Animal from "./Animal";
import Facility from "./Facility";
import { EnclosureStatus } from "../enums/Enumurated";
import Plantation from "./Plantation";
import BarrierType from "./BarrierType";

interface Enclosure {
  enclosureId: number;
  name: string;
  remark: string | null;
  length: number;
  width: number;
  height: number;
  enclosureStatus: EnclosureStatus;
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
  Keeper?: Keeper[];
}

export default Enclosure;
