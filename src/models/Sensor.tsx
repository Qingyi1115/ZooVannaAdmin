import { SensorType } from "src/enums/SensorType";
import Hub from "./Hub";

interface Sensor {
    sensorId: number;
    sensorName: string;
    dateOfActivation: Date | null;
    dateOfLastMaintained: Date | null;
    sensorType: SensorType,
    hub: Hub
}
export default Sensor;