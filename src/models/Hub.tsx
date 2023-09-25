import { HubStatus } from "src/enums/HubStatus";

interface Hub {
    facilityId: number;
    hubProcessorId: number;
    processorName: string;
    ipAddressName: string;
    lastDataUpdate: Date | null;
    hubSecret: string;
    hubStatus: HubStatus
}
export default Hub;