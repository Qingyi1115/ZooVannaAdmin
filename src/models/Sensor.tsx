import { SensorType } from "src/enums/SensorType";
import GeneralStaff from "./GeneralStaff";
import HubProcessor from "./HubProcessor";
import MaintenanceLog from "./MaintenanceLog";
import SensorReading from "./SensorReading";

interface Sensor {
    sensorId: number;
    sensorName: string;
    dateOfActivation: Date | null;
    dateOfLastMaintained: Date | null;
    sensorType: SensorType,
    hubProcessor: HubProcessor
    sensorReadings: SensorReading[]
    maintenanceLogs: MaintenanceLog[],
    generalStaff: GeneralStaff
}
export default Sensor;