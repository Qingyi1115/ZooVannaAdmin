import React, { useState } from "react";

import * as Form from "@radix-ui/react-form";
import FormFieldRadioGroup from "../../FormFieldRadioGroup";
import FormFieldInput from "../../FormFieldInput";
import FormFieldSelect from "../../FormFieldSelect";
import useApiJson from "../../../hooks/useApiJson";
import useApiFormData from "../../../hooks/useApiFormData";
import { useToast } from "@/components/ui/use-toast";

function validateFacilityName(props: ValidityState) {
  if (props != undefined) {
    if (props.valueMissing) {
      return (
        <div className="font-medium text-danger">* Please enter a value</div>
      );
    }
    // add any other cases here
  }
  return null;
}

function CreateNewFacilityForm() {
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;

  const [ownership, setOwnership] = useState<string>(""); // text input
  const [ownerContact, setOwnerContact] = useState<string>(""); // string
  const [maxAccommodationSize, setMaxAccommodationSize] = useState<number>(); // number
  const [hasAirCon, setHasAirCon] = useState<string | undefined>(
    undefined); // dropdown
  const [facilityType, setFacilityType] = useState<string | undefined>(
    undefined); // dropdown
  const [formError, setFormError] = useState<string | null>(null);


  async function handleSubmit(e: any) {
    // Remember, your form must have enctype="multipart/form-data" for upload pictures
    e.preventDefault();

    const newFacility = {
      ownership: ownership,
      ownerContact: ownerContact,
      maxAccomodationSize: maxAccommodationSize,
      hasAirCon: hasAirCon
    }
    console.log(newFacility);
    try {
      const responseJson = await apiJson.post(
        "http://localhost:3000/api/assetFacility/createFacility",
        newFacility);
      // success
      toastShadcn({
        description: "Successfully created facility",
      });
    } catch (error: any) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while creating facility details: \n" +
          error.message,
      });
    }
    // console.log(apiFormData.result);

    // handle success case or failurecase using apiJson
  }

  return (
    <Form.Root
      className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <span className="self-center text-title-xl font-bold">
        Create new Facility
      </span>
      <hr className="bg-stroke opacity-20" />
      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
        {/* Ownership */}
        <FormFieldInput
          type="text"
          formFieldName="ownership"
          label="Ownership"
          required={true}
          placeholder=""
          value={ownership}
          setValue={setOwnership}
          validateFunction={validateFacilityName} pattern={undefined}
        />
        {/* Owner Contact */}
        <FormFieldInput
          type="text"
          formFieldName="ownerContact"
          label="Owner Contact"
          required={true}
          placeholder=""
          value={ownership}
          setValue={setOwnerContact}
          validateFunction={validateFacilityName} pattern={undefined}
        />
        {/* Maximum Accomodation Size */}
        <FormFieldInput
          type="number"
          formFieldName="maxAccommodationSize"
          label="Y Coordinate"
          required={true}
          placeholder="1-1000"
          value={maxAccommodationSize}
          setValue={setMaxAccommodationSize}
          validateFunction={validateFacilityName}
          pattern={undefined}
        />
        {/* Has air-con */}
        <FormFieldSelect
          formFieldName="hasAirCon"
          label="Has air-con?"
          required={true}
          placeholder=""
          valueLabelPair={[
            ["true", "Yes"],
            ["false", "No"]
          ]}
          value={hasAirCon}
          setValue={setHasAirCon}
          validateFunction={validateFacilityName}
        />
      </div>
      {/* Facility Type */}
      <FormFieldSelect
        formFieldName="facilityType"
        label="Facility Type"
        required={true}
        placeholder=""
        valueLabelPair={[
          ["INFORMATION_CENTRE", "Information Centre"],
          ["ZOO_DIRECTORY", "Zoo Directory"],
          ["AMPHITHEATRE", "Amphitheatre"],
          ["GAZEBO", "Gazebo"],
          ["AED", "AED"],
          ["RESTROOM", "Restroom"],
          ["NURSERY", "Nursery"],
          ["FIRST_AID", "First Aid"],
          ["BENCHES", "Benches"],
          ["PLAYGROUND", "Playground"],
          ["TRAMSTOP", "Tram Stop"],
          ["PARKING", "Parking"],
          ["RESTAURANT", "Restaurant"],
          ["SHOP_SOUVENIR", "Shop/Souvenir"],
        ]}
        value={facilityType}
        setValue={setFacilityType}
        validateFunction={validateFacilityName}
      />
      <Form.Submit asChild>
        <button className="mt-10 h-12 w-2/3 self-center rounded-full border bg-primary text-lg text-whiten transition-all hover:bg-opacity-80">
          Add Facility
        </button>
      </Form.Submit>
      {formError && (
        <div className="m-2 border-danger bg-red-100 p-2">{formError}</div>
      )}
    </Form.Root>
  );
}

export default CreateNewFacilityForm;
