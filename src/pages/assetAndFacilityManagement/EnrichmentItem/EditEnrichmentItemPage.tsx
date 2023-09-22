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

  const [ enrichmentItemId, setEnrichmentItemId ] = useState<number>(0);
  const { enrichmentItemName } = useParams<{ enrichmentItemName: string }>();
  const [curEnrichmentItem, setCurEnrichmentItem] = useState<EnrichmentItem>(emptyEnrichmentItem);
  const [refreshSeed, setRefreshSeed] = useState<number>(0);
  
  useEffect(() => {
    const fetchEnrichmentItem = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/assetfacility/getEnrichmentItem/${enrichmentItemId}`
        );
        setCurEnrichmentItem(responseJson as EnrichmentItem);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchEnrichmentItem();
  }, [refreshSeed]);

  useEffect(() => {
    const enrichmentItem = apiJson.result as EnrichmentItem;
    setCurEnrichmentItem(enrichmentItem);
  }, [apiJson.loading]);

  return (
    <div className="p-10">
      {curEnrichmentItem && curEnrichmentItem.enrichmentItemId != -1 && (
        <EditEnrichmentItemForm 
        curEnrichmentItem={curEnrichmentItem} 
        refreshSeed={refreshSeed} 
        setRefreshSeed={setRefreshSeed} />
      )}
    </div>
  );
}

export default EditEnrichmentItemPage;