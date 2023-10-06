import React from "react";
import Promotion from "../../models/Promotion";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import * as moment from "moment-timezone";

interface PromotionDetailsProps {
  curPromotion: Promotion;
}

function ViewPromotionDetails(props: PromotionDetailsProps) {
  const { curPromotion } = props;

  function convertUtcToTimezone(utcDate: Date, targetTimezone: string): string {
    const utcMoment = moment.utc(utcDate);
    const targetMoment = utcMoment.tz(targetTimezone);
    const formattedTime: string = targetMoment.format("MM-DD-YYYY HH:mm");
    const timestampWithSuffix: string = `${formattedTime} SGT`;
    return timestampWithSuffix;
  }

  return (
    <div className="">
      <div className="my-4 flex justify-start gap-6">
        <NavLink to={`/promotion/editpromotion/${curPromotion.promotionId}`}>
          <Button>Edit Promotion Details</Button>
        </NavLink>
      </div>
      <Table>
        {/* <TableHeader className=" bg-whiten">
          <TableRow>
            <TableHead className="w-1/3 font-bold" colSpan={2}>
              Attribute
            </TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader> */}
        <TableBody>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              ID
            </TableCell>
            <TableCell>{curPromotion.promotionId}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Title
            </TableCell>
            <TableCell>{curPromotion.title}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Description
            </TableCell>
            <TableCell>{curPromotion.description}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Publish Date
            </TableCell>
            <TableCell>
              {convertUtcToTimezone(curPromotion.publishDate, "Asia/Singapore")}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Start Date
            </TableCell>
            <TableCell>
              {convertUtcToTimezone(curPromotion.startDate, "Asia/Singapore")}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              End Date
            </TableCell>
            <TableCell>
              {convertUtcToTimezone(curPromotion.endDate, "Asia/Singapore")}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Discount &#40;%&#41;
            </TableCell>
            <TableCell>{curPromotion.percentage}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Minimum Spending &#40;$&#41;
            </TableCell>
            <TableCell>{curPromotion.minimumSpending}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Maximum Redemption Number
            </TableCell>
            <TableCell>{curPromotion.maxRedeemNum}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Current Redemption Number
            </TableCell>
            <TableCell>{curPromotion.currentRedeemNum}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Promotion Code
            </TableCell>
            <TableCell>{curPromotion.promotionCode}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default ViewPromotionDetails;
