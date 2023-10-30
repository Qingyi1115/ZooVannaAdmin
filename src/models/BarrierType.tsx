import ZooEnclosure from "./ZooEnclosure";

interface BarrierType {
    barrierTypeId: number
    barrierMaterialName: string
    barrierTransparency: number
    climbable: Boolean
    watertight: Boolean
    remarks: string

    // Foreign Keys
    enclosure: ZooEnclosure;
}

export default BarrierType;