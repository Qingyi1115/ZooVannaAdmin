import HubProcessor from "./HubProcessor";
import InHouse from "./InHouse";

interface Facility {
  facilityId: number;
  facilityName: string;
  xCoordinate: number;
  yCoordinate: number;
  isSheltered: Boolean;
  showOnMap: boolean;
  imageUrl: string;
  facilityDetail: string;
  facilityDetailJson: any;
  hubProcessors: HubProcessor[];
  inHouse: InHouse;
}

export default Facility;
