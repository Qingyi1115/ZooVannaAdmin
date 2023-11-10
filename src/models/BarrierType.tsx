import Enclosure from "./Enclosure";

interface BarrierType {
  barrierTypeId: number;
  barrierMaterialName: string;
  barrierTransparency: number;
  climbable: boolean;
  watertight: boolean;
  remarks: string;

  enclosure?: Enclosure;
}

export default BarrierType;
