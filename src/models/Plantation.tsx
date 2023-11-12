import { Biome } from "../enums/Enumurated";
import Enclosure from "./Enclosure";

interface Plantation {
  plantationId: number;
  name: string;
  biome: Biome;

  enclosure?: Enclosure;
}

export default Plantation;
