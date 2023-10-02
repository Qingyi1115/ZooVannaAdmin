import React, { useEffect, useState } from "react";
import * as Form from "@radix-ui/react-form";

import { MultiSelectChangeEvent } from "primereact/multiselect";

import FormFieldInput from "../FormFieldInput";
import useApiJson from "../../hooks/useApiJson";
import { useToast } from "@/components/ui/use-toast";
import FormFieldSelect from "../FormFieldSelect";
import Listing from "../../models/Listing";
import { ListingStatus, ListingType } from "src/enums/Enumurated";

interface EditListingFormProps {
  currListing: Listing;
  refreshSeed: number;
  setRefreshSeed: React.Dispatch<React.SetStateAction<number>>;
}

function EditListingForm(props: EditListingFormProps) {
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;

  const { currListing, refreshSeed, setRefreshSeed } = props;

  const [name, setName] = useState<string>(currListing.name);
  const [description, setDescription] = useState<string>(
    currListing.description
  );
  const [price, setPrice] = useState<number>(currListing.price);
  const [listingType, setListingType] = useState<string | undefined>(
    currListing.listingType
  );
  const [listingStatus, setListingStatus] = useState<string | undefined>(
    currListing.listingStatus
  );

  const [formError, setFormError] = useState<string | null>(null);

  // field validations
  // function validateImage(props: ValidityState) {
  //   if (props != undefined) {
  //     if (props.valueMissing) {
  //       return (
  //         <div className="font-medium text-danger">
  //           * Please upload an image
  //         </div>
  //       );
  //     }
  //     // add any other cases here
  //   }
  //   return null;
  // }

  function validateName(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter a listing name
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateDescription(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter a listing description
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validatePrice(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter a valid price
          </div>
        );
      }
      if (price && price < 0) {
        return (
          <div className="font-medium text-danger">
            * PLease enter a valid price (greater than 0)
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateListingType(props: ValidityState) {
    if (props != undefined) {
      if (listingType == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please select a listing type!
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateListingStatus(props: ValidityState) {
    if (props != undefined) {
      if (listingType == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please select a listing status
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  // end field validations
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      let updatedListing = {
        name: name,
        description: description,
        price: price,
        listingType: listingType,
        listingStatus: listingStatus,
      };
      const responseJson = await apiJson.put(
        `http://localhost:3000/api/listing/editListing/${currListing.listingId}`,
        updatedListing
      );
      // success
      toastShadcn({
        description: "Successfully edited listing",
      });
      setRefreshSeed(refreshSeed + 1);
    } catch (error: any) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while editing animal feed details: \n" +
          error.message,
      });
    }
  }

  useEffect(() => {
    if (!apiJson.loading) {
      if (apiJson.error) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while editing Listing details: \n" +
            apiJson.error,
        });
      } else if (apiJson.result) {
        // success
        console.log("succes?");
        toastShadcn({
          description: "Successfully edited Listing details:",
        });
      }
    }
  }, [apiJson.loading]);

  return (
    <div>
      {currListing && (
        <Form.Root
          className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <span className="self-center text-title-xl font-bold">
            Edit Listing: {currListing.name}
          </span>
          <hr className="bg-stroke opacity-20" />
          <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
            {/* First Name */}
            <FormFieldInput
              type="text"
              formFieldName="Name"
              label="Name"
              required={true}
              pattern={undefined}
              placeholder="e.g. ZooVanna"
              value={name}
              setValue={setName}
              validateFunction={validateName}
            />
          </div>

          {/* Description */}
          <FormFieldInput
            type="text"
            formFieldName="description"
            label="Description"
            required={true}
            placeholder="description"
            pattern={undefined}
            value={description}
            setValue={setDescription}
            validateFunction={validateDescription}
          />
          {/* price */}
          <FormFieldInput
            type="text"
            formFieldName="price"
            label="Price"
            required={true}
            placeholder="e.g. 500"
            pattern={undefined}
            value={price}
            setValue={setPrice}
            validateFunction={validatePrice}
          />
          {/* listing type */}
          <FormFieldSelect
            formFieldName="listingType"
            label="Listing Type"
            required={true}
            placeholder="Select a listing type"
            valueLabelPair={[
              ["LOCAL_ADULT_ONETIME", "Local-Adult (1x)"],
              ["LOCAL_STUDENT_ONETIME", "Local-Student (1x)"],
              ["LOCAL_SENIOR_ONETIME", "Local-Senior (1x)"],
              ["FOREIGNER_ONETIME", "Foreigner (1x)"],
              ["ANNUALPASS", "Annual pass"],
            ]}
            value={listingType}
            setValue={setListingType}
            validateFunction={validateListingType}
          />
          <FormFieldSelect
            formFieldName="listingStatus"
            label="Listing Status"
            required={true}
            placeholder="Select a listing status"
            valueLabelPair={[
              ["ACTIVE", "Active"],
              ["DISCONTINUED", "Discontinued"],
            ]}
            value={listingStatus}
            setValue={setListingStatus}
            validateFunction={validateListingStatus}
          />

          <Form.Submit asChild>
            <button className="mt-10 h-12 w-2/3 self-center rounded-full border bg-primary text-lg text-whiten transition-all hover:bg-opacity-80">
              Submit Edit Listing
            </button>
          </Form.Submit>
          {formError && (
            <div className="m-2 border-danger bg-red-100 p-2">{formError}</div>
          )}
        </Form.Root>
      )}
    </div>
  );
}

export default EditListingForm;
