import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useApiJson from "../../hooks/useApiJson";
import ViewListingDetails from "../../components/ListingManagement/ViewListingDetails";
import { ListingType, ListingStatus } from "../../enums/Enumurated";
import Listing from "../../models/Listing";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
            <span className="self-center text-xl font-bold">
              Listing Details
            </span>{" "}
            <br />
            <span className="self-center text-title-xl font-bold">
              {curListing.name}
            </span>
            <hr className="opacity-2 my-2 bg-stroke" />
            {/*<img
                  src={"http://localhost:3000/" + curSpecies.imageUrl}
                  alt="Current species image"
                  className="my-4 aspect-square w-1/5 self-center rounded-full border shadow-4"
                />*/}
            <Accordion type="multiple">
              <AccordionItem value="item-1">
                <AccordionTrigger>Information</AccordionTrigger>
                <AccordionContent>
                  <ViewListingDetails curListing={curListing} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewListingDetailsPage;
