import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import EditAssetForm from "../../components/AssetAndFacilityManagement/AssetManagement/EditAssetForm";
import useApiJson from "../../hooks/useApiJson";

function EditAssetPage() {
  const apiJson = useApiJson();

  let emptyAsset: Asset = {
    assetId: -1,
    assetCode: "",
    commonName: "",
    scientificName: "",
    aliasName: "",
    conservationStatus: "",
    domain: "",
    kingdom: "",
    phylum: "",
    assetClass: "",
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

  const { assetCode } = useParams<{ assetCode: string }>();
  const [curAsset, setCurAsset] = useState<Asset>(emptyAsset);

  useEffect(() => {
    apiJson.get(`http://localhost:3000/api/asset/getasset/${assetCode}`);
  }, []);

  useEffect(() => {
    const asset = apiJson.result as Asset;
    setCurAsset(asset);
  }, [apiJson.loading]);

  return (
    <div className="p-10">
      {curAsset && curAsset.assetId != -1 && (
        <EditAssetForm curAsset={curAsset} />
      )}
    </div>
  );
}

export default EditAssetPage;
