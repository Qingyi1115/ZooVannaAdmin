import Enclosure from "./Enclosure";
import HubProcessor from "./HubProcessor";
import InHouse from "./InHouse";
import ThirdParty from "./ThirdParty";

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
  inHouse?: InHouse;
  thirdParty?: ThirdParty;
  enclosure?: Enclosure
}

export default Facility;
