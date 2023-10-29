import { SensorType } from "src/enums/SensorType";
import HubProcessor from "./HubProcessor";
import SensorReading from "./SensorReading";
import Employee from "./Employee";
import MaintenanceLog from "./MaintenanceLog";
import GeneralStaff from "./GeneralStaff";

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