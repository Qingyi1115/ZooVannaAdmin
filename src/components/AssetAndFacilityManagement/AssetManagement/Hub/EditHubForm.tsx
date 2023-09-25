import React, { useEffect, useState } from "react";
import * as Form from "@radix-ui/react-form";

import { MultiSelectChangeEvent } from "primereact/multiselect";

import useApiFormData from "../../../../hooks/useApiFormData";
import FormFieldInput from "../../../FormFieldInput";
import Hub from "../../../../models/Hub";
import useApiJson from "../../../../hooks/useApiJson";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import FormFieldSelect from "../../../FormFieldSelect";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";

interface EditHubFormProps {
  pageFacilityId: string | undefined;
  curHub: Hub;
  refreshSeed: number;
  setRefreshSeed: React.Dispatch<React.SetStateAction<number>>;
}

function EditHubForm(props: EditHubFormProps) {
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();

  const { pageFacilityId, curHub, refreshSeed, setRefreshSeed } = props;
  const [facilityId, setFacilityId] = useState<string | undefined>(pageFacilityId); // text input
  const hubProcessorId = curHub.hubProcessorId;
  const [processorName, setProcessorName] = useState<string>(
    curHub.processorName
  );
  const [formError, setFormError] = useState<string | null>(null);

  function validateHubName(props: ValidityState) {
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
    e.preventDefault();
    console.log("Name:");
    console.log(processorName);

    const updatedHub = {
      processorName: processorName,
    }
    console.log(updatedHub);

    try {
      const responseJson = await apiJson.put(
        `http://localhost:3000/api/assetfacility/updateHub/${curHub.hubProcessorId}`,
        updatedHub
      );
      // success
      toastShadcn({
        description: "Successfully edited hub",
      });
      setRefreshSeed(refreshSeed + 1);
      const redirectUrl = `/assetfacility/viewfacilitydetails/${pageFacilityId}/hubs`;
      navigate(redirectUrl);
    } catch (error: any) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while editing hub details: \n" +
          error.message,
      });
    }
  }


  return (
    <div>
      {curHub && (
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
              <span className="self-center text-lg text-graydark">
                Edit Hub
              </span>
              <Button disabled className="invisible">
                Back
              </Button>
            </div>
            <Separator />
            <span className="mt-4 self-center text-title-xl font-bold">
              {curHub.processorName}
            </span>
          </div>
          <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
            {/* Facility Id */}
            <FormFieldInput
              type="text"
              formFieldName="facilityId"
              label="Facility ID"
              required={true}
              placeholder=""
              pattern={undefined}
              value={facilityId}
              setValue={setFacilityId}
              validateFunction={validateFacilityId}
            />
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
              validateFunction={validateHubName}
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
      )}
    </div>
  );
}

export default EditHubForm;
