import React, { useState } from "react";

import * as Form from "@radix-ui/react-form";
import FormFieldRadioGroup from "../../../FormFieldRadioGroup";
import FormFieldInput from "../../../FormFieldInput";
import FormFieldSelect from "../../../FormFieldSelect";
import useApiJson from "../../../../hooks/useApiJson";
import { AnimalFeedCategory } from "../../../../enums/AnimalFeedCategory";
import useApiFormData from "../../../../hooks/useApiFormData";
import { useToast } from "@/components/ui/use-toast";

function CreateNewAnimalFeedForm() {
  const apiFormData = useApiFormData();
  const toastShadcn = useToast().toast;

  const [animalFeedName, setAnimalFeedName] = useState<string>(""); // text input
  const [animalFeedCategory, setAnimalFeedCategory] = useState<string | undefined>(
    undefined
  ); // radio group
  const [animalFeedImageUrl, setImageUrl] = useState<string | null>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Field validations
  function validateName(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">* Please enter a valid name!</div>
        );
      }
      // add any other cases here
    }
    return null;
  }


  function validateAnimalFeedCategory(props: ValidityState) {
    // console.log(props);
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please select an animal feed category
          </div>
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

  function clearForm() {
    setAnimalFeedName("");
    setAnimalFeedCategory(undefined);
    setImageFile(null);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files && event.target.files[0];
    setImageFile(file);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Remember, your form must have enctype="multipart/form-data" for upload pictures
    e.preventDefault();
    console.log("Name:");
    console.log(animalFeedName);
    console.log("Category:");
    console.log(animalFeedCategory);

    const formData = new FormData();
    formData.append("animalFeedName", animalFeedName);
    formData.append("animalFeedCategory", animalFeedCategory?.toString() || "");
    formData.append("file", imageFile || "");
    try {
      const responseJson = await apiFormData.post(
        "http://localhost:3000/api/assetFacility/createNewAnimalFeed",
        formData
      );
      // success
      toastShadcn({
        description: "Successfully created animal feed",
      });
    } catch (error: any) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while creating animal feed details: \n" +
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
      <span className="self-center text-title-xl font-bold">
        Add Animal Feed
      </span>
      <hr className="bg-stroke opacity-20" />
      {/* Animal Feed Picture */}
      <Form.Field
        name="animalFeedImage"
        className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
      >
        <Form.Label className="font-medium">Animal Feed Image</Form.Label>
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
        {/* Animal Feed Name */}
        <FormFieldInput
          type="text"
          formFieldName="animalFeedName"
          label="Animal Feed Name"
          required={true}
          placeholder="e.g., Carrots"
          pattern={undefined}
          value={animalFeedName}
          setValue={setAnimalFeedName}
          validateFunction={validateName}
          />
      </div>

      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
        {/* Animal Feed Category */}
        <FormFieldSelect
          formFieldName="animalFeedCategory"
          label="Animal Feed Category"
          required={true}
          placeholder="Select an animal feed category..."
          valueLabelPair={[
            ["RED_MEAT", "Red Meat"],
            ["WHITE_MEAT", "White Meat"],
            ["FISH", "Fish"],
            ["INSECTS", "Insects"],
            ["HAY", "Hay"],
            ["VEGETABLES", "Vegetables"],
            ["FRUITS", "Fruits"],
            ["GRAINS", "Grains"],
            ["BROWSE", "Browse"],
            ["PELLETS", "Pellets"],
            ["NECTAR", "Nectar"],
            ["SUPPLEMENTS", "Supplements"],
            ["OTHERS", "Others"]
          ]}
          value={animalFeedCategory}
          setValue={setAnimalFeedCategory}
          validateFunction={validateAnimalFeedCategory}
        />
      </div>


      <Form.Submit asChild>
        <button className="mt-10 h-12 w-2/3 self-center rounded-full border bg-primary text-lg text-whiten transition-all hover:bg-opacity-80">
          Create Animal Feed
        </button>
      </Form.Submit>
      {formError && (
        <div className="m-2 border-danger bg-red-100 p-2">{formError}</div>
      )}
    </Form.Root>
  );
}

export default CreateNewAnimalFeedForm;
