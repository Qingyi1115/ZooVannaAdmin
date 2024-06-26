import { ListingStatus, ListingType } from "src/enums/Enumurated";

interface Listing {
  listingId: number;
  name: string;
  description: string;
  price: number;
  listingType: ListingType;
  listingStatus: ListingStatus;
  createdAt: Date;
  updateTimestamp: Date;
}

export default Listing;
