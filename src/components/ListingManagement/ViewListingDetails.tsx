import React, { useState, useRef } from "react";
import Listing from "../../models/Listing";
import { Button } from "@/components/ui/button";
import useApiJson from "../../hooks/useApiJson";
import { useToast } from "@/components/ui/use-toast";
import { Toast } from "primereact/toast";
import * as moment from "moment-timezone";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ListingInfoDetailsProps {
  curListing: Listing;
}
function ViewListingDetails(props: ListingInfoDetailsProps) {
  const apiJson = useApiJson();
  const { curListing } = props;
  console.log(props);
  const toastShadcn = useToast().toast;

  function convertUtcToTimezone(utcDate: Date, targetTimezone: string): string {
    const utcMoment = moment.utc(utcDate);
    const targetMoment = utcMoment.tz(targetTimezone);
    const formattedTime: string = targetMoment.format("MM-DD-YYYY HH:mm");
    const timestampWithSuffix: string = `${formattedTime} SGT`;
    return timestampWithSuffix;
  }

  return (
    <div className="mt-4">
      <div className="overflow-hidden rounded-lg border border-strokedark/40 lg:mx-20">
        <Table>
          <TableHeader className=" bg-whiten">
            <TableRow>
              <TableHead className="w-3/3 font-bold" colSpan={3}>
                Listing Information
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="w-1/3 font-bold" colSpan={2}>
                Name
              </TableCell>
              <TableCell>{curListing.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="w-1/3 font-bold" colSpan={2}>
                Description
              </TableCell>
              <TableCell>{curListing.description}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="w-1/3 font-bold" colSpan={2}>
                Price
              </TableCell>
              <TableCell>{curListing.price}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="w-1/3 font-bold" colSpan={2}>
                Listing Type
              </TableCell>
              <TableCell>{curListing.listingType}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="w-1/3 font-bold" colSpan={2}>
                Listing Status
              </TableCell>
              <TableCell>{curListing.listingStatus}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="w-1/3 font-bold" colSpan={2}>
                Created At
              </TableCell>
              <TableCell>
                {convertUtcToTimezone(curListing.createdAt, "Asia/Singapore")}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="w-1/3 font-bold" colSpan={2}>
                Updated At
              </TableCell>
              <TableCell>
                {convertUtcToTimezone(
                  curListing.updateTimestamp,
                  "Asia/Singapore"
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ViewListingDetails;
