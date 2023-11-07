import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import * as Form from "@radix-ui/react-form";
import { Calendar } from "primereact/calendar";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  EventType,
} from "../../../enums/Enumurated";
import useApiFormData from "../../../hooks/useApiFormData";
import useApiJson from "../../../hooks/useApiJson";
import FormFieldInput from "../../FormFieldInput";
import FormFieldSelect from "../../FormFieldSelect";

import { Nullable } from "primereact/ts-helpers";
import beautifyText from "../../../hooks/beautifyText";

function CreatePublicZooEventForm() {
  const apiFormData = useApiFormData();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  const [eventType, setEventType] = useState<string | undefined>(
    undefined
  );
  const [eventName, setEventName] = useState<string>("");
  const [eventDescription, setEventDescription] = useState<string>("");
  const [eventDates, setEventDates] = useState<Date[]>([]);
  const [eventNotificationDate, setEventNotificationDate] = useState<Nullable<Date>>(null);

  // validate functions
  function validateIdentifierType(props: ValidityState) {
    if (props != undefined) {
      if (eventType == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please select an activity type!
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateEventName(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">* Please enter an event name</div>
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
            * Please enter an event description
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }


  function validateEventDates(props: ValidityState) {
    if (props != undefined) {
      if (eventDates == null) {
        return (
          <div className="font-medium text-danger">
            * Please enter the date range of event
          </div>
        );
      }
    }
    // add any other cases here
    return null;
  }

  function validateEventNotificationDate(props: ValidityState) {
    if (props != undefined) {
      if (eventNotificationDate == null) {
        return (
          <div className="font-medium text-danger">
            * Please enter the notification date of the event
          </div>
        );
      }
      if (eventNotificationDate > eventDates[0]) {
        return (
          <div className="font-medium text-danger">
            * Event notification date cannot be after the event start date
          </div>
        );
      }
    }
    // add any other cases here
    return null;
  }

  function validateImage(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please upload an image
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  // end validate functions

  // Zoo event image
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files && event.target.files[0];
    setImageFile(file);
  }

  // handle submit
  const dummyValidityState: ValidityState = {
    customError: false,
    patternMismatch: false,
    rangeOverflow: false,
    rangeUnderflow: false,
    stepMismatch: false,
    tooLong: false,
    tooShort: false,
    typeMismatch: false,
    valid: true,
    valueMissing: false,
    badInput: false,
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // let dateInMilliseconds = date?.getTime();

    const newPublicZooEvent = {
      eventIsPublic: true,
      eventNotificationDate: eventNotificationDate,
      eventStartDateTime: eventDates[0].getTime(),
      eventEndDateTime: eventDates[1].getTime(),
      eventName: eventName,
      eventDescription: eventDescription
    };

    const createPublicZooEventApi = async () => {
      try {
        const response = await apiJson.post(
          "http://localhost:3000/api/zooEvent/createPublicZooEvent",
          newPublicZooEvent
        );
        // success
        toastShadcn({
          description: "Successfully created a new public event!",
        });
        navigate(-1);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while creating new public event: \n" +
            error.message,
        });
      }
    };
    createPublicZooEventApi();
  }

  return (
    <div>
      <Form.Root
        className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
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
            <span className="mt-4 self-center text-title-xl font-bold">
              Create Public Event
            </span>
            <Button disabled className="invisible">
              Back
            </Button>
          </div>
          <Separator />
        </div>

        {/* Zoo Event Picture */}
        <Form.Field
          name="zooEventImage"
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Label className="font-medium">
            Zoo Event Image
          </Form.Label>
          <Form.Control
            type="file"
            required
            accept=".png, .jpg, .jpeg, .webp"
            onChange={handleFileChange}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          />
          <Form.ValidityState>{validateImage}</Form.ValidityState>
        </Form.Field>

        {/* Title */}
        <FormFieldInput
          type="text"
          formFieldName="eventName"
          label="Title"
          required={true}
          placeholder="Event title"
          pattern={undefined}
          value={eventName}
          setValue={setEventName}
          validateFunction={validateEventName}
        />

        {/* Event Type */}
        <FormFieldSelect
          formFieldName="eventType"
          label="Event Type"
          required={true}
          placeholder="Select an event type..."
          valueLabelPair={Object.keys(EventType).map((activiTypeKey) => [
            EventType[
              activiTypeKey as keyof typeof EventType
            ].toString(),
            beautifyText(EventType[
              activiTypeKey as keyof typeof EventType
            ]),
          ])}
          value={eventType}
          setValue={setEventType}
          validateFunction={validateIdentifierType}
        />

        {/* Event Description */}
        <Form.Field
          name="eventDescription"
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Label className="font-medium">Description</Form.Label>
          <Form.Control
            asChild
            value={eventDescription}
            required={true}
            onChange={(e) => setEventDescription(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium shadow-md outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          >
            <textarea
              rows={3}
              placeholder="Event description"
            // className="bg-blackA5 shadow-blackA9 selection:color-white selection:bg-blackA9 box-border inline-flex w-full resize-none appearance-none items-center justify-center rounded-[4px] p-[10px] text-[15px] leading-none text-white shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
            />
          </Form.Control>
          <Form.ValidityState>{validateEventDescription}</Form.ValidityState>
        </Form.Field>

        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">

          {/* Event Dates */}
          <Form.Field
            name="eventDates"
            id="eventDatesDateField"
            className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
          >
            <Form.Label className="font-medium">
              Event Dates
            </Form.Label>
            <Form.Control
              className="hidden"
              type="text"
              value={eventDates?.toString()}
              required={true}
              onChange={() => null}
            ></Form.Control>
            <Calendar
              selectionMode="range"
              value={eventDates}
              className="w-full"
              onChange={(e: any) => {
                if (e && e.value !== undefined) {
                  setEventDates(e.value);
                  const element =
                    document.getElementById("eventDatesDateField");
                  if (element) {
                    const isDataInvalid =
                      element.getAttribute("data-invalid");
                    if (isDataInvalid == "true") {
                      element.setAttribute("data-valid", "true");
                      element.removeAttribute("data-invalid");
                    }
                  }
                }
              }}
            />
            <Form.ValidityState>{validateEventDates}</Form.ValidityState>
          </Form.Field>

          {/* Event Notification Date */}
          <Form.Field
            name="eventNotificationDate"
            id="eventNotificationDateField"
            className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
          >
            <Form.Label className="font-medium">
              Event Notification Date
            </Form.Label>
            <Form.Control
              className="hidden"
              type="text"
              value={eventNotificationDate?.toString()}
              required={true}
              onChange={() => null}
            ></Form.Control>
            <Calendar
              value={eventNotificationDate}
              className="w-full"
              onChange={(e: any) => {
                if (e && e.value !== undefined) {
                  setEventDates(e.value);
                  const element =
                    document.getElementById("eventNotificationDateField");
                  if (element) {
                    const isDataInvalid =
                      element.getAttribute("data-invalid");
                    if (isDataInvalid == "true") {
                      element.setAttribute("data-valid", "true");
                      element.removeAttribute("data-invalid");
                    }
                  }
                }
              }}
            />
            <Form.ValidityState>{validateEventDates}</Form.ValidityState>
          </Form.Field>
        </div>

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

export default CreatePublicZooEventForm;
