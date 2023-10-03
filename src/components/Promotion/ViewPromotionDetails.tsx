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

interface PromotionDetailsProps {
  curPromotion: Promotion;
}

function ViewPrmotionDetails(props: PromotionDetailsProps) {
  const { curPromotion } = props;
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
              Start Date
            </TableCell>
            <TableCell>{curPromotion.startDate.toLocaleString()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              End Date
            </TableCell>
            <TableCell>{curPromotion.endDate.toLocaleString()}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Discount &#40;%&#41;
            </TableCell>
            <TableCell>{curPromotion.percentage * 100}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Minimum Spending &#40;$&#41;
            </TableCell>
            <TableCell>{curPromotion.description}</TableCell>
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

export default ViewPrmotionDetails;
