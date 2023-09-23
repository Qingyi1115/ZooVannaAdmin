import { HubStatus } from "src/enums/HubStatus";

interface Hub {
    hubProcessorId: number;
    processorName: string;
    ipAddressName: string;
    lastDataUpdate: Date | null;
    hubSecret: string;
    hubStatus: HubStatus
}
export default Hub;