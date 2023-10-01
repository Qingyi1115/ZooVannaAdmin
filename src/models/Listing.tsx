import { ListingType } from "src/enums/Enumurated";
import { ListingStatus } from "src/enums/Enumurated";

interface Listing {
  listingId: number;
  name: string;
  description: string;
  price: number;
  listingType: ListingType;
  listingStatus: ListingStatus;
}

export default Listing;
