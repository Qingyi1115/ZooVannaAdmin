import React, { useState, useEffect, useRef } from "react";
import FeedingPlan from "../../../models/FeedingPlan";

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
  ActivityType,
  AnimalGrowthStage,
  AnimalSex,
  AnimalStatusType,
  DayOfWeek,
  EventTimingType,
  IdentifierType,
  RecurringPattern,
} from "../../../enums/Enumurated";

import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import Species from "../../../models/Species";

import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

import { Nullable } from "primereact/ts-helpers";

interface EditFeedingPlanBasicInfoFormProps {
  curFeedingPlan: FeedingPlan;
  setCurFeedingPlan: any;
  refreshSeed: number;
  setRefreshSeed: React.Dispatch<React.SetStateAction<number>>;
}

function EditFeedingPlanBasicInfoForm(
  props: EditFeedingPlanBasicInfoFormProps
) {
  const apiFormData = useApiFormData();
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  const { curFeedingPlan, setCurFeedingPlan, refreshSeed, setRefreshSeed } =
    props;
  const [feedingPlanDesc, setFeedingPlanDesc] = useState<string>(
    curFeedingPlan.feedingPlanDesc
  );
  const [startDate, setStartDate] = useState<Nullable<Date>>(
    new Date(curFeedingPlan.startDate)
  );
  const [endDate, setEndDate] = useState<Nullable<Date>>(
    new Date(curFeedingPlan.endDate)
  );

  const feedingPlanId = curFeedingPlan.feedingPlanId;

  // validate
  function validateFeedingPlanDescrtipion(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter feeding plan description!
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateStartDate(props: ValidityState) {
    if (props != undefined) {
      if (startDate == null) {
        return (
          <div className="font-medium text-danger">
            * Please enter the start date of the period for the recurring
            activity
          </div>
        );
      }
    }

    if (
      startDate != null &&
      endDate != null &&
      new Date(startDate) > new Date(endDate)
    ) {
      return (
        <div className="font-medium text-danger">
          * Start Date must not be after End Date
        </div>
      );
    }
    // add any other cases here
    return null;
  }

  function validateEndDate(props: ValidityState) {
    if (props != undefined) {
      if (endDate == null) {
        return (
          <div className="font-medium text-danger">
            * Please enter the end date of the period for the recurring activity
          </div>
        );
      }
    }

    if (
      endDate != null &&
      startDate != null &&
      new Date(startDate) > new Date(endDate)
    ) {
      return (
        <div className="font-medium text-danger">
          * End Date must not be before Start Date
        </div>
      );
    }
    // add any other cases here
    return null;
  }

  /// end validate functions

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // let dateInMilliseconds = date?.getTime();
    if (!curFeedingPlan.animals) {
      return;
    }

    const animalCodes = curFeedingPlan.animals.map((animal) => {
      return animal.animalCode;
    });

    const updatedFeedingPlan = {
      feedingPlanId,
      feedingPlanDesc,
      startDate,
      endDate,
      title: curFeedingPlan.title,
      animalCodes,
    };

    console.log("sjhkbdnfma");
    console.log(updatedFeedingPlan);

    const updateFeedingPlanApi = async () => {
      try {
        const response = await apiJson.put(
          "http://localhost:3000/api/animal/updateFeedingPlan",
          updatedFeedingPlan
        );
        // success
        toastShadcn({
          description: "Successfully updated feeding plan",
        });
        const redirectUrl = `/animal/viewfeedingplandetails/${feedingPlanId}`;
        navigate(redirectUrl);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while updating feeding plan: \n" +
            error.message,
        });
      }
    };
    updateFeedingPlanApi();
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
            {/* <NavLink className="flex" to={`/animal/viewallanimals`}> */}
            <Button
              onClick={() => navigate(-1)}
              variant={"outline"}
              type="button"
              className=""
            >
              Back
            </Button>
            {/* </NavLink> */}
            <span className="self-center text-title-xl font-bold">
              Update Feeding Plan
            </span>
            <Button disabled className="invisible">
              Back
            </Button>
          </div>
          <Separator />
        </div>

        {/* body */}
        {/* Description */}
        <Form.Field
          name="physicalDefiningCharacteristics"
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Label className="font-medium">Details</Form.Label>
          <Form.Control
            asChild
            value={feedingPlanDesc}
            required={true}
            onChange={(e) => setFeedingPlanDesc(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium shadow-md outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          >
            <textarea
              rows={3}
              placeholder="e.g., General plan in Summer..."
              // className="bg-blackA5 shadow-blackA9 selection:color-white selection:bg-blackA9 box-border inline-flex w-full resize-none appearance-none items-center justify-center rounded-[4px] p-[10px] text-[15px] leading-none text-white shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
            />
          </Form.Control>
          <Form.ValidityState>
            {validateFeedingPlanDescrtipion}
          </Form.ValidityState>
        </Form.Field>

        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
          {/* Start Date */}
          <Form.Field
            name="startDate"
            id="startDateField"
            className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
          >
            <Form.Label className="font-medium">
              Applicable Period Start Date
            </Form.Label>
            <Form.Control
              className="hidden"
              type="text"
              value={startDate?.toString()}
              required={true}
              onChange={() => null}
            ></Form.Control>
            <Calendar
              value={startDate}
              className="w-full"
              onChange={(e: any) => {
                if (e && e.value !== undefined) {
                  setStartDate(e.value);
                  const element = document.getElementById("startDateField");
                  if (element) {
                    if (
                      startDate != null &&
                      endDate != null &&
                      new Date(startDate) > new Date(endDate)
                    ) {
                      const isDataInvalid =
                        element.getAttribute("data-invalid");
                      if (isDataInvalid == "true") {
                        element.setAttribute("data-valid", "true");
                        element.removeAttribute("data-invalid");
                      }
                    }
                  }
                }
              }}
            />
            <Form.ValidityState>{validateStartDate}</Form.ValidityState>
          </Form.Field>

          {/* End Date */}
          <Form.Field
            name="endDate"
            id="endDateField"
            className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
          >
            <Form.Label className="font-medium">
              Applicable Period End Date
            </Form.Label>
            <Form.Control
              className="hidden"
              type="text"
              value={endDate?.toString()}
              required={true}
              onChange={() => null}
            ></Form.Control>
            <Calendar
              value={endDate}
              className="w-full"
              onChange={(e: any) => {
                if (e && e.value !== undefined) {
                  setEndDate(e.value);
                  if (
                    startDate != null &&
                    endDate != null &&
                    new Date(startDate) > new Date(endDate)
                  ) {
                    const element = document.getElementById("endDateField");
                    if (element) {
                      const isDataInvalid =
                        element.getAttribute("data-invalid");
                      if (isDataInvalid == "true") {
                        element.setAttribute("data-valid", "true");
                        element.removeAttribute("data-invalid");
                      }
                    }
                  }
                }
              }}
            />
            <Form.ValidityState>{validateEndDate}</Form.ValidityState>
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

export default EditFeedingPlanBasicInfoForm;
