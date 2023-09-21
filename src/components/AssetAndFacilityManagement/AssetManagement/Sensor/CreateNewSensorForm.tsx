import React, { useState } from "react";

import * as Form from "@radix-ui/react-form";
import FormFieldRadioGroup from "../../../FormFieldRadioGroup";
import FormFieldInput from "../../../FormFieldInput";
import FormFieldSelect from "../../../FormFieldSelect";
import useApiJson from "../../../../hooks/useApiJson";
import useApiFormData from "../../../../hooks/useApiFormData";
import { useToast } from "@/components/ui/use-toast";

function CreateNewSensorForm() {
  const apiFormData = useApiFormData();
  const toastShadcn = useToast().toast;

  const [sensorName, setSensorName] = useState<string>(""); // text input
  const [sensorCategory, setSensorCategory] = useState<string | undefined>(
    undefined
  ); // radio group
  const [sensorImageUrl, setImageUrl] = useState<string | null>("");
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


  function validateSensorCategory(props: ValidityState) {
    // console.log(props);
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please select an sensor category
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
    setSensorName("");
    setSensorCategory(undefined);
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
    console.log(sensorName);
    console.log("Category:");
    console.log(sensorCategory);

    const formData = new FormData();
    formData.append("sensorName", sensorName);
    formData.append("sensorCategory", sensorCategory?.toString() || "");
    formData.append("file", imageFile || "");
    try {
      const responseJson = await apiFormData.post(
        "http://localhost:3000/api/assetfacility/createNewSensor",
        formData
      );
      // success
      toastShadcn({
        description: "Successfully created sensor",
      });
    } catch (error: any) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while creating sensor details: \n" +
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
        Add Sensor
      </span>
      <hr className="bg-stroke opacity-20" />
      {/* Sensor Picture */}
      <Form.Field
        name="sensorImage"
        className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
      >
        <Form.Label className="font-medium">Sensor Image</Form.Label>
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
        {/* Sensor Name */}
        <FormFieldInput
          type="text"
          formFieldName="sensorName"
          label="Sensor Name"
          required={true}
          placeholder="e.g., Camera"
          value={sensorName}
          setValue={setSensorName}
          validateFunction={validateName}
        />
      </div>

      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
        {/* Sensor Category */}
        <FormFieldSelect
          formFieldName="sensorCategory"
          label="Sensor Category"
          required={true}
          placeholder="Select an sensor category..."
          valueLabelPair={[
            ["TEMPERATURE", "TEMPERATURE"],
            ["LIGHT", "LIGHT"],
            ["HUMIDITY", "HUMIDITY"],
            ["SOUND", "SOUND"],
            ["MOTION", "MOTION"],
            ["CAMERA", "CAMERA"]
          ]}
          value={sensorCategory}
          setValue={setSensorCategory}
          validateFunction={validateSensorCategory}
        />
      </div>


      <Form.Submit asChild>
        <button className="mt-10 h-12 w-2/3 self-center rounded-full border bg-primary text-lg text-whiten transition-all hover:bg-opacity-80">
          Create Sensor
        </button>
      </Form.Submit>
      {formError && (
        <div className="m-2 border-danger bg-red-100 p-2">{formError}</div>
      )}
    </Form.Root>
  );
}

export default CreateNewSensorForm;
