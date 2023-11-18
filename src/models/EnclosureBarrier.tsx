import { BarrierType } from "../enums/Enumurated";
import Enclosure from "./Enclosure";

interface EnclosureBarrier {
  enclosureBarrierId: number;
  wallName: string;
  barrierType: BarrierType;
  remarks: string;

  enclosure?: Enclosure;
}

export default EnclosureBarrier;
