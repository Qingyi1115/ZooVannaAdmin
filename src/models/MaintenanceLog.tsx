import Sensor from "./Sensor";

interface MaintenanceLog {
  logId: number;
  dateTime: Date;
  title: string;
  details: string;
  remark: string;
  sensor: Sensor;
}

export default MaintenanceLog;
