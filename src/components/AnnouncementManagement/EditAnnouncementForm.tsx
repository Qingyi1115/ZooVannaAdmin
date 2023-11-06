import * as Form from "@radix-ui/react-form";
import React, { useEffect, useState } from "react";


import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import { useNavigate } from "react-router-dom";
import useApiJson from "../../hooks/useApiJson";
import Announcement from "../../models/Announcement";
import FormFieldInput from "../FormFieldInput";
import FormFieldSelect from "../FormFieldSelect";
import FormTextareaInput from "../FormTextareaInput";

interface EditAnnouncementFormProps {
  currAnnouncement: Announcement;
  refreshSeed: number;
  setRefreshSeed: React.Dispatch<React.SetStateAction<number>>;
  status: string;
}

function EditAnnouncementForm(props: EditAnnouncementFormProps) {
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();

  const { currAnnouncement, refreshSeed, setRefreshSeed, status } = props;

  const [title, setTitle] = useState<string>(currAnnouncement.title);
  const [content, setContent] = useState<string>(currAnnouncement.content);
  const [isPublished, setIsPublished] = useState<string | undefined>(
    currAnnouncement.isPublished.toString()
  );
  const [scheduledStartPublish, setScheduledStartPublish] = useState<
    string | Date | Date[] | null
  >(new Date(currAnnouncement.scheduledStartPublish));
  const [scheduledEndPublish, setScheduledEndPublish] = useState<
    string | Date | Date[] | null
  >(new Date(currAnnouncement.scheduledEndPublish));

  const [formError, setFormError] = useState<string | null>(null);

  // field validations
  // function validateImage(props: ValidityState) {
  //   if (props != undefined) {
  //     if (props.valueMissing) {
  //       return (
  //         <div className="font-medium text-danger">
  //           * Please upload an image
  //         </div>
  //       );
  //     }
  //     // add any other cases here
  //   }
  //   return null;
  // }

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

  function validateIsPublished(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please select an announcement status
          </div>
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
          <div className="font-medium text-danger">* Please enter content</div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  // end field validations
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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

    try {
      let updatedAnnouncement = {
        title: title,
        content: content,
        isPublished: isPublished,
        scheduledStartPublish: isoSingaporeScheduledStartPublish,
        scheduledEndPublish: isoSingaporeScheduledEndPublish,
      };
      const responseJson = await apiJson.put(
        `http://localhost:3000/api/announcement/updateAnnouncement/${currAnnouncement.announcementId}`,
        updatedAnnouncement
      );
      // success
      console.log("success");
      toastShadcn({
        title: "Update successful",
        content: "Successfully edited announcement",
      });
      setRefreshSeed(refreshSeed + 1);
      navigate("/announcement/viewallannouncements");
    } catch (error: any) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        content:
          "An error has occurred while editing announcement details: \n" +
          error.message,
      });
    }
  }

  useEffect(() => {
    if (!apiJson.loading) {
      if (apiJson.error) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          content:
            "An error has occurred while editing announcement details: \n" +
            apiJson.error,
        });
      } else if (apiJson.result) {
        // success
        console.log("success?");
        toastShadcn({
          content: "Successfully edited announcement details:",
        });
      }
    }
  }, [apiJson.loading]);

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

        {status !== "EXPIRED" && (
          <FormFieldSelect
            formFieldName="isPublished"
            label="Announcement Status"
            required={true}
            placeholder="Select an announcement status"
            valueLabelPair={[
              [true.toString(), "Active"],
              [false.toString(), "Disabled"],
            ]}
            value={isPublished?.toString()}
            setValue={setIsPublished}
            validateFunction={validateIsPublished}
          />
        )}

        <Form.Submit asChild>
          <button className="mt-10 h-12 w-2/3 self-center rounded-full border bg-primary text-lg text-whiten transition-all hover:bg-opacity-80">
            Update Announcement
          </button>
        </Form.Submit>
        {formError && (
          <div className="m-2 border-danger bg-red-100 p-2">{formError}</div>
        )}
      </Form.Root>
    </div>
  );
}

export default EditAnnouncementForm;
