import { KeeperType, Specialization } from "src/enums/Enumurated";
import Employee from "./Employee";

interface Keeper {
  id: number;
  keeperType: KeeperType;
  specialization: Specialization;
  isDisabled: boolean;
  employee: Employee;
}

export default Keeper;