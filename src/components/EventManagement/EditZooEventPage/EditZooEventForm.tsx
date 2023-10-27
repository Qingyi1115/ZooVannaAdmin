import React, { useState, useEffect } from "react";
import * as Form from "@radix-ui/react-form";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Checkbox from "@radix-ui/react-checkbox";

import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";

import useApiFormData from "../../../hooks/useApiFormData";
import useApiJson from "../../../hooks/useApiJson";

import FormFieldInput from "../../FormFieldInput";
import FormFieldSelect from "../../FormFieldSelect";
import { ContinentEnum } from "../../../enums/ContinentEnum";
import { HiCheck } from "react-icons/hi";
import { BiomeEnum } from "../../../enums/BiomeEnum";
import FormFieldRadioGroup from "../../FormFieldRadioGroup";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

import { useNavigate } from "react-router-dom";
import Animal from "../../../models/Animal";

import {
  AcquisitionMethod,
  EventType,
  AnimalGrowthStage,
  AnimalSex,
  AnimalStatusType,
  EventTimingType,
  IdentifierType,
} from "../../../enums/Enumurated";

import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import Species from "../../../models/Species";

import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

import ZooEvent from "../../../models/ZooEvent";
import { Nullable } from "primereact/ts-helpers";
import { CheckIcon } from "lucide-react";

interface EditZooEventFormProps {
  curZooEvent: ZooEvent;
  refreshSeed: number;
  setRefreshSeed: React.Dispatch<React.SetStateAction<number>>;
}

