import React, { useState, useRef, useEffect } from "react";
import CustomerOrder from "../../models/CustomerOrder";
import { Button } from "@/components/ui/button";
import useApiJson from "../../hooks/useApiJson";
import { useToast } from "@/components/ui/use-toast";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { HiCheck, HiEye, HiPencil, HiTrash, HiX } from "react-icons/hi";
import FormFieldSelect from "../FormFieldSelect";
import * as Form from "@radix-ui/react-form";
import * as moment from "moment-timezone";
import OrderItem from "../../models/OrderItem";
import Listing from "../../models/Listing";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ListingInfo {
  listingName: string;
  description: string;
  numberOfOrderItems: number;
}

interface CustomerOrderInfoDetailsProps {
  curCustomerOrder: CustomerOrder;
}

function ViewCustomerOrderDetails(props: CustomerOrderInfoDetailsProps) {
  const { curCustomerOrder } = props;
  const apiJson = useApiJson();

  const toastShadcn = useToast().toast;

  // State to store the grouped order items
  const [groupedOrderItems, setGroupedOrderItems] = useState<{
    [key: number]: ListingInfo;
  }>({});

  const groupOrderItems = async () => {
    // Mark the function as async
    try {
      const groupedItems: { [key: number]: ListingInfo } = {};

      for (const item of curCustomerOrder.orderItems) {
        // Use a for...of loop for asynchronous operations
        const { listingId } = item; // Replace "listingName" with the actual property name for the listing name.

        if (!groupedItems[listingId]) {
          const responseJson = await apiJson.get(
            `http://localhost:3000/api/listing/getListing/${listingId}`
          );
          console.log(responseJson);

          let listing: Listing = responseJson.result as Listing;
          console.log(listing);
          const listingName = `${listing.listingType} - ${listing.name}`;
          console.log(listingName);
          const description = `${listing.description}`;
          console.log(description);

          groupedItems[listingId] = {
            listingName, //
            description,
            numberOfOrderItems: 1,
          };
        } else {
          groupedItems[listingId].numberOfOrderItems++;
        }
      }

      setGroupedOrderItems(groupedItems);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    groupOrderItems(); // Call the grouping function when the component mounts
  }, []); //

  function convertUtcToTimezone(utcDate: Date, targetTimezone: string): string {
    const utcMoment = moment.utc(utcDate);
    const targetMoment = utcMoment.tz(targetTimezone);
    const formattedTime: string = targetMoment.format("DD MMM YYYY");
    return formattedTime;
  }

  return (
    <div>
      <div className="overflow-hidden rounded-lg border border-strokedark/40 lg:mx-20">
        <Table>
          <TableHeader className=" bg-whiten">
            <TableRow>
              <TableHead className="w-3/3 font-bold" colSpan={3}>
                Order Details
              </TableHead>
              <TableHead className="w-1/3 font-bold" colSpan={2}></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="w-1/3 font-bold" colSpan={2}>
                ID
              </TableCell>
              <TableCell>{curCustomerOrder.customerOrderId}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="w-1/3 font-bold" colSpan={2}>
                Booking Reference
              </TableCell>
              <TableCell className="w-2/3">
                {curCustomerOrder.bookingReference}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="w-1/3 font-bold" colSpan={2}>
                Total Amount &#40;S$&#41;
              </TableCell>
              <TableCell>{curCustomerOrder.totalAmount}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="w-1/3 font-bold" colSpan={2}>
                Purchase Date
              </TableCell>
              <TableCell>
                {convertUtcToTimezone(
                  curCustomerOrder.createdAt,
                  "Asia/Singapore"
                )}
              </TableCell>
            </TableRow>
            {/* <TableRow>
              <TableCell className="w-1/3 font-bold" colSpan={2}>
                Order Status
              </TableCell>
              <TableCell>{curCustomerOrder.orderStatus}</TableCell>
            </TableRow> */}
            <TableRow>
              <TableCell className="w-1/3 font-bold" colSpan={2}>
                Payment Status
              </TableCell>
              <TableCell>{curCustomerOrder.paymentStatus}</TableCell>
            </TableRow>

            {/* <TableRow>
              <TableCell className="w-1/3 font-bold" colSpan={2}>
                Entry Date
              </TableCell>
              <TableCell>
                {convertUtcToTimezone(
                  curCustomerOrder.entryDate,
                  "Asia/Singapore"
                )}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                className="w-1/4 font-bold"
                rowSpan={groupOrderItems.length}
                colSpan={1}
              >
                Tickets Purchased
              </TableCell>
            </TableRow>

            {Object.keys(groupedOrderItems).map((listingId) => {
              const listingInfo = groupedOrderItems[Number(listingId)];
              return (
                <React.Fragment key={listingId}>
                  <TableRow>
                    <TableCell className="w-1/4">
                      {listingInfo.listingName}
                    </TableCell>
                    <TableCell className="w-1/2" rowSpan={1}>
                      {listingInfo.description}
                    </TableCell>
                    <TableCell className="w-1/4" rowSpan={1}>
                      {listingInfo.numberOfOrderItems}
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })} */}
          </TableBody>
        </Table>
      </div>
      {/* <Dialog
        visible={disableRoleDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={disableRoleDialogFooter}
        onHide={hideDisableRoleDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {curCustomerOrder && (
            <span>
              Are you sure you want to disable{" "}
              <b>{curCustomerOrder.customerOrderName}</b>?
            </span>
          )}
        </div>
      </Dialog> */}
    </div>
  );
}

export default ViewCustomerOrderDetails;
