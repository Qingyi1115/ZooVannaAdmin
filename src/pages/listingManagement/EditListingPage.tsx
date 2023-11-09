import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Listing from "src/models/Listing";
import EditListingForm from "../../components/ListingManagement/EditListingForm";
import { ListingStatus, ListingType } from "../../enums/Enumurated";
import useApiJson from "../../hooks/useApiJson";

function EditListingPage() {
  const apiJson = useApiJson();

  let emptyListing: Listing = {
    listingId: -1,
    name: "",
    description: "",
    price: 0,
    listingType: ListingType.LOCAL_ADULT_ONETIME,
    listingStatus: ListingStatus.DISCONTINUED,
    createdAt: new Date(),
    updateTimestamp: new Date(),
  };

  const { listingId } = useParams<{ listingId: string }>();
  const [curListing, setCurListing] = useState<Listing>(emptyListing);
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/listing/getlisting/${listingId}`
        );
        setCurListing(responseJson.result as Listing);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchListing();
  }, [refreshSeed]);

  return (
    <div className="p-10">
      {curListing && curListing.listingId != -1 && (
        <EditListingForm
          currListing={curListing}
          refreshSeed={refreshSeed}
          setRefreshSeed={setRefreshSeed}
        />
      )}
    </div>
  );
}

export default EditListingPage;
