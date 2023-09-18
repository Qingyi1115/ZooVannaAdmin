import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import EditEnrichmentItemForm from "../../components/AssetAndFacilityManagement/AssetManagement/EditEnrichmentItemForm";
import useApiJson from "../../hooks/useApiJson";
import EnrichmentItem from "src/models/EnrichmentItem";

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
    apiJson.get(`http://localhost:3000/api/enrichmentItem/getenrichmentItem/${enrichmentItemName}`);
  }, []);

  useEffect(() => {
    const enrichmentItem = apiJson.result as EnrichmentItem;
    setCurEnrichmentItem(enrichmentItem);
  }, [apiJson.loading]);

  return (
    <div className="p-10">
      {curEnrichmentItem && curEnrichmentItem.enrichmentItemId != -1 && (
        <EditEnrichmentItemForm curEnrichmentItem={curEnrichmentItem} />
      )}
    </div>
  );
}

export default EditEnrichmentItemPage;