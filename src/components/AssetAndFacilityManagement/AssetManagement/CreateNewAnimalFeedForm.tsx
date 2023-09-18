import React, { useState } from "react";

import * as Form from "@radix-ui/react-form";
import FormFieldRadioGroup from "../../FormFieldRadioGroup";
import FormFieldInput from "../../FormFieldInput";
import FormFieldSelect from "../../FormFieldSelect";
import useApiJson from "../../../hooks/useApiJson";

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

function CreateNewAnimalFeedForm() {
  const apiJson = useApiJson();

  const [animalFeedName, setAnimalFeedName] = useState<string>(""); // text input
  const [animalFeedCategory, setAnimalFeedCategory] = useState<string | undefined>(
    undefined
  ); // radio group

  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Remember, your form must have enctype="multipart/form-data" for upload pictures
    e.preventDefault();

    const newAnimalFeed = {
      animalFeedName,
      animalFeedCategory
    };

    await apiJson.post("", newAnimalFeed);

    // handle success case or failurecase using apiJson
  }

  return (
    <Form.Root
      className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
      onSubmit={handleSubmit}
    >
      <span className="self-center text-title-xl font-bold">
        Create New Animal Feed
      </span>
      <hr className="bg-stroke opacity-20" />
      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
        {/* Animal Feed Name */}
        <FormFieldInput
          type="text"
          formFieldName="animalFeedName"
          label="Animal Feed Name"
          required={true}
          placeholder="e.g., Carrots"
          value={animalFeedName}
          setValue={setAnimalFeedName}
          validateFunction={validateName}
        />
      </div>

      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
        {/* Animal Feed Category */}
        <FormFieldRadioGroup
          formFieldName="animalFeedCategory"
          label="Animal Feed Category"
          required={true}
          valueIdLabelTriplet={[
            ["RED_MEAT", "r1", "Red Meat"],
            ["WHITE_MEAT", "r2", "White Meat"],
            ["FISH", "r3", "Fish"],
            ["INSECTS", "r4", "Insects"],
            ["HAY", "r5", "Hay"],
            ["VEGETABLES", "r6", "Vegetables"],
            ["FRUITS", "r7", "Fruits"],
            ["GRAINS", "r8", "Grains"],
            ["BROWSE", "r9", "Browse"],
            ["PELLETS", "r10", "Pellets"],
            ["NECTAR", "r11", "Nectar"],
            ["SUPPLEMENTS", "r12", "Supplements"],
            ["OTHERS", "r13", "Others"]
          ]}
          value={animalFeedCategory}
          setValue={setAnimalFeedCategory}
          validateFunction={validateName}
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
