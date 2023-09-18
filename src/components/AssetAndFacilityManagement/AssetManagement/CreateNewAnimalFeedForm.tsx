import React, { useState } from "react";

import * as Form from "@radix-ui/react-form";
import FormFieldRadioGroup from "../../FormFieldRadioGroup";
import FormFieldInput from "../../FormFieldInput";
import FormFieldSelect from "../../FormFieldSelect";
import useApiJson from "../../../hooks/useApiJson";

function validateCommonName(props: ValidityState) {
  if (props != undefined) {
    if (props.valueMissing) {
      return (
        <div className="font-medium text-danger">* Please enter a ahahha</div>
      );
    }
    // add any other cases here
  }
  return null;
}

function CreateNewAssetForm() {
  const apiJson = useApiJson();

  // assetName
  // assetType
  // assetType2
  // AssetDetail
  const [assetName, setAssetName] = useState<string>(""); // text input
  const [assetType, setAssetType] = useState<string | undefined>(
    undefined
  ); // radio group
  const [assetType2, setAssetType2] = useState<string | undefined>(
    undefined
  ); // drop down select
  const [assetDetail, setAssetDetail] = useState<string>(""); // text

  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Remember, your form must have enctype="multipart/form-data" for upload pictures
    e.preventDefault();

    const newAsset = {
      assetName,
      assetType,
      assetType2,
      assetDetail,
    };

    await apiJson.post("", newAsset);

    // handle success case or failurecase using apiJson
  }

  return (
    <Form.Root
      className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
      onSubmit={handleSubmit}
    >
      <span className="self-center text-title-xl font-bold">
        Create a New Asset
      </span>
      <hr className="bg-stroke opacity-20" />
      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
        {/* Common Name */}
        <FormFieldInput
          type="text"
          formFieldName="assetName"
          label="Asset Name"
          required={true}
          placeholder="e.g., Toilet"
          value={assetName}
          setValue={setAssetName}
          validateFunction={validateCommonName}
        />
        {/* Scientific Name */}
        <FormFieldInput
          type="text"
          formFieldName="assetDetail"
          label="Scientific Name (Binomial/Trinomial Name)"
          required={true}
          placeholder="e.g., Homo sapiens, Panthera leo leo..."
          value={assetDetail}
          setValue={setAssetDetail}
          validateFunction={validateCommonName}
        />
      </div>

      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
        {/* Conservation Status */}
        <FormFieldRadioGroup
          formFieldName="assetType"
          label="Asset Type"
          required={true}
          valueIdPair={[
            ["Haha", "ft1"],
            ["Hoho", "ft2"],
            ["HEHE", "ft3"],
            ["Near Threatened", "ft4"],
            ["Near Threatened", "ft4"],
            ["Near Threatened", "ft4"],
            ["Near Threatened", "ft4"],
            ["Near Threatened", "ft4"],
            ["Near Threatened", "ft4"],
          ]}
          value={assetType}
          setValue={setAssetType}
          validateFunction={validateCommonName}
        />
      </div>

      {/* Domain */}
      <FormFieldSelect
        formFieldName="domain"
        label="Asset Domain"
        required={true}
        placeholder="Select a domain..."
        valueLabelPair={[
          ["Archaea", "sadtguhjansd"],
          ["Bacteria", "Bacteria"],
          ["Eukarya", "Eukarya"],
        ]}
        value={assetType2}
        setValue={setAssetType2}
        validateFunction={validateCommonName}
      />

      <Form.Submit asChild>
        <button className="mt-10 h-12 w-2/3 self-center rounded-full border bg-primary text-lg text-whiten transition-all hover:bg-opacity-80">
          Create Asset
        </button>
      </Form.Submit>
      {formError && (
        <div className="m-2 border-danger bg-red-100 p-2">{formError}</div>
      )}
    </Form.Root>
  );
}

export default CreateNewAssetForm;
