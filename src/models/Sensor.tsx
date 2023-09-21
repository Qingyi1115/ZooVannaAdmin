import { SensorType } from "src/enums/SensorType";

interface Sensor {
sensorId: number,
dateOfActivation: Date,
sensorName: string,
dateOfLastMaintained: Date,
sensorType: SensorType
}
export default Sensor;