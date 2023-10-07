import React, { useEffect, useState } from "react";
import * as Form from "@radix-ui/react-form";

import { MultiSelectChangeEvent } from "primereact/multiselect";

import useApiFormData from "../../../../../hooks/useApiFormData";
import FormFieldInput from "../../../../FormFieldInput";
import Facility from "../../../../../models/Facility";
import useApiJson from "../../../../../hooks/useApiJson";
import { useToast } from "@/components/ui/use-toast";
import FormFieldSelect from "../../../../FormFieldSelect";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import FacilityLog from "../../../../../models/FacilityLog";

interface EditFacilityLogFormProps {
  curFacilityLog: FacilityLog
}

function EditFacilityLogForm(props: EditFacilityLogFormProps) {
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>(""); // text input
  const [details, setDetails] = useState<string>(""); // text input
  const [remarks, setRemarks] = useState<string>(""); // text input
  const { curFacilityLog } = props;
  const [formError, setFormError] = useState<string | null>(null);

  function validateFacilityLogName(props: ValidityState) {
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

  useEffect(() => {
    setTitle(curFacilityLog.title);
    setDetails(curFacilityLog.details);
    setRemarks(curFacilityLog.remarks);
  }, [curFacilityLog]);


  // end field validations

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newFacilityLog = {
      title: title,
      details: details,
      remarks: remarks
    }

    try {
      const responseJson = await apiJson.put(
        `http://localhost:3000/api/assetFacility/updateFacilityLog/${curFacilityLog.facilityLogId}`,
        newFacilityLog);
      // success
      toastShadcn({
        description: "Successfully edited facility log",
      });
      navigate(-1);
    } catch (error: any) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while creating facility log details: \n" +
          error.message,
      });
    }
  }



  return (
    <div className="flex flex-col">

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
              Edit Facility Log
            </span>
            <Button disabled className="invisible">
              Back
            </Button>
          </div>
          <Separator />
          <span className="mt-4 self-center text-title-xl font-bold">
            {curFacilityLog.title}
          </span>
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
          validateFunction={validateFacilityLogName}
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
          validateFunction={validateFacilityLogName}
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
          validateFunction={validateFacilityLogName}
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

    </div>
  );
}

export default EditFacilityLogForm;
