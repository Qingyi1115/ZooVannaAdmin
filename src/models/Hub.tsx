import { HubStatus } from "src/enums/HubStatus";
import Sensor from "./Sensor";

interface Hub {
    facilityId: number;
    hubProcessorId: number;
    processorName: string;
    ipAddressName: string;
    lastDataUpdate: Date | null;
    hubSecret: string;
    hubStatus: HubStatus;
    sensors: Sensor[];
}
export default Hub;