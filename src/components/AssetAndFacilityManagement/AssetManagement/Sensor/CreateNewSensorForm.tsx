import React, { useState } from "react";

import * as Form from "@radix-ui/react-form";
import FormFieldRadioGroup from "../../../FormFieldRadioGroup";
import FormFieldInput from "../../../FormFieldInput";
import FormFieldSelect from "../../../FormFieldSelect";
import useApiJson from "../../../../hooks/useApiJson";
import useApiFormData from "../../../../hooks/useApiFormData";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';

function CreateNewSensorForm() {
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;

  const [sensorName, setSensorName] = useState<string>(""); // text input
  const [dateOfActivation, setDateOfActivation] = useState<string | Date | Date[] | null>(null);
  const [dateOfLastMaintained, setDateOfLastMaintained] = useState<string | Date | Date[] | null>(null);
  const [sensorType, setSensorType] = useState<string | undefined>(
    undefined
  ); // radio group
  const [formError, setFormError] = useState<string | null>(null);

  function clearForm() {
    setSensorName("");
    setDateOfActivation(null);
    setDateOfLastMaintained(null);
    setSensorType(undefined);
  }

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


  // end field validations

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Remember, your form must have enctype="multipart/form-data" for upload pictures
    e.preventDefault();

    const newSensor = {
      sensorName: sensorName,
      dateOfActivation: dateOfActivation,
      dateOfLastMaintained: dateOfLastMaintained,
      sensorType: sensorType
    }
    console.log(newSensor);

    try {
      const responseJson = await apiJson.post(
        "http://localhost:3000/api/assetfacility/addSensor",
        newSensor
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
          validateFunction={validateName} pattern={undefined}        />
        {/* Activation Date */}
      
        <div>Activation Date</div>
        <Calendar value={dateOfActivation} onChange={(e: CalendarChangeEvent) => {
          if (e && e.value !== undefined) {
            setDateOfActivation(e.value);
          }
          }}/>
      
        {/* Last Maintained */}
        <div>Last Maintained</div>
        <Calendar value={dateOfLastMaintained} onChange={(e: CalendarChangeEvent) => {
          if (e && e.value !== undefined) {
            setDateOfLastMaintained(e.value);
          }
          }}/>
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
