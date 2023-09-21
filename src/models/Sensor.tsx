import { SensorType } from "src/enums/SensorType";

interface Sensor {
sensorId: number;
sensorName: string;
dateOfActivation: Date | null;
dateOfLastMaintained: Date | null;
sensorType: SensorType
}
export default Sensor;