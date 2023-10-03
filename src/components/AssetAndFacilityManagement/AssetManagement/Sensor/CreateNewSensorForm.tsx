import React, { useState } from "react";

import * as Form from "@radix-ui/react-form";
import FormFieldRadioGroup from "../../../FormFieldRadioGroup";
import FormFieldInput from "../../../FormFieldInput";
import FormFieldSelect from "../../../FormFieldSelect";
import { SensorType } from "../../../../enums/SensorType";
import useApiJson from "../../../../hooks/useApiJson";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";

function CreateNewSensorForm() {
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();

  const { hubProcessorId } = useParams<{ hubProcessorId: string }>();
  const [pageHubProcessorId, setPageHubProcessorId] = useState<string | undefined>(hubProcessorId); // text input
  const [sensorName, setSensorName] = useState<string>(""); // text input
  const [sensorType, setSensorType] = useState<
    string | undefined
  >(undefined);
  const [dateOfActivation, setDateOfActivation] = useState<string | Date | Date[] | null>(null);
  const [dateOfLastMaintained, setDateOfLastMaintained] = useState<string | Date | Date[] | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Field validations
  function validateName(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter a valid value!
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateSensorType(props: ValidityState) {
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
  function validateHubProcessorId(props: ValidityState) {
    // console.log(props);
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter a valid value
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
    setSensorType(undefined);
    setDateOfActivation(null);
    setDateOfLastMaintained(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Remember, your form must have enctype="multipart/form-data" for upload pictures
    e.preventDefault();
    console.log("Name:");
    console.log(sensorName);
    console.log("Category:");
    console.log(sensorType);

    const newSensor = {
      hubProcessorId: pageHubProcessorId,
      sensorName: sensorName,
      sensorType: sensorType
    }
    console.log(newSensor);

    try {
      const responseJson = await apiJson.post(
        "http://localhost:3000/api/assetFacility/addSensor",
        newSensor);
      // success
      toastShadcn({
        description: "Successfully created sensor",
      });
      const redirectUrl = `/assetfacility/viewhubdetails/${hubProcessorId}`;
      navigate(redirectUrl);
    } catch (error: any) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while creating sensor details: \n" +
          error.message,
      });
    }
    console.log(apiJson.result);
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
            Create Sensor
          </span>
          <Button disabled className="invisible">
            Back
          </Button>
        </div>
        <Separator />
      </div>

      {/* Hub Processor ID */}
      {/* <FormFieldInput
        type="number"
        formFieldName="facilityId"
        label="Hub Processor ID"
        required={true}
        placeholder=""
        pattern={undefined}
        value={pageHubProcessorId}
        setValue={setPageHubProcessorId}
        validateFunction={validateHubProcessorId}
      /> */}
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
          validateFunction={validateName} pattern={undefined} />
      </div>
      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
        {/* Sensor Type */}
        <FormFieldSelect
          formFieldName="sensorType"
          label="Sensor Type"
          required={true}
          placeholder="Select an sensor category..."
          valueLabelPair={[
            ["TEMPERATURE", "Temperature"],
            ["LIGHT", "Light"],
            ["HUMIDITY", "Humidity"],
            ["SOUND", "Sound"],
            ["MOTION", "Motion"],
            ["CAMERA", "Camera"]
          ]}
          value={sensorType}
          setValue={setSensorType}
          validateFunction={validateSensorType}
        />
      </div>

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

export default CreateNewSensorForm;
