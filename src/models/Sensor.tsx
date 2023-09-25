import { SensorType } from "src/enums/SensorType";
import Hub from "./Hub";
import SensorReading from "./SensorReading";
import Employee from "./Employee";
import MaintenanceLog from "./MaintenanceLog";

interface Sensor {
    sensorId: number;
    sensorName: string;
    dateOfActivation: Date | null;
    dateOfLastMaintained: Date | null;
    sensorType: SensorType,
    hub: Hub
    sensorReading: SensorReading[]
    maintenanceLogs: MaintenanceLog[],
    generalStaff: Employee[]
}
export default Sensor;