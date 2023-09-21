import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import EditEnrichmentItemForm from "../../../components/AssetAndFacilityManagement/AssetManagement/EnrichmentItem/EditEnrichmentItemForm";
import useApiJson from "../../../hooks/useApiJson";
import EnrichmentItem from "../../../models/EnrichmentItem";

function EditEnrichmentItemPage() {
  const apiJson = useApiJson();

  let emptyEnrichmentItem: EnrichmentItem = {
    enrichmentItemId: -1,
    enrichmentItemName: "",
    enrichmentItemImageUrl: ""
  };

  const { enrichmentItemName } = useParams<{ enrichmentItemName: string }>();
  const [curEnrichmentItem, setCurEnrichmentItem] = useState<EnrichmentItem>(emptyEnrichmentItem);

  useEffect(() => {
    apiJson.get(`http://localhost:3000/api/assetfacility/getEnrichmentItem/${enrichmentItemName}`);
  }, []);

  useEffect(() => {
    const enrichmentItem = apiJson.result as EnrichmentItem;
    setCurEnrichmentItem(enrichmentItem);
  }, [apiJson.loading]);

  return (
    <div className="p-10">
      {curEnrichmentItem && curEnrichmentItem.enrichmentItemId != -1 && (
        <EditEnrichmentItemForm curEnrichmentItem={curEnrichmentItem} refreshSeed={0} setRefreshSeed={function (value: React.SetStateAction<number>): void {
          throw new Error("Function not implemented.");
        } } />
      )}
    </div>
  );
}

export default EditEnrichmentItemPage;