function EditZooEventForm(props: EditZooEventFormProps) {
  const { curZooEvent, refreshSeed, setRefreshSeed } = props;

  const apiFormData = useApiFormData();
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  const zooEventId = curZooEvent.zooEventId;
  const [eventType, setEventType] = useState<string | undefined>(
    curZooEvent.eventType
  );
  const [updateFuture, setUpdateFuture] = useState<boolean>(false);
  const [eventName, setEventName] = useState<string>(curZooEvent.eventName);
  const [eventDescription, setEventDescription] = useState<string>(curZooEvent.eventDescription);
  const [eventStartDateTime, setEventStartDateTime] = useState<Nullable<Date>>(
    new Date(curZooEvent.eventStartDateTime)
  );
  const [eventEndDateTime, setEventEndDateTime] = useState<Nullable<Date>>(
    curZooEvent.eventEndDateTime
  );
  const [eventNotificationDate, setEventNotificationDate] = useState<Nullable<Date>>(
    curZooEvent.eventNotificationDate
  );
  const [eventTiming, setEventTiming] = useState<string | undefined>(
    curZooEvent.eventTiming?.toString()
  );
  const [eventDurationHrs, setEventDurationHrs] = useState<
    number | undefined
  >(curZooEvent.eventDurationHrs);
  const [requiredNumberOfKeeper, setRequiredNumberOfKeeper] = useState<
    number | undefined
  >(curZooEvent.requiredNumberOfKeeper);

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
          <div className="font-medium text-danger">* Please enter an event name!</div>
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
            * Please enter an event description!
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateDate(props: ValidityState) {
    if (props != undefined) {
      if (eventStartDateTime == null) {
        return (
          <div className="font-medium text-danger">
            * Please enter the date of the event
          </div>
        );
      }
    }
    // add any other cases here
    return null;
  }

  function validateEventTiming(props: ValidityState) {
    if (props != undefined) {
      if (eventTiming == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please select an event timing!
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateEventDurationHrs(props: ValidityState) {
    if (props != undefined) {
      if (eventDurationHrs == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please enter a duration
          </div>
        );
      } else if (eventDurationHrs <= 0) {
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

  function validateRequiredNumberOfKeeper(props: ValidityState) {
    if (props != undefined) {
      if (requiredNumberOfKeeper == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please enter the number of keepers required
          </div>
        );
      } else if (requiredNumberOfKeeper <= 0) {
        return (
          <div className="font-medium text-danger">
            * Number of keepers must be greater than 0
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

    let dateInMilliseconds = eventStartDateTime?.getTime();

    const updatedZooEvent = {
      zooEventId,
      eventType,
      eventName,
      eventDescription,
      date: dateInMilliseconds,
      eventTiming,
      eventDurationHrs,
    };

    try {


      if (updateFuture) {

        const data = {
          eventName: eventName,
          eventDescription: eventDescription,
          eventIsPublic: false,
          eventType: eventType,
          eventStartDateTime: dateInMilliseconds,
          requiredNumberOfKeeper: requiredNumberOfKeeper,

          eventDurationHrs: eventDurationHrs,
          eventTiming: eventTiming,

          eventNotificationDate: curZooEvent.eventNotificationDate,
          eventEndDateTime: curZooEvent?.eventEndDateTime,
        };

        const response = await apiJson.put(
          `http://localhost:3000/api/zooEvent/updateZooEventIncludeFuture/${curZooEvent?.zooEventId}`,
          data
        );
        // success
        toastShadcn({
          description: "Successfully updated event",
        });
        navigate(-1);
      } else {

        const zooEventDetails = {
          zooEventId: curZooEvent?.zooEventId,
          eventIsPublic: false,
          eventNotificationDate: curZooEvent.eventNotificationDate,
          eventEndDateTime: curZooEvent.eventEndDateTime,
          eventName: eventName,
          eventDescription: eventDescription,
          eventTiming: eventTiming,
          eventStartDateTime: eventStartDateTime,
          eventDurationHrs: eventDurationHrs,
          requiredNumberOfKeeper: requiredNumberOfKeeper
        };
        console.log(zooEventDetails);
        apiJson.put(
          `http://localhost:3000/api/zooEvent/updateZooEventSingle/${curZooEvent?.zooEventId}`,
          { zooEventDetails: zooEventDetails }
        ).then(res => {
          // success
          toastShadcn({
            description: "Successfully updated event",
          });
          navigate(-1);
        }).catch(error => {
          // got error
          toastShadcn({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description:
              "An error has occurred while updating event: \n" +
              error.message,
          });
        });
      }


    } catch (error: any) {
      // got error
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while updating event: \n" +
          error.message,
      });
    }
  };


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
              Edit Zoo Event
            </span>
            <Button disabled className="invisible">
              Back
            </Button>
          </div>
          <Separator />
          <span className="mt-4 self-center text-title-xl font-bold">
            {curZooEvent.eventName}
          </span>
        </div>

        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
          {/* Event Name */}
          <FormFieldInput
            type="text"
            formFieldName="eventName"
            label="Name"
            required={true}
            placeholder="Add an event title..."
            pattern={undefined}
            value={eventName}
            setValue={setEventName}
            validateFunction={validateEventName}
          />

        </div>

        {/* Event Type */}
        <div className="mb-1 block font-medium">
          Event Type<br /> <b>{eventType}</b>
        </div>

        {/* Event Description */}
        <Form.Field
          name="physicalDefiningCharacteristics"
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
              placeholder="Add an event description..."
            // className="bg-blackA5 shadow-blackA9 selection:color-white selection:bg-blackA9 box-border inline-flex w-full resize-none appearance-none items-center justify-center rounded-[4px] p-[10px] text-[15px] leading-none text-white shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
            />
          </Form.Control>
          <Form.ValidityState>{validateEventDescription}</Form.ValidityState>
        </Form.Field>
        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
          {!curZooEvent.eventIsPublic && (
            <FormFieldSelect
              formFieldName="eventTiming"
              label="Timing"
              required={true}
              placeholder="Select an event timing..."
              valueLabelPair={Object.keys(EventTimingType).map(
                (eventTimingTypeKey) => [
                  EventTimingType[
                    eventTimingTypeKey as keyof typeof EventTimingType
                  ].toString(),
                  EventTimingType[
                    eventTimingTypeKey as keyof typeof EventTimingType
                  ].toString(),
                ]
              )}
              value={eventTiming}
              setValue={setEventTiming}
              validateFunction={validateEventTiming}
            />
          )}

          {/* Duration in minutes */}
          <FormFieldInput
            type="number"
            formFieldName="eventDurationHrs"
            label={`Duration (minutes)`}
            required={true}
            pattern={undefined}
            placeholder="e.g., 8"
            value={eventDurationHrs}
            setValue={setEventDurationHrs}
            validateFunction={validateEventDurationHrs}
          />

          {/* Number of keepers required */}
          <FormFieldInput
            type="number"
            formFieldName="durationInMinutes"
            label={`Number of keepers required`}
            required={true}
            pattern={undefined}
            placeholder="e.g., 2"
            value={requiredNumberOfKeeper}
            setValue={setRequiredNumberOfKeeper}
            validateFunction={validateRequiredNumberOfKeeper}
          />

          {/* Start Date */}
          <Form.Field
            name="dateOfMeasure"
            id="dateField"
            className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
          >
            <Form.Label className="font-medium">{curZooEvent.eventIsPublic ? "Start Date" : "Date"}</Form.Label>
            <Form.Control
              className="hidden"
              type="text"
              value={eventStartDateTime?.toString()}
              required={true}
              onChange={() => null}
            ></Form.Control>

            {!curZooEvent.eventIsPublic && (
              <Calendar
                value={eventStartDateTime}
                className="w-fit"
                onChange={(e: any) => {
                  if (e && e.value !== undefined) {
                    setEventStartDateTime(e.value);

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
            )}

            {curZooEvent.eventIsPublic && (
              <Calendar
                showTime
                value={eventStartDateTime}
                className="w-fit"
                onChange={(e: any) => {
                  if (e && e.value !== undefined) {
                    setEventStartDateTime(e.value);

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
            )}
            <Form.ValidityState>{validateDate}</Form.ValidityState>
          </Form.Field>

          {/* Event Notification Date */}
          {curZooEvent.eventIsPublic && (
            <Form.Field
              name="eventNotificationDate"
              id="dateField"
              className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
            >
              <Form.Label className="font-medium">Event Notification Date</Form.Label>
              <Form.Control
                className="hidden"
                type="text"
                value={eventNotificationDate?.toString()}
                required={true}
                onChange={() => null}
              ></Form.Control>

              <Calendar
                value={eventNotificationDate}
                className="w-fit"
                onChange={(e: any) => {
                  if (e && e.value !== undefined) {
                    setEventStartDateTime(e.value);

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
          )}
        </div>

        {/* Update Future*/}
        <Form.Field
          name="updateFuture"
          id="updateFutureField"
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Label className="font-medium">Update this and future events?</Form.Label>
          <Form.Control
            className="hidden"
            type="text"
            value={updateFuture?.toString()}
            required={true}
            onChange={() => null}
          ></Form.Control>
          <Checkbox.Root
            className="flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-[4px] bg-white shadow outline-none focus:shadow-[0_0_0_2px_black]"
            id="c1"
            onCheckedChange={(event: boolean) => { setUpdateFuture(event) }}
          >
            <Checkbox.Indicator>
              <CheckIcon />
            </Checkbox.Indicator>
          </Checkbox.Root>
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

export default EditZooEventForm;
