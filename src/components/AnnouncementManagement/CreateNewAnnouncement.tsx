import React, { useState, useEffect } from "react";

import * as Form from "@radix-ui/react-form";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Checkbox from "@radix-ui/react-checkbox";

import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";

import useApiJson from "../../hooks/useApiJson";
import FormFieldInput from "../FormFieldInput";
import FormFieldSelect from "../FormFieldSelect";
import FormFieldRadioGroup from "../FormFieldRadioGroup";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import FormTextareaInput from "../FormTextareaInput";
import { min } from "date-fns";
import { start } from "repl";

function CreateNewAnnouncementForm() {
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isPublished, setPublished] = useState<boolean>(true);
  const [publishDate, setPublishDate] = useState<string | Date | Date[] | null>(
    null
  );
  const [scheduledStartPublish, setScheduledStartPublish] = useState<
    string | Date | Date[] | null
  >(null);
  const [scheduledEndPublish, setScheduledEndPublish] = useState<
    string | Date | Date[] | null
  >(null);

  const [formError, setFormError] = useState<string | null>(null);

  function validateTitle(props: ValidityState) {
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

  function validateContent(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter a content
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateScheduledStartPublish(props: ValidityState) {
    // console.log(props);
    if (props != undefined) {
      if (scheduledStartPublish !== null) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (scheduledStartPublish < today) {
          return "Start date cannot be before today"; // Validation error message
        }
      }
      return null;
    }
  }

  function validateScheduledEndPublish(props: ValidityState) {
    if (props != undefined) {
      if (scheduledStartPublish !== null && scheduledEndPublish !== null) {
        if (scheduledEndPublish < scheduledStartPublish) {
          return "End date must be after or equal to start date"; // Validation error message
        }
      }
      return null;
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Remember, your form must have enctype="multipart/form-data" for upload pictures
    e.preventDefault();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Set Singapore's time zone
    const singaporeTimeZone = "Asia/Singapore";

    function setToMidnightInSingapore(input: string | Date): Date {
      const date = input instanceof Date ? input : new Date(input);

      // Check if the input is a valid date
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date input");
      }

      const singaporeDate = new Date(
        date.toLocaleString("en-US", { timeZone: singaporeTimeZone })
      );
      singaporeDate.setHours(0, 0, 0, 0);
      return singaporeDate;
    }

    function setToBeforeMidnightInSingapore(input: string | Date): Date {
      const date = input instanceof Date ? input : new Date(input);

      // Check if the input is a valid date
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date input");
      }

      const singaporeDate = new Date(
        date.toLocaleString("en-US", { timeZone: singaporeTimeZone })
      );
      singaporeDate.setHours(23, 59, 59, 999);
      return singaporeDate;
    }

    let isoSingaporePublishDate;

    // Convert scheduledStartPublish and scheduledEndPublish to Singapore time
    if (typeof publishDate == "string" || publishDate instanceof Date) {
      const singaporePublishDate = setToMidnightInSingapore(publishDate);
      isoSingaporePublishDate = singaporePublishDate.toISOString();
    }

    let isoSingaporeScheduledStartPublish;

    // Convert scheduledStartPublish and scheduledEndPublish to Singapore time
    if (
      typeof scheduledStartPublish == "string" ||
      scheduledStartPublish instanceof Date
    ) {
      const singaporeScheduledStartPublish = setToMidnightInSingapore(
        scheduledStartPublish
      );
      isoSingaporeScheduledStartPublish =
        singaporeScheduledStartPublish.toISOString();
    }

    let isoSingaporeScheduledEndPublish;

    // Convert scheduledStartPublish and scheduledEndPublish to Singapore time
    if (
      typeof scheduledEndPublish == "string" ||
      scheduledEndPublish instanceof Date
    ) {
      const singaporeScheduledEndPublish =
        setToBeforeMidnightInSingapore(scheduledEndPublish);
      isoSingaporeScheduledEndPublish =
        singaporeScheduledEndPublish.toISOString();
    }

    const newAnnouncement = {
      title: title,
      content: content,
      isPublished: isPublished,
      scheduledStartPublish: scheduledStartPublish,
      scheduledEndPublish: scheduledEndPublish,
    };

    try {
      const responseJson = await apiJson.post(
        "http://localhost:3000/api/announcement/createAnnouncement",
        newAnnouncement
      );
      toastShadcn({
        description: "Successfully created new announcement!",
      });
      navigate("/announcement/viewallannouncement");
    } catch (error: any) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while creating new announcement: \n" +
          error.message,
      });
    }
    // handle success case or failurecase using apiJson
  }

  return (
    <div>
      <Form.Root
        className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        {/* Title Header and back button */}
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">
            <Button
              variant={"outline"}
              type="button"
              onClick={() => navigate(-1)}
              className=""
            >
              Back
            </Button>
            <span className="self-center text-title-xl font-bold">
              Create Announcement
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
          placeholder="e.g., Closure of Panda Enclosure on 17 Aug 2023"
          pattern={undefined}
          value={title}
          setValue={setTitle}
          validateFunction={validateTitle}
        />

        <FormTextareaInput
          formFieldName="content"
          label="Content"
          required={true}
          placeholder="Write the announcement content here"
          value={content}
          setValue={setContent}
          validateFunction={validateContent}
        />

        <div className="flex flex-col justify-start gap-6 lg:flex-row lg:gap-12">
          {/* Start Date */}
          <div className="card justify-content-centre flex flex-col">
            <div>Publish Date</div>
            <Calendar
              style={{ flexGrow: 1 }}
              value={scheduledStartPublish}
              onChange={(e: CalendarChangeEvent) => {
                if (e && e.value !== undefined) {
                  setScheduledStartPublish(e.value);
                }
              }}
            />
          </div>
          {/* End Date */}
          <div className="card justify-content-center flex flex-col">
            <div>End Date</div>
            <Calendar
              style={{ flexGrow: 1 }}
              value={scheduledEndPublish}
              onChange={(e: CalendarChangeEvent) => {
                if (e && e.value !== undefined) {
                  setScheduledEndPublish(e.value);
                }
              }}
            />
          </div>
        </div>

        <Form.Submit asChild>
          <button className="mt-10 h-12 w-2/3 self-center rounded-full border bg-primary text-lg text-whiten transition-all hover:bg-opacity-80">
            Create Announcement
          </button>
        </Form.Submit>
        {formError && (
          <div className="m-2 border-danger bg-red-100 p-2">{formError}</div>
        )}
      </Form.Root>
    </div>
  );
}

export default CreateNewAnnouncementForm;
