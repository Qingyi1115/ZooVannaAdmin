import ZooEnclosure from "./ZooEnclosure";

interface Plantation {
    plantationId: number;
    name: string;

    // Foreign Keys
    enclosure: ZooEnclosure;
}

export default Plantation;