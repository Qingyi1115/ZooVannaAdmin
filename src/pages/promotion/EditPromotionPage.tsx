import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import useApiJson from "../../hooks/useApiJson";
import Promotion from "../../models/Promotion";
import EditPromotionForm from "../../components/Promotion/EditPromotionForm";

function EditSpeciesPage() {
  const apiJson = useApiJson();

  let emptyPromotion: Promotion = {
    promotionId: -1,
    title: "",
    description: "",
    publishDate: new Date(),
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
      {curPromotion && curPromotion.promotionId != -1 && (
        <EditPromotionForm
          curPromotion={curPromotion}
          refreshSeed={refreshSeed}
          setRefreshSeed={setRefreshSeed}
        />
      )}
    </div>
  );
}

export default EditSpeciesPage;
