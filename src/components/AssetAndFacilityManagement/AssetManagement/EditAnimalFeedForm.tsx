import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";

import { MultiSelectChangeEvent } from "primereact/multiselect";

import useApiFormData from "../../../hooks/useApiFormData";
import FormFieldInput from "../../FormFieldInput";
import FormFieldRadioGroup from "../../FormFieldRadioGroup";
import AnimalFeed from "src/models/AnimalFeed";

interface EditAnimalFeedFormProps {
  curAnimalFeed: AnimalFeed;
}

function EditAnimalFeedForm(props: EditAnimalFeedFormProps) {
  const apiFormData = useApiFormData();

  const { curAnimalFeed } = props;

  const [animalFeedName, setAnimalFeedName] = useState<string>(curAnimalFeed.animalFeedName);
  const [animalFeedCategory, setAnimalFeedCategory] = useState<
    string | undefined
  >(curAnimalFeed.animalFeedCategory); // select from set list
  const [animalFeedImageUrl, setImageUrl] = useState<string | null>(curAnimalFeed.animalFeedImageUrl);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formError, setFormError] = useState<string | null>(null);

  // field validations
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

  function validateAnimalFeedName(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter an animal feed name
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }


  function validateAnimalFeedCategory(props: ValidityState) {
    // console.log(props);
    if (props != undefined) {
      if (animalFeedCategory == undefined) {
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

  // end field valisations

  function onAnimalFeedCategorySelectChange(e: MultiSelectChangeEvent) {
    setAnimalFeedCategory(e.value);

    const element = document.getElementById("selectMultiAnimalFeedCategoryField");
    if (element) {
      const isDataInvalid = element.getAttribute("data-invalid");
      if (isDataInvalid == "true") {
        element.setAttribute("data-valid", "true");
        element.removeAttribute("data-invalid");
      }
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files && event.target.files[0];
    setImageFile(file);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("animalFeedName", animalFeedName);
    formData.append("animalFeedCategory", animalFeedCategory || "");
    formData.append("file", imageFile || "");
    await apiFormData.put(
      "http://localhost:3000/api/animalFeed/updateanimalFeed",
      formData
    );
    console.log(apiFormData.result);
  }

  return (
    <div>
      {curAnimalFeed && (
        <Form.Root
          className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <span className="self-center text-title-xl font-bold">
            Edit AnimalFeed: {curAnimalFeed.animalFeedName}
          </span>
          <hr className="bg-stroke opacity-20" />
          {/* AnimalFeed Picture */}
          <Form.Field
            name="animalFeedImage"
            className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
          >
            <span className="font-medium">Current Image</span>
            <img src={curAnimalFeed.animalFeedImageUrl} alt="Current animalFeed image" />
            <Form.Label className="font-medium">
              Change AnimalFeed Image
            </Form.Label>
            <Form.Control
              type="file"
              placeholder="Change image"
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
              placeholder="e.g., Carrots, Beef,..."
              value={animalFeedName}
              setValue={setAnimalFeedName}
              validateFunction={validateAnimalFeedName}
            />

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
                validateFunction={validateAnimalFeedCategory}
              />
            </div>

            <Form.Submit asChild>
              <button className="mt-10 h-12 w-2/3 self-center rounded-full border bg-primary text-lg text-whiten transition-all hover:bg-opacity-80">
                Submit Edit AnimalFeed
              </button>
            </Form.Submit>
            {formError && (
              <div className="m-2 border-danger bg-red-100 p-2">{formError}</div>
            )}
          </div>
        </Form.Root>
      )}
    </div>
  );
}

export default EditAnimalFeedForm;
