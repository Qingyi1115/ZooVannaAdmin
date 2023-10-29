import { HubStatus } from "src/enums/HubStatus";
import Sensor from "./Sensor";
import Facility from "./Facility";

interface HubProcessor {
    hubProcessorId: number;
    processorName: string;
    ipAddressName: string;
    lastDataUpdate: Date | null;
    hubSecret: string;
    hubStatus: HubStatus;
    sensors: Sensor[];
    facility: Facility;
    radioGroup: number | null;
}
export default HubProcessor;