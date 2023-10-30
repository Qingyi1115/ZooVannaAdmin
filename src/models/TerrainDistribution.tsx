import ZooEnclosure from "./ZooEnclosure";

interface TerrainDistribution {
    terrainDistributionId: number
    longGrassPercent: number
    shortGrassPercent: number
    rockPercent: number
    sandPercent: number
    snowPercent: number
    soilPercent: number

    // Foreign Keys
    enclosure: ZooEnclosure | null;
}

export default TerrainDistribution; 