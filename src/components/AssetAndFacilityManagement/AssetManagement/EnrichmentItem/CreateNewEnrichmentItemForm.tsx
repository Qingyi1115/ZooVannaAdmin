import React, { useState } from "react";

import * as Form from "@radix-ui/react-form";
import FormFieldRadioGroup from "../../../FormFieldRadioGroup";
import FormFieldInput from "../../../FormFieldInput";
import FormFieldSelect from "../../../FormFieldSelect";
import useApiFormData from "../../../../hooks/useApiFormData";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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

function validateImage(props: ValidityState) {
  if (props != undefined) {
    if (props.valueMissing) {
      return (
        <div className="font-medium text-danger">* Please upload an image</div>
      );
    }
    // add any other cases here
  }
  return null;
}

// end field validations

function CreateNewEnrichmentItemForm() {
  const apiFormData = useApiFormData();
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();

  const [enrichmentItemName, setEnrichmentItemName] = useState<string>(""); // text input
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  function clearForm() {
    setEnrichmentItemName("");
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
    console.log(enrichmentItemName);
    const formData = new FormData();
    formData.append("enrichmentItemName", enrichmentItemName);
    formData.append("file", imageFile || "");
    try {
      const responseJson = await apiFormData.post(
        "http://localhost:3000/api/assetfacility/createNewEnrichmentItem",
        formData
      );
      // success
      toastShadcn({
        description: "Successfully created enrichment item",
      });
      const redirectUrl = `/assetfacility/viewallenrichmentitems`;
      navigate(redirectUrl);
    } catch (error: any) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while creating enrichment item details: \n" +
          error.message,
      });
    }
    console.log(apiFormData.result);

    // handle success case or failurecase using apiJson
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
          <Button variant={"outline"} type="button" onClick={() => navigate(-1)} className="">
            Back
          </Button>
          <span className="self-center text-title-xl font-bold">
            Create Enrichment Item
          </span>
          <Button disabled className="invisible">
            Back
          </Button>
        </div>
        <Separator />
      </div>

      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
        {/* Enrichment Item Picture */}
        <Form.Field
          name="enrichmentItemImage"
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Label className="font-medium">Enrichment Item Image</Form.Label>
          <Form.Control
            type="file"
            required
            accept=".png, .jpg, .jpeg, .webp"
            onChange={handleFileChange}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          />
          <Form.ValidityState>{validateImage}</Form.ValidityState>
        </Form.Field>
        {/* Enrichment Item Name */}
        <FormFieldInput
          type="text"
          formFieldName="enrichmentItemName"
          label="Enrichment Item Name"
          required={true}
          placeholder="e.g., Puzzle"
          value={enrichmentItemName}
          setValue={setEnrichmentItemName}
          validateFunction={validateName}
          pattern={undefined}
        />
      </div>

      <Form.Submit asChild>
        <button className="mt-10 h-12 w-2/3 self-center rounded-full border bg-primary text-lg text-whiten transition-all hover:bg-opacity-80">
          Create Enrichment Item
        </button>
      </Form.Submit>
      {formError && (
        <div className="m-2 border-danger bg-red-100 p-2">{formError}</div>
      )}
    </Form.Root>
  );
}

export default CreateNewEnrichmentItemForm;
