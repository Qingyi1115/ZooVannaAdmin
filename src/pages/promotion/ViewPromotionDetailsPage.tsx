import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useApiJson from "../../hooks/useApiJson";
import Promotion from "../../models/Promotion";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ViewPromotionDetails from "../../components/Promotion/ViewPromotionDetails";
import { NavLink } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

function ViewPromotionDetailsPage() {
  const apiJson = useApiJson();

  let emptyPromotion: Promotion = {
    promotionId: -1,
    title: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    percentage: 0,
    minimumSpending: 0,
    promotionCode: "",
    imageUrl: "",
    maxRedeemNum: 0,
    currentRedeemNum: 0,
  };

  const { promotionId } = useParams<{ promotionId: string }>();
  const [curPromotion, setCurPromotion] = useState<Promotion>(emptyPromotion);
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/promotion/getPromotion/${promotionId}`
        );
        setCurPromotion(responseJson as Promotion);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchPromotion();
  }, [refreshSeed]);

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
        {curPromotion && curPromotion.promotionId != -1 && (
          <div className="relative flex flex-col">
            <div className="mb-4 flex justify-between">
              <NavLink className="flex" to={`/promotion/viewallpromotions`}>
                <Button variant={"outline"} type="button" className="">
                  Back
                </Button>
              </NavLink>
              <span className="self-center text-lg text-graydark">
                Promotion Details
              </span>
              <Button disabled className="invisible">
                Back
              </Button>
            </div>
            <Separator />
            <span className="mt-4 self-center text-title-xl font-bold">
              {curPromotion.title}
            </span>
            <img
              src={"http://localhost:3000/" + curPromotion.imageUrl}
              alt="Current promotion image"
              className="my-4 w-1/2 self-center rounded-md object-cover shadow-4"
            />

            <ViewPromotionDetails curPromotion={curPromotion} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewPromotionDetailsPage;
