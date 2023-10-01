import React, { useState } from "react";

import * as Form from "@radix-ui/react-form";
import FormFieldRadioGroup from "../FormFieldRadioGroup";
import FormFieldInput from "../FormFieldInput";
import FormFieldSelect from "../FormFieldSelect";
import useApiJson from "../../hooks/useApiJson";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import { useToast } from "@/components/ui/use-toast";

// end field validations

function CreateNewListingForm() {
  const apiJson = useApiJson();

  const toastShadcn = useToast().toast;

  const [name, setName] = useState<string>(""); // text input
  const [description, setDescription] = useState<string>(""); // text input
  const [price, setPrice] = useState<number | undefined>(undefined); // text input
  const [listingType, setListingType] = useState<string | undefined>(undefined);
  const [formError, setFormError] = useState<string | null>(null);

  function clearForm() {
    setName("");
    setDescription("");
    setPrice(undefined);
    setListingType("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Remember, your form must have enctype="multipart/form-data" for upload pictures
    e.preventDefault();
    console.log("Name:");
    console.log(name);

    const newListing = {
      name: name,
      description: description,
      price: price,
      listingType: listingType,
    };

    try {
      const responseJson = await apiJson.post(
        "http://localhost:3000/api/listing/createNewListing",
        newListing
      );
      // success
      toastShadcn({
        description: "Successfully created new Listing!",
      });
    } catch (error: any) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while creating new listing: \n" +
          error.message,
      });
    }
    // handle success case or failurecase using apiJson
  }

  // Field validations
  function validateName(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter a valid name!
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
            * Please enter a valid description!
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

  return (
    <Form.Root
      className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <span className="self-center text-title-xl font-bold">
        Create New Listing
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
      <Form.Submit asChild>
        <button className="mt-10 h-12 w-2/3 self-center rounded-full border bg-primary text-lg text-whiten transition-all hover:bg-opacity-80">
          Create Listing
        </button>
      </Form.Submit>
      {formError && (
        <div className="m-2 border-danger bg-red-100 p-2">{formError}</div>
      )}
    </Form.Root>
  );
}

export default CreateNewListingForm;
