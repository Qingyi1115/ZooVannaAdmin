import React, { useState, useEffect } from "react";

import * as Form from "@radix-ui/react-form";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Checkbox from "@radix-ui/react-checkbox";

import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";

import useApiFormData from "../../../hooks/useApiFormData";
import FormFieldInput from "../../FormFieldInput";
import FormFieldSelect from "../../FormFieldSelect";
import { HiCheck } from "react-icons/hi";

import useApiJson from "../../../hooks/useApiJson";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { NavLink } from "react-router-dom";
import {
  AcquisitionMethod,
  ActivityType,
  AnimalGrowthStage,
  AnimalSex,
  AnimalStatusType,
  EventTimingType,
  IdentifierType,
} from "../../../enums/Enumurated";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import Species from "../../../models/Species";

import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Nullable } from "primereact/ts-helpers";
import Employee from "../../../models/Employee";

interface CreateLeaveEventFormProps {
  curEmployee: Employee;
  refreshSeed: number;
  setRefreshSeed: React.Dispatch<React.SetStateAction<number>>;
}

function CreateLeaveEventForm(props: CreateLeaveEventFormProps) {
  const apiFormData = useApiFormData();
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;
  const { curEmployee, refreshSeed, setRefreshSeed } = props;

  const [activityType, setActivityType] = useState<string | undefined>(
    undefined
  );
  const [eventName, setEventName] = useState<string>("");
  const [eventDescription, setEventDescription] = useState<string>("");
  const [leaveDates, setLeaveDates] = useState<Date[]>([]);
  const [session, setSession] = useState<string | undefined>(undefined);
  const [durationInMinutes, setDurationInMinutes] = useState<
    number | undefined
  >(undefined);

  // validate functions

  function validateEventName(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">* Please enter a title</div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateEventDescription(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter a valid reason
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateDate(props: ValidityState) {
    if (props != undefined) {
      if (leaveDates == null) {
        return (
          <div className="font-medium text-danger">
            * Please enter the leave dates
          </div>
        );
      }
    }
    // add any other cases here
    return null;
  }

  function validateDurationInMinutes(props: ValidityState) {
    if (props != undefined) {
      if (durationInMinutes == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please enter a duration
          </div>
        );
      } else if (durationInMinutes <= 0) {
        return (
          <div className="font-medium text-danger">
            * Duration must be greater than 0
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  // end validate functions

  // handle submit
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newLeaveEvent = {
      eventName,
      eventDescription,
      eventStartDate: leaveDates[0].getTime(),
      eventEndDate: leaveDates[1].getTime()
    };

    const createLeaveEventApi = async () => {
      try {
        const response = await apiJson.put(
          `http://localhost:3000/api/zooevent/createEmployeeAbsence/${curEmployee.employeeId}`,
          newLeaveEvent
        );
        // success
        toastShadcn({
          description: "Successfully recorded leave!",
        });
        navigate(-1);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while recording leave: \n" +
            error.message,
        });
      }
    };
    createLeaveEventApi();
  }

  return (
    <div>
      <Form.Root
        className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
        onSubmit={handleSubmit}
      // encType="multipart/form-data"
      >
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">
            <Button
              onClick={() => navigate(-1)}
              variant={"outline"}
              type="button"
              className=""
            >
              Back
            </Button>
            <span className="self-center text-lg text-graydark">
              Record Leave
            </span>
            <Button disabled className="invisible">
              Back
            </Button>
          </div>
          <Separator />
          <span className="mt-4 self-center text-title-xl font-bold">
            {curEmployee.employeeName}
          </span>
        </div>

        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
          {/* Event Name */}
          <FormFieldInput
            type="text"
            formFieldName="eventName"
            label="Title"
            required={true}
            placeholder=""
            pattern={undefined}
            value={eventName}
            setValue={setEventName}
            validateFunction={validateEventName}
          />
        </div>
        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
          {/* Start Date */}
          <Form.Field
            name="dateOfMeasure"
            id="dateField"
            className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
          >
            <Form.Label className="font-medium">Leave Dates</Form.Label>
            <Form.Control
              className="hidden"
              type="text"
              value={leaveDates?.toString()}
              required={true}
              onChange={() => null}
            ></Form.Control>
            <Calendar
              selectionMode="range"
              value={leaveDates}
              className="w-fit"
              onChange={(e: any) => {
                if (e && e.value !== undefined) {
                  setLeaveDates(e.value);

                  const element = document.getElementById("dateField");
                  if (element) {
                    const isDataInvalid = element.getAttribute("data-invalid");
                    if (isDataInvalid == "true") {
                      element.setAttribute("data-valid", "true");
                      element.removeAttribute("data-invalid");
                    }
                  }
                }
              }}
            />
            <Form.ValidityState>{validateDate}</Form.ValidityState>
          </Form.Field>
        </div>
        {/* Event Description */}
        <Form.Field
          name="eventDescription"
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Label className="font-medium">Reason</Form.Label>
          <Form.Control
            asChild
            value={eventDescription}
            required={true}
            onChange={(e) => setEventDescription(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium shadow-md outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          >
            <textarea
              rows={3}
              placeholder="Sick, Maternity, Family Emergency etc..."
            />
          </Form.Control>
          <Form.ValidityState>{validateEventDescription}</Form.ValidityState>
        </Form.Field>



        <Form.Submit asChild>
          <Button
            disabled={apiJson.loading}
            className="h-12 w-2/3 self-center rounded-full text-lg"
          >
            {!apiJson.loading ? <div>Submit</div> : <div>Loading</div>}
          </Button>
        </Form.Submit>
      </Form.Root>
    </div>
  );
}

export default CreateLeaveEventForm;
