import HubProcessor from "./Hub";

interface Facility {
  facilityId: number;
  facilityName: string;
  xCoordinate: number;
  yCoordinate: number;
  isSheltered: Boolean;
  facilityDetail: string;
  facilityDetailJson: any;
  hubProcessors: HubProcessor[];
}

export default Facility;
