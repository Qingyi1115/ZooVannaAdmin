import { HubStatus } from "src/enums/HubStatus";
import Sensor from "./Sensor";
import Facility from "./Facility";

interface Hub {
    hubProcessorId: number;
    processorName: string;
    ipAddressName: string;
    lastDataUpdate: Date | null;
    hubSecret: string;
    hubStatus: HubStatus;
    sensors: Sensor[];
    facility: Facility;
}
export default Hub;