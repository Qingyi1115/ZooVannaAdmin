import { KeeperType, Specialization } from "src/enums/Enumurated";

interface Keeper {
    id: number;
    keeperType: KeeperType;
    specialization: Specialization;
    isDisabled: boolean;
    employeeId: number;
  }
  
  export default Keeper;