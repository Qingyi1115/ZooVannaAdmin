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
import Animal from "../../../models/Animal";

interface CreateNewAnimalObservationLogProps {
  curAnimal: Animal;
}

function validateAnimalObservationLogName(props: ValidityState) {
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

function CreateNewAnimalObservationLogForm(props: CreateNewAnimalObservationLogProps) {
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();
  const [durationInMinutes, setDurationInMinutes] = useState<string>(""); // text input
  const [observationQuality, setObservationQuality] = useState<string | undefined>(
    undefined); // dropdown
  const [details, setDetails] = useState<string>(""); // text input
  const { curAnimal } = props;
  const [formError, setFormError] = useState<string | null>(null);


  async function handleSubmit(e: any) {
    // Remember, your form must have enctype="multipart/form-data" for upload pictures
    e.preventDefault();

    const newAnimalObservationLog = {
      durationInMinutes: durationInMinutes,
      observationQuality: observationQuality,
      details: details
    }
    console.log(newAnimalObservationLog);

    try {
      const responseJson = await apiJson.post(
        `http://localhost:3000/api/assetAnimal/createAnimalObservationLog/${curAnimal.animalCode}`,
        newAnimalObservationLog);
      // success
      toastShadcn({
        description: "Successfully created animal log",
      });
    } catch (error: any) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while creating animal log details: \n" +
          error.message,
      });
    }
    console.log(apiJson.result);

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
            Create Animal Observation Log
          </span>
          <Button disabled className="invisible">
            Back
          </Button>
        </div>
        <Separator />
      </div>

      {/* Duration in Minutes */}
      <FormFieldInput
        type="number"
        formFieldName="durationInMinutes"
        label="Duration in Minutes"
        required={true}
        placeholder=""
        value={durationInMinutes}
        setValue={setDurationInMinutes}
        validateFunction={validateAnimalObservationLogName}
        pattern={undefined}
      />

      {/* Observation Quality */}
      <FormFieldSelect
        formFieldName="observationQuality"
        label="Observation Quality"
        required={true}
        placeholder="Select a rating..."
        valueLabelPair={[
          ["EXCELLENT", "Excellent"],
          ["GOOD", "Good"],
          ["FAIR", "Fair"],
          ["POOR", "Poor"],
          ["NOT_RECORDED", "Not Recorded"]
        ]}
        value={observationQuality}
        setValue={setObservationQuality}
        validateFunction={validateAnimalObservationLogName}
      />
      {/* Details */}
      <FormFieldInput
        type="text"
        formFieldName="details"
        label="Details"
        required={true}
        placeholder=""
        value={details}
        setValue={setDetails}
        validateFunction={validateAnimalObservationLogName}
        pattern={undefined}
      />

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

export default CreateNewAnimalObservationLogForm;
