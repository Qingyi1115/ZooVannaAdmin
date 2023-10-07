import React, { useState } from "react";

import * as Form from "@radix-ui/react-form";
import FormFieldRadioGroup from "../../../../FormFieldRadioGroup";
import FormFieldInput from "../../../../FormFieldInput";
import FormFieldSelect from "../../../../FormFieldSelect";
import useApiJson from "../../../../../hooks/useApiJson";
import useApiFormData from "../../../../../hooks/useApiFormData";
import { useToast } from "@/components/ui/use-toast";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Sensor from "../../../../../models/Sensor";

interface CreateNewMaintenanceLogProps {
  curSensor: Sensor;
}

function validateMaintenanceLogName(props: ValidityState) {
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

function CreateNewMaintenanceLogForm(props: CreateNewMaintenanceLogProps) {
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>(""); // text input
  const [details, setDetails] = useState<string>(""); // text input
  const [remarks, setRemarks] = useState<string>(""); // text input
  const { curSensor } = props;
  const [formError, setFormError] = useState<string | null>(null);


  async function handleSubmit(e: any) {
    // Remember, your form must have enctype="multipart/form-data" for upload pictures
    e.preventDefault();

    const newMaintenanceLog = {
      title: title,
      details: details,
      remarks: remarks
    }
    console.log(newMaintenanceLog);

    try {
      const responseJson = await apiJson.post(
        `http://localhost:3000/api/assetfacility/createSensorMaintenanceLog/${curSensor.sensorId}`,
        newMaintenanceLog);
      // success
      toastShadcn({
        description: "Successfully created sensor maintenance log",
      });
      console.log(responseJson);
      navigate(-1);
    } catch (error: any) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while creating sensor maintenance log details: \n" +
          error.message,
      });
    }

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
            Create Sensor Log
          </span>
          <Button disabled className="invisible">
            Back
          </Button>
        </div>
        <Separator />
      </div>

      {/* Title */}
      <FormFieldInput
        type="text"
        formFieldName="title"
        label="Title"
        required={true}
        placeholder=""
        value={title}
        setValue={setTitle}
        validateFunction={validateMaintenanceLogName}
        pattern={undefined}
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
        validateFunction={validateMaintenanceLogName}
        pattern={undefined}
      />
      {/* Remarks */}
      <FormFieldInput
        type="text"
        formFieldName="remarks"
        label="Remarks"
        required={true}
        placeholder=""
        value={remarks}
        setValue={setRemarks}
        validateFunction={validateMaintenanceLogName}
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

export default CreateNewMaintenanceLogForm;
