import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import EditEnrichmentItemForm from "../../components/AssetAndFacilityManagement/AssetManagement/EditEnrichmentItemForm";
import useApiJson from "../../hooks/useApiJson";

function EditEnrichmentItemPage() {
  const apiJson = useApiJson();

  let emptyEnrichmentItem: EnrichmentItem = {
    enrichmentItemId: -1,
    enrichmentItemCode: "",
    commonName: "",
    scientificName: "",
    aliasName: "",
    conservationStatus: "",
    domain: "",
    kingdom: "",
    phylum: "",
    enrichmentItemClass: "",
    order: "",
    family: "",
    genus: "",
    nativeContinent: "",
    nativeBiomes: "",
    educationalDescription: "",
    groupSexualDynamic: "",
    habitatOrExhibit: "habitat",
    imageUrl: "",
    generalDietPreference: "",
  };

  const { enrichmentItemCode } = useParams<{ enrichmentItemCode: string }>();
  const [curEnrichmentItem, setCurEnrichmentItem] = useState<EnrichmentItem>(emptyEnrichmentItem);

  useEffect(() => {
    apiJson.get(`http://localhost:3000/api/enrichmentItem/getenrichmentItem/${enrichmentItemCode}`);
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
