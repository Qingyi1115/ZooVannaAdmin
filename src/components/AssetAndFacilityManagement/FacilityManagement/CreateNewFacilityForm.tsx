import React, { useState } from "react";

import * as Form from "@radix-ui/react-form";
import FormFieldRadioGroup from "../../FormFieldRadioGroup";
import FormFieldInput from "../../FormFieldInput";
import FormFieldSelect from "../../FormFieldSelect";
import useApiJson from "../../../hooks/useApiJson";

function validateFacilityName(props: ValidityState) {
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

function CreateNewFacilityForm() {
  const apiJson = useApiJson();

  const [facilityName, setFacilityName] = useState<string>(""); // text input
  const [xCoordinate, setXCoordinate] = useState<string>(""); // number
  const [yCoordinate, setYCoordinate] = useState<string>(""); // number
  const [facilityDetail, setFacilityDetail] = useState<string>(""); // text input
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Remember, your form must have enctype="multipart/form-data" for upload pictures
    e.preventDefault();

    const newFacility = {
      facilityName,
      xCoordinate,
      yCoordinate,
      facilityDetail
    };

    await apiJson.post("", newFacility);

    // handle success case or failurecase using apiJson
  }

  return (
    <Form.Root
      className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
      onSubmit={handleSubmit}
    >
      <span className="self-center text-title-xl font-bold">
        Create a New Facility
      </span>
      <hr className="bg-stroke opacity-20" />
      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
        {/* Facility Name */}
        <FormFieldInput
          type="text"
          formFieldName="facilityName"
          label="Facility Name"
          required={true}
          placeholder="e.g., Toilet"
          value={facilityName}
          setValue={setFacilityName}
          validateFunction={validateFacilityName}
        />
        {/* X Coordinate */}
        <FormFieldInput
          type="number"
          formFieldName="xCoordinate"
          label="X Coordinate"
          required={true}
          placeholder="1-1000"
          value={xCoordinate}
          setValue={setXCoordinate}
          validateFunction={validateFacilityName}
        />
        {/* Y Coordinate */}
        <FormFieldInput
          type="number"
          formFieldName="yCoordinate"
          label="Y Coordinate"
          required={true}
          placeholder="1-1000"
          value={yCoordinate}
          setValue={setYCoordinate}
          validateFunction={validateFacilityName}
        />
        
      </div>
      {/* Facility Details */}
      <FormFieldInput
          type="text"
          formFieldName="facilityDetail"
          label="Facility Name"
          required={true}
          placeholder="e.g., Toilet"
          value={facilityDetail}
          setValue={setFacilityDetail}
          validateFunction={validateFacilityName}
        />

      <Form.Submit asChild>
        <button className="mt-10 h-12 w-2/3 self-center rounded-full border bg-primary text-lg text-whiten transition-all hover:bg-opacity-80">
          Add Facility
        </button>
      </Form.Submit>
      {formError && (
        <div className="m-2 border-danger bg-red-100 p-2">{formError}</div>
      )}
    </Form.Root>
  );
}

export default CreateNewFacilityForm;
