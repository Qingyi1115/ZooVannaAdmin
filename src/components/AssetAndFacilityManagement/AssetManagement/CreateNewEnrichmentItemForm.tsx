import React, { useState } from "react";

import * as Form from "@radix-ui/react-form";
import FormFieldRadioGroup from "../../FormFieldRadioGroup";
import FormFieldInput from "../../FormFieldInput";
import FormFieldSelect from "../../FormFieldSelect";
import useApiFormData from "../../../hooks/useApiFormData";

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

function CreateNewEnrichmentItemForm() {
  const apiFormData = useApiFormData();

  const [enrichmentItemName, setEnrichmentItemName] = useState<string>(""); // text input
  const [formError, setFormError] = useState<string | null>(null);

  function clearForm() {
    setEnrichmentItemName("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Remember, your form must have enctype="multipart/form-data" for upload pictures
    e.preventDefault();
    console.log("Name:");
    console.log(enrichmentItemName);
    
    const formData = new FormData();
    formData.append("animalFeedName", enrichmentItemName);

    await apiFormData.post(
      "http://localhost:3000/api/species/createnewenrichmentitem",
      formData
    );
    console.log(apiFormData.result);

    // handle success case or failurecase using apiJson
  }

  return (
    <Form.Root
      className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
      onSubmit={handleSubmit}
    >
      <span className="self-center text-title-xl font-bold">
        Add Enrichment Item
      </span>
      <hr className="bg-stroke opacity-20" />
      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
        {/* Animal Feed Name */}
        <FormFieldInput
          type="text"
          formFieldName="enrichmentItemName"
          label="Animal Feed Name"
          required={true}
          placeholder="e.g., Carrots"
          value={enrichmentItemName}
          setValue={setEnrichmentItemName}
          validateFunction={validateName}
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
