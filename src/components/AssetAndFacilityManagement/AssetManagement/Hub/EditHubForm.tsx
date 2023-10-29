import React, { useEffect, useState } from "react";
import * as Form from "@radix-ui/react-form";

import { MultiSelectChangeEvent } from "primereact/multiselect";

import useApiFormData from "../../../../hooks/useApiFormData";
import FormFieldInput from "../../../FormFieldInput";
import Hub from "../../../../models/HubProcessor";
import useApiJson from "../../../../hooks/useApiJson";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import FormFieldSelect from "../../../FormFieldSelect";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
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
  const [radioGroup, setRadioGroup] = useState<number>(
    curHub.radioGroup || 0
  );

  useEffect(()=>{
    setProcessorName(curHub.processorName);
    setRadioGroup(curHub.radioGroup || 0);
    console.log("changed ", curHub)
  },[curHub])
  
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
      radioGroup: radioGroup
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
      navigate(-1);
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
            {curHub.hubStatus != "PENDING" && (
              <div>
              <Form.Field
                name={"radioGroup"}
                className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
              >
                <Form.Label className="font-medium">{"Radio Group"}</Form.Label>
                <Form.Control
                  type={"number"}
                  required={true}
                  placeholder={"0-254"}
                  value={radioGroup}
                  step={1}
                  onChange={(e) => setRadioGroup(parseInt(e.target.value))}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium shadow outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
                <Form.ValidityState>{validateHubName}</Form.ValidityState>
              </Form.Field>
              </div>
            )}
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
