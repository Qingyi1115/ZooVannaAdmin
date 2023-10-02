import Sensor from "./Sensor";

interface SensorReading {
    readingDate: Date,
    value: number,
    sensor: Sensor
}
export default SensorReading;