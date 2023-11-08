import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ViewListingDetails from "../../components/ListingManagement/ViewListingDetails";
import { ListingStatus, ListingType } from "../../enums/Enumurated";
import useApiJson from "../../hooks/useApiJson";
import Listing from "../../models/Listing";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function ViewListingDetailsPage() {
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
  const navigate = useNavigate();

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
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default">
        {curListing && curListing.listingId != -1 && (
          <div className="flex flex-col">
            <div className="flex flex-col">
              <div className="mb-4 flex justify-between">
                <Button
                  variant={"outline"}
                  type="button"
                  onClick={() => navigate(-1)}
                  className=""
                >
                  Back
                </Button>
                <span className="self-center text-lg text-graydark">
                  Listing Details
                </span>
                <Button disabled className="invisible">
                  Back
                </Button>
              </div>
              <Separator />
              <span className="mt-4 self-center text-title-xl font-bold">
                {curListing.name}
              </span>
            </div>

            <ViewListingDetails curListing={curListing} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewListingDetailsPage;
