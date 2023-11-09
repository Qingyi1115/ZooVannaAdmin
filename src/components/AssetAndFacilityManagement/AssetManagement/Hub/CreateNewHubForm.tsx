import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import * as Form from "@radix-ui/react-form";
import { useNavigate, useParams } from "react-router-dom";
import useApiJson from "../../../../hooks/useApiJson";
import FormFieldInput from "../../../FormFieldInput";

import { useLocation } from 'react-router-dom';

function CreateNewHubForm(prop:any) {
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();
  const location = useLocation();

  const { facilityId } = useParams<{ facilityId: string }>();
  const [pageFacilityId, setFacilityId] = useState<string | undefined>(facilityId); // text input

  const [processorName, setProcessorName] = useState<string>(""); // text input
  const [formError, setFormError] = useState<string | null>(null);
  console.log("location",location);

  // Field validations
  function validateName(props: ValidityState) {
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

  function validateFacilityId(props: ValidityState) {
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
    setFacilityId("");
    setProcessorName("");
  }



  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Remember, your form must have enctype="multipart/form-data" for upload pictures
    e.preventDefault();
    console.log("Name:");
    console.log(processorName);

    const newHub = {
      facilityId: facilityId,
      processorName: processorName,
    }
    console.log(newHub);

    try {
      const responseJson = await apiJson.post(
        "http://localhost:3000/api/assetFacility/addHub",
        newHub
      );
      // success
      toastShadcn({
        description: "Successfully created hub",
      });
      navigate(-1);
    } catch (error: any) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while creating hub details: \n" +
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
      {/* Title Header and back button */}
      <div className="flex flex-col">
        <div className="mb-4 flex justify-between">
          <Button variant={"outline"} type="button" onClick={() => navigate(-1)} className="">
            Back
          </Button>
          <span className="self-center text-title-xl font-bold">
            Create Hub
          </span>
          <Button disabled className="invisible">
            Back
          </Button>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
        {/* Facility Id */}
        {/* <FormFieldInput
          type="number"
          formFieldName="facilityId"
          label="Facility ID"
          required={true}
          placeholder=""
          pattern={undefined}
          value={pageFacilityId}
          setValue={setFacilityId}
          validateFunction={validateFacilityId}
        /> */}
        {/* Hub Name */}
        <FormFieldInput
          type="text"
          formFieldName="processorName"
          label="Hub Name"
          required={true}
          placeholder=""
          pattern={undefined}
          value={processorName}
          setValue={setProcessorName}
          validateFunction={validateName}
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

export default CreateNewHubForm;
