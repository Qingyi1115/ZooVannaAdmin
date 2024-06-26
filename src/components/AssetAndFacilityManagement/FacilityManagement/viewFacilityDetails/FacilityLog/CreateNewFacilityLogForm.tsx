import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import * as Form from "@radix-ui/react-form";
import { useLocation, useNavigate } from "react-router-dom";
import { FacilityLogType } from "../../../../../enums/FacilityLogType";
import useApiJson from "../../../../../hooks/useApiJson";
import { useAuthContext } from "../../../../../hooks/useAuthContext";
import Facility from "../../../../../models/Facility";
import FormFieldInput from "../../../../FormFieldInput";

interface CreateNewFacilityLogProps {
  curFacility: Facility;
  curFacilityLogType: FacilityLogType;
}

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

function CreateNewFacilityLogForm(props: CreateNewFacilityLogProps) {
  const location = useLocation();
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>(""); // text input
  const [details, setDetails] = useState<string>(""); // text input
  const [remarks, setRemarks] = useState<string>(""); // text input
  const [facilityLogType, setFacilityLogType] = useState<string | undefined>(
    undefined); // dropdown
  const { curFacility, curFacilityLogType } = props;
  const [formError, setFormError] = useState<string | null>(null);
  const employee = useAuthContext().state.user?.employeeData;

  async function handleSubmit(e: any) {
    // Remember, your form must have enctype="multipart/form-data" for upload pictures
    e.preventDefault();

    const newFacilityLog = {
      facilityId: curFacility.facilityId,
      title: title,
      details: details,
      remarks: remarks,
      facilityLogType: curFacilityLogType
    }
    console.log(newFacilityLog);

    try {
      const responseJson = await apiJson.post(
        `http://localhost:3000/api/assetFacility/createFacilityLog/${curFacility.facilityId}`,
        newFacilityLog);
      // success
      toastShadcn({
        description: "Successfully created facility log",
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
            {curFacilityLogType == FacilityLogType.OPERATION_LOG ? "Create Facility Operation Log" : "Create Facility Maintenance Log"}
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

      {/* Facility Log Type */}
      {/* {(employee.superAdmin || employee.generalStaff?.generalStaffType == "ZOO_OPERATIONS") && (
        <FormFieldSelect
          formFieldName="facilityLogType"
          label="Facility Log Type"
          required={true}
          placeholder="Select a facility log type"
          valueLabelPair={[
            ["REPAIR_LOG", "Repair Log"],
            ["MAINTENANCE_LOG", "Maintenance Log"],
            ["OPERATION_LOG", "Operation Log"]
          ]}
          value={facilityLogType}
          setValue={setFacilityLogType}
          validateFunction={validateFacilityLogName}
        />
      )} */}

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

export default CreateNewFacilityLogForm;
