import React, { useState } from "react";

import * as Form from "@radix-ui/react-form";
import FormFieldRadioGroup from "../../FormFieldRadioGroup";
import FormFieldInput from "../../FormFieldInput";
import FormFieldSelect from "../../FormFieldSelect";
import useApiJson from "../../../hooks/useApiJson";
import useApiFormData from "../../../hooks/useApiFormData";
import { useToast } from "@/components/ui/use-toast";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Field validations
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

function validateImage(props: ValidityState) {
  if (props != undefined) {
    if (props.valueMissing) {
      return (
        <div className="font-medium text-danger">
          * Please upload an image
        </div>
      );
    }
    // add any other cases here
  }
  return null;
}

// end field validations

function CreateNewFacilityForm() {
  const apiFormData = useApiFormData();
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();
  const [facilityName, setFacilityName] = useState<string>(""); // text input
  const [facilityDetail, setFacilityDetail] = useState<string | undefined>(
    undefined); // dropdown
  const [maxAccommodationSize, setMaxAccommodationSize] = useState<number>(); // number
  const [hasAirCon, setHasAirCon] = useState<string | undefined>(
    undefined); // dropdown
  const [ownership, setOwnership] = useState<string>(""); // text input
  const [ownerContact, setOwnerContact] = useState<string>(""); // string
  const [isPaid, setIsPaid] = useState<string | undefined>(
    undefined); // dropdown
  const [isSheltered, setIsSheltered] = useState<string | undefined>(
    undefined); // dropdown
  const [facilityType, setFacilityType] = useState<string | undefined>(
    undefined); // dropdown
  const [formError, setFormError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files && event.target.files[0];
    setImageFile(file);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Remember, your form must have enctype="multipart/form-data" for upload pictures
    e.preventDefault();

    const facilityDetailJson = (facilityDetail == "thirdParty" ?
      {
        ownership: ownership,
        ownerContact: ownerContact,
        maxAccommodationSize: maxAccommodationSize,
        hasAirCon: Boolean(hasAirCon),
        facilityType: facilityType
      } :
      {
        isPaid: Boolean(isPaid),
        maxAccommodationSize: maxAccommodationSize,
        hasAirCon: Boolean(hasAirCon),
        facilityType: facilityType
      })
    // const newFacility = {
    //   facilityName: facilityName,
    //   isSheltered: Boolean(isSheltered),
    //   facilityDetail: facilityDetail,
    //   facilityDetailJson: facilityDetailJson
    // }
    // console.log(newFacility);

    // try {
    //   const responseJson = await apiJson.post(
    //     "http://localhost:3000/api/assetFacility/createFacility",
    //     newFacility);
    //   // success
    //   toastShadcn({
    //     description: "Successfully created facility",
    //   });
    //   navigate(-1);
    // } catch (error: any) {
    //   toastShadcn({
    //     variant: "destructive",
    //     title: "Uh oh! Something went wrong.",
    //     description:
    //       "An error has occurred while creating facility details: \n" +
    //       error.message,
    //   });
    // }
    // console.log(apiJson.result);
    // handle success case or failurecase using apiJson

    // Submit image
    const formData = new FormData();
    formData.append("facilityName", facilityName);
    formData.append("isSheltered", isSheltered || "");
    formData.append("facilityDetail", facilityDetail || "");
    formData.append("facilityDetailJson", JSON.stringify(facilityDetailJson));
    formData.append("file", imageFile || "");

    try {
      const responseJson = await apiFormData.post(
        "http://localhost:3000/api/assetFacility/createFacility",
        formData);
      // success
      toastShadcn({
        description: "Successfully created facility",
      });
      navigate(-1);
    } catch (error: any) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while creating facility details: \n" +
          error.message,
      });
    }

  }

  return (
    <Form.Root
      className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      {/* Title Header and back button */}
      <div className="flex flex-col">
        <div className="mb-4 flex justify-between">
          <NavLink
            to="/assetfacility/viewallfacilities">
            <Button variant={"outline"} type="button" className="">
              Back
            </Button>
          </NavLink>
          <span className="self-center text-title-xl font-bold">
            Create Facility
          </span>
          <Button disabled className="invisible">
            Back
          </Button>
        </div>
        <Separator />
      </div>

      <Form.Field
        name="facilityImage"
        className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
      >
        <Form.Label className="font-medium">Facility Image</Form.Label>
        <Form.Control
          type="file"
          required
          accept=".png, .jpg, .jpeg, .webp"
          onChange={handleFileChange}
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
        />
        <Form.ValidityState>{validateImage}</Form.ValidityState>
      </Form.Field>

      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
        {/* Facility Name */}
        <FormFieldInput
          type="text"
          formFieldName="facilityName"
          label="Facility Name"
          required={true}
          placeholder=""
          value={facilityName}
          setValue={setFacilityName}
          validateFunction={validateFacilityName} pattern={undefined}
        />
      </div>
      {/* Maximum Accomodation Size */}
      <FormFieldInput
        type="number"
        formFieldName="maxAccommodationSize"
        label="Maximum Accomodation Size"
        required={true}
        placeholder="1-1000"
        value={maxAccommodationSize}
        setValue={setMaxAccommodationSize}
        validateFunction={validateFacilityName}
        pattern={undefined}
      />
      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
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
        {/* Is Sheltered */}
        <FormFieldSelect
          formFieldName="hasAirCon"
          label="Is sheltered?"
          required={true}
          placeholder=""
          valueLabelPair={[
            ["true", "Yes"],
            ["false", "No"]
          ]}
          value={isSheltered}
          setValue={setIsSheltered}
          validateFunction={validateFacilityName}
        />
      </div>
      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
        {/* Facility Details */}
        <FormFieldSelect
          formFieldName="facilityDetail"
          label="Facility Owner Type"
          required={true}
          placeholder="Select an facility owner type..."
          valueLabelPair={[
            ["inHouse", "In-house"],
            ["thirdParty", "Third-party"]
          ]}
          value={facilityDetail}
          setValue={setFacilityDetail}
          validateFunction={validateFacilityName}
        />

        {/* Facility Type */}
        <FormFieldSelect
          formFieldName="facilityType"
          label="Facility Type"
          required={true}
          placeholder="Select a facility type..."
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
      </div>
      {facilityDetail == "thirdParty" &&
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
            validateFunction={validateFacilityName}
            pattern={undefined}

          />
          {/* Owner Contact */}
          <FormFieldInput
            type="text"
            formFieldName="ownerContact"
            label="Owner Contact"
            required={true}
            placeholder=""
            value={ownerContact}
            setValue={setOwnerContact}
            validateFunction={validateFacilityName} pattern={undefined}
          />

        </div>
      }
      {facilityDetail == "inHouse" &&
        <FormFieldSelect
          formFieldName="isPaid"
          label="Is paid?"
          required={true}
          placeholder=""
          valueLabelPair={[
            ["true", "Yes"],
            ["false", "No"]
          ]}
          value={isPaid}
          setValue={setIsPaid}
          validateFunction={validateFacilityName}
        />
      }
      <Form.Submit asChild>
        <Button
          disabled={apiJson.loading}
          className="h-12 w-2/3 self-center rounded-full text-lg"
        >
          {!apiJson.loading ? (
            <div>Submit</div>
          ) : (
            <div>Loading</div>
          )}
        </Button>
      </Form.Submit>
      {formError && (
        <div className="m-2 border-danger bg-red-100 p-2">{formError}</div>
      )}
    </Form.Root>
  );
}

export default CreateNewFacilityForm;
