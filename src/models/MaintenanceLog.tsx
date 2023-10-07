import Sensor from "./Sensor";

interface MaintenanceLog {
  maintenanceLogId: number;
  dateTime: Date;
  title: string;
  details: string;
  remarks: string;
  sensor: Sensor;
  staffName: string;
}

export default MaintenanceLog;
