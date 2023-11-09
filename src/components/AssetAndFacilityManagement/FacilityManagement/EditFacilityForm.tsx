import * as Form from "@radix-ui/react-form";
import React, { useState } from "react";


import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useLocation, useNavigate } from "react-router-dom";
import FormFieldSelect from "../../../components/FormFieldSelect";
import useApiFormData from "../../../hooks/useApiFormData";
import useApiJson from "../../../hooks/useApiJson";
import Facility from "../../../models/Facility";
import FormFieldInput from "../../FormFieldInput";

interface EditFacilityFormProps {
  curFacility: Facility;
  refreshSeed: number;
  setRefreshSeed: React.Dispatch<React.SetStateAction<number>>;
}

function EditFacilityForm(props: EditFacilityFormProps) {
  const apiFormData = useApiFormData();
  const location = useLocation();
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();

  const { curFacility, refreshSeed, setRefreshSeed } = props;

  const [facilityName, setFacilityName] = useState<string>(curFacility.facilityName);
  const [xCoordinate, setXCoordinate] = useState<number>(curFacility.xCoordinate);
  const [yCoordinate, setYCoordinate] = useState<number>(curFacility.yCoordinate);
  const [facilityDetail, setFacilityDetail] = useState<string | undefined>(
    curFacility.facilityDetail); // dropdown
  const [maxAccommodationSize, setMaxAccommodationSize] = useState<number>(curFacility.facilityDetailJson.maxAccommodationSize); // number
  const [hasAirCon, setHasAirCon] = useState<string | undefined>(
    curFacility.facilityDetailJson.hasAirCon ? "true" : "false"); // dropdown
  const [ownership, setOwnership] = useState<string>(curFacility.facilityDetail == "thirdParty" ? curFacility.facilityDetailJson.ownership : ""); // text input
  const [ownerContact, setOwnerContact] = useState<string>(curFacility.facilityDetail == "thirdParty" ? curFacility.facilityDetailJson.ownerContact : ""); // string
  const [isPaid, setIsPaid] = useState<string | undefined>(
    curFacility.facilityDetail == "inHouse" ? (curFacility.facilityDetailJson.isPaid ? "true" : "false") : ""); // dropdown
  const [isSheltered, setIsSheltered] = useState<string | undefined>(
    curFacility.isSheltered ? "true" : "false"); // dropdown
  const [facilityType, setFacilityType] = useState<string | undefined>(
    curFacility.facilityDetailJson.facilityType); // dropdown 
  const [imageFile, setImageFile] = useState<File | null>(null);


  const [formError, setFormError] = useState<string | null>(null);
  function validateFacilityName(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter a valid value!
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files && event.target.files[0];
    setImageFile(file);
  }

  // end field validations

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const facilityDetailJson = (facilityDetail == "thirdParty" ?
      {
        ownership: ownership,
        ownerContact: ownerContact,
        maxAccommodationSize: maxAccommodationSize,
        hasAirCon: hasAirCon == "true",
        facilityType: facilityType,
      } :
      {
        isPaid: isPaid == "true",
        maxAccommodationSize: maxAccommodationSize,
        hasAirCon: hasAirCon == "true",
        facilityType: facilityType,
      })
    console.log("facilityDetailJson", facilityDetailJson);

    const updatedFacility = {
      facilityName: facilityName,
      xCoordinate: xCoordinate,
      yCoordinate: yCoordinate,
      facilityDetail: facilityDetail,
      isSheltered: isSheltered == "true",
      facilityDetailJson: facilityDetailJson
    }
    console.log(updatedFacility);

    // try {
    //   const responseJson = await apiJson.put(
    //     `http://localhost:3000/api/assetFacility/updateFacility/${curFacility.facilityId}`,
    //     updatedFacility
    //   );
    //   // success
    //   toastShadcn({
    //     description: "Successfully edited facility",
    //   });
    //   setRefreshSeed(refreshSeed + 1);
    // } catch (error: any) {
    //   toastShadcn({
    //     variant: "destructive",
    //     title: "Uh oh! Something went wrong.",
    //     description:
    //       "An error has occurred while editing facility details: \n" +
    //       error.message,
    //   });
    // }

    // Submit image
    const formData = new FormData();
    formData.append("file", imageFile || "");

    try {
      await apiJson.put(
        `http://localhost:3000/api/assetFacility/updateFacility/${curFacility.facilityId}`,
        updatedFacility
      );

      if (imageFile) {
        await apiFormData.put(
          `http://localhost:3000/api/assetFacility/updateFacilityImage/${curFacility.facilityId}`,
          formData);
      }
      // success
      toastShadcn({
        description: "Successfully edited facility",
      });
      setRefreshSeed(refreshSeed + 1);
      navigate(-1);
    } catch (error: any) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while editing facility details: \n" +
          error.message,
      });
    }
  }



  return (
    <div className="flex flex-col">
      {curFacility && (
        <Form.Root
          className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="flex flex-col">
            <div className="mb-4 flex justify-between">
              <Button variant={"outline"} type="button" onClick={() => navigate(-1)} className="">
                Back
              </Button>
              <span className="self-center text-lg text-graydark">
                Edit Facility
              </span>
              <Button disabled className="invisible">
                Back
              </Button>
            </div>
            <Separator />
            <span className="mt-4 self-center text-title-xl font-bold">
              {curFacility.facilityName}
            </span>
          </div>

          {/* Facility Picture */}
          <Form.Field
            name="facilityImage"
            className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
          >
            <span className="font-medium">Current Image</span>
            <img
              src={
                "http://localhost:3000/" +
                curFacility.imageUrl
              }
              alt="Current facility image"
              className="my-4 aspect-square w-1/5 rounded-full border object-cover shadow-4"
            />
            <Form.Label className="font-medium">
              Change Facility Image
            </Form.Label>
            <Form.Control
              type="file"
              placeholder="Change image"
              required={false}
              accept=".png, .jpg, .jpeg, .webp"
              onChange={handleFileChange}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
            />
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
            {/* X Coordinate */}
            {/* <FormFieldInput
              type="number"
              formFieldName="xCoordinate"
              label="X Coordinate"
              required={true}
              placeholder="1-1000"
              value={xCoordinate}
              setValue={setXCoordinate}
              validateFunction={validateFacilityName} pattern={undefined} /> */}
            {/* Y Coordinate */}
            {/* <FormFieldInput
              type="number"
              formFieldName="yCoordinate"
              label="Y Coordinate"
              required={true}
              placeholder="1-1000"
              value={yCoordinate}
              setValue={setYCoordinate}
              validateFunction={validateFacilityName} pattern={undefined} /> */}
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
          <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12"> {/* Facility Details */}
            {/* <FormFieldSelect
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
            /> */}

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
      )}
    </div>
  );
}

export default EditFacilityForm;
