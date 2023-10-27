import React, { useEffect, useState } from "react";
import { DataView } from 'primereact/dataview';

import * as Form from "@radix-ui/react-form";
import FormFieldRadioGroup from "../../../../FormFieldRadioGroup";
import FormFieldInput from "../../../../FormFieldInput";
import FormFieldSelect from "../../../../FormFieldSelect";
import useApiJson from "../../../../../hooks/useApiJson";
import useApiFormData from "../../../../../hooks/useApiFormData";
import { useToast } from "@/components/ui/use-toast";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Facility from "../../../../../models/Facility";
import FacilityLog from "../../../../../models/FacilityLog";
import { useAuthContext } from "../../../../../hooks/useAuthContext";
import { Card } from "primereact/card";

interface CreateNewFacilityMaintenanceLogFormProps {
  // curFacility: Facility;
  curFacilityLog: FacilityLog;
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

function CreateNewFacilityMaintenanceLogForm(props: CreateNewFacilityMaintenanceLogFormProps) {
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();
  const { curFacilityLog } = props;

  const [facilityLogTitle, setFacilityLogTitle] = useState<string>(""); // text input
  const [facilityLogDetails, setFacilityLogDetails] = useState<string>(""); // text input
  const [facilityLogRemarks, setFacilityLogRemarks] = useState<string>(""); // text input
  const [facilityLogType, setFacilityLogType] = useState<string>(""); // text input
  const [facilityDateTime, setFacilityDateTime] = useState<string>(""); // text input
  const [facilityStaffName, setFacilityStaffName] = useState<string>(""); // text input

  const [title, setTitle] = useState<string>(""); // text input
  const [details, setDetails] = useState<string>(""); // text input
  const [remarks, setRemarks] = useState<string>("Repairs Complete"); // text input

  const [formError, setFormError] = useState<string | null>(null);
  const location = useLocation();
  const employee = useAuthContext().state.user?.employeeData;
  const [facilityLogList, setFacilityLogList] = useState<FacilityLog[]>([curFacilityLog]);

  useEffect(() => {
    setFacilityLogTitle(curFacilityLog.title)
    setFacilityLogDetails(curFacilityLog.details)
    setFacilityLogRemarks(curFacilityLog.remarks)
    setFacilityLogType(curFacilityLog.facilityLogType)
    setFacilityDateTime(curFacilityLog.dateTime ? "Date created: " + new Date(curFacilityLog.dateTime).toLocaleString() : "");
    setFacilityStaffName(curFacilityLog.staffName ? "Created by: " + curFacilityLog.staffName : "");
  }, [curFacilityLog])

  async function handleSubmit(e: any) {
    // Remember, your form must have enctype="multipart/form-data" for upload pictures
    e.preventDefault();

    const newFacilityLog = {
      title: title,
      details: details,
      remarks: remarks,
      facilityLogType: "MAINTENANCE_LOG",
      employeeIds: [employee?.employeeId]
    }
    console.log(curFacilityLog);
    
    try {
      const facilityLogJson = await apiJson.post(
        `http://localhost:3000/api/assetFacility/createFacilityLog/${curFacilityLog.inHouse.facility.facilityId}`,
        newFacilityLog);

      const completeMaintenanceJson = await apiJson.get(`http://localhost:3000/api/assetFacility/completeRepairTicket/${curFacilityLog.facilityLogId}`);
      // success
      toastShadcn({
        description: "Successfully created facility maintenance log",
      });
      navigate("/assetfacility/maintenance");
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

  const listItem = (facilityLog: FacilityLog) => {

    return (
      <div>
        <Card className="my-4 relative"
          title={facilityLogTitle}
          subTitle={<div>
            {facilityDateTime}
            <p></p>{facilityStaffName}
          </div>

          }>
          <div className="flex flex-col justify-left gap-6 lg:flex-row lg:gap-12">
            <div>
              <div className="text-xl font-bold text-900 indent-px">Details</div>
              <p>{facilityLogDetails}</p>
            </div>
            <Separator orientation="vertical" />
            <div>
              <div className="text-xl font-bold text-900 indent-px">Remarks</div>
              <p>{facilityLogRemarks}</p>
            </div>
            <div>
              <div className="text-xl font-bold text-900 indent-px">Log Type </div>
              {facilityLogType}
            </div>
          </div>

        </Card>
      </div >
    )
  }

  const itemTemplate = (facilityLog: FacilityLog) => {
    if (!facilityLog) {
      return;
    }
    return listItem(facilityLog);
  };

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
            Complete Facility Repairs
          </span>
          <Button disabled className="invisible">
            Back
          </Button>
        </div>
        <Separator />
      </div>

      <div>
        <div className="mb-1 block font-medium">Repair Ticket</div>
        <DataView
          value={facilityLogList}
          itemTemplate={itemTemplate}
          layout="list"
          dataKey="facilityLogId"
        />
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
  );
}

export default CreateNewFacilityMaintenanceLogForm;
