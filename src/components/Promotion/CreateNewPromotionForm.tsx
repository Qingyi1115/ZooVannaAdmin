import React, { useState } from "react";

import * as Form from "@radix-ui/react-form";


import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import useApiFormData from "../../hooks/useApiFormData";
import FormFieldInput from "../FormFieldInput";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import FormTextareaInput from "../FormTextareaInput";

function CreateNewPromotionForm() {
  const apiFormData = useApiFormData();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [publishDate, setPublishDate] = useState<string | Date | Date[] | null>(
    null
  );
  const [startDate, setStartDate] = useState<string | Date | Date[] | null>(
    null
  );
  const [endDate, setEndDate] = useState<string | Date | Date[] | null>(null);
  const [percentage, setPercentage] = useState<number>(0);
  const [minimumSpending, setMinimumSpending] = useState<number>(0);
  const [promotionCode, setPromotionCode] = useState<string>("");
  const [maxRedeemNum, setMaxRedeemNum] = useState<number>(0);

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formError, setFormError] = useState<string | null>(null);

  const [newPromotionCreated, setNewPromotionCreated] =
    useState<boolean>(false);

  // field validations
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

  function validateDescription(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter a description
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  // Alias name is nullable

  function validateStartDate(props: ValidityState) {
    // console.log(props);
    if (props != undefined) {
      if (startDate !== null) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (startDate < today) {
          return "Start date cannot be before today"; // Validation error message
        }
      }
      return null;
    }
  }

  function validateEndDate(props: ValidityState) {
    if (props != undefined) {
      if (startDate !== null && endDate !== null) {
        if (endDate < startDate) {
          return "End date must be after or equal to start date"; // Validation error message
        }
      }
      return null;
    }
  }

  function validatePercentage(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter percentage value
          </div>
        );
        // } else if (props.patternMismatch) {
        //   return (
        //     <div className="font-medium text-danger">
        //       * Please enter only number
        //     </div>
        //   );
      } else if (percentage <= 0) {
        return (
          <div className="font-medium text-danger">
            * Discount must be greater than 0%
          </div>
        );
      } else if (percentage > 100) {
        return (
          <div className="font-medium text-danger">
            * Discount cannot be more than 100%
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateMinimumSpending(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter minimum spending
          </div>
        );
        // } else if (props.patternMismatch) {
        //   return (
        //     <div className="font-medium text-danger">
        //       * Please enter only number
        //     </div>
        //   );
      } else if (minimumSpending <= 0) {
        return (
          <div className="font-medium text-danger">
            * Minimum spending must be greater than 0
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validatePromotionCode(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter a promotion code
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateMaxRedeemNum(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">* Please enter a value</div>
        );
      } else if (props.patternMismatch) {
        return (
          <div className="font-medium text-danger">
            * Please enter only number
          </div>
        );
      } else if (maxRedeemNum <= 0) {
        return (
          <div className="font-medium text-danger">
            * Maximum number of promotion redemption must be greater than 0
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files && event.target.files[0];
    setImageFile(file);
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

    // Convert startDate and endDate to Singapore time
    if (typeof publishDate == "string" || publishDate instanceof Date) {
      const singaporePublishDate = setToMidnightInSingapore(publishDate);
      isoSingaporePublishDate = singaporePublishDate.toISOString();
    }

    let isoSingaporeStartDate;

    // Convert startDate and endDate to Singapore time
    if (typeof startDate == "string" || startDate instanceof Date) {
      const singaporeStartDate = setToMidnightInSingapore(startDate);
      isoSingaporeStartDate = singaporeStartDate.toISOString();
    }

    let isoSingaporeEndDate;

    // Convert startDate and endDate to Singapore time
    if (typeof endDate == "string" || endDate instanceof Date) {
      const singaporeEndDate = setToBeforeMidnightInSingapore(endDate);
      isoSingaporeEndDate = singaporeEndDate.toISOString();
    }

    // let isoStartDate;

    // if (startDate !== null) {
    //   if (typeof startDate === 'string') {
    //     // If startDate is a string, parse it to a Date object
    //     const jsStartDate = new Date(startDate);
    //     isoStartDate = jsStartDate.toISOString();
    //   } else if (startDate instanceof Date) {
    //     // If startDate is already a Date object, convert it directly to ISO string
    //     isoStartDate = startDate.toISOString();
    //   }
    // }

    // let isoEndDate;

    // if (endDate !== null) {
    //   if (typeof endDate === 'string') {
    //     // If startDate is a string, parse it to a Date object
    //     const jsEndDate = new Date(endDate);
    //     isoEndDate = jsEndDate.toISOString();
    //   } else if (endDate instanceof Date) {
    //     // If startDate is already a Date object, convert it directly to ISO string
    //     isoEndDate = endDate.toISOString();
    //   }
    // }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append(
      "publishDate",
      isoSingaporePublishDate ? isoSingaporePublishDate : today.toISOString()
    );
    formData.append(
      "startDate",
      isoSingaporeStartDate ? isoSingaporeStartDate : today.toISOString()
    );
    formData.append(
      "endDate",
      isoSingaporeEndDate ? isoSingaporeEndDate : today.toISOString()
    );
    formData.append("percentage", percentage.toString());
    formData.append("minimumSpending", minimumSpending.toString());
    formData.append("promotionCode", promotionCode);
    formData.append("maxRedeemNum", maxRedeemNum.toString());
    formData.append("file", imageFile || "");

    const createPromotion = async () => {
      try {
        const response = await apiFormData.post(
          "http://localhost:3000/api/promotion/createPromotion",
          formData
        );
        // success
        console.log("create promo success");
        toastShadcn({
          description: "Successfully created a new promotion:",
        });

        // clearForm();
        setNewPromotionCreated(true);
        navigate("/promotion/viewallpromotions");
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while creating a new promotion: \n" +
            error.message,
        });
      }
    };
    createPromotion();
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
              Create Promotion
            </span>
            <Button disabled className="invisible">
              Back
            </Button>
          </div>
          <Separator />
        </div>
        {/* Promotion Picture */}
        <Form.Field
          name="promotionImage"
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Label className="font-medium">Promotion Image</Form.Label>
          <Form.Control
            type="file"
            required
            asChild
            // accept=".png, .jpg, .jpeg, .webp"
            // onChange={handleFileChange}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          >
            <input
              type="file"
              id="promotionImage"
              accept=".jpeg, .png, .jpg ,.webp"
              onChange={handleFileChange}
            />
          </Form.Control>
          <Form.ValidityState>{validateImage}</Form.ValidityState>
        </Form.Field>

        {/* Title */}
        <FormFieldInput
          type="text"
          formFieldName="title"
          label="Title"
          required={true}
          placeholder="e.g., Birthday Sale"
          pattern={undefined}
          value={title}
          setValue={setTitle}
          validateFunction={validateTitle}
        />

        {/* Description */}
        {/* <FormFieldInput
            type="text"
            formFieldName="description"
            label="Description"
            required={true}
            placeholder="Describe the promotion, validity period, terms and conditions here"
            pattern={undefined}
            value={description}
            setValue={setDescription}
            validateFunction={validateDescription}
          /> */}

        <FormTextareaInput
          formFieldName="description"
          label="Description"
          required={true}
          placeholder="Describe the promotion, terms and conditions here"
          value={description}
          setValue={setDescription}
          validateFunction={validateDescription}
        />

        <div className="card justify-content-centre flex flex-col">
          <div>Publish Date</div>
          <Calendar
            style={{ flexGrow: 1 }}
            value={publishDate}
            onChange={(e: CalendarChangeEvent) => {
              if (e && e.value !== undefined) {
                setPublishDate(e.value);
              }
            }}
          />
        </div>

        <div className="flex flex-col justify-start gap-6 lg:flex-row lg:gap-12">
          {/* Start Date */}
          <div className="card justify-content-centre flex flex-col">
            <div>Start Date</div>
            <Calendar
              style={{ flexGrow: 1 }}
              value={startDate}
              onChange={(e: CalendarChangeEvent) => {
                if (e && e.value !== undefined) {
                  setStartDate(e.value);
                }
              }}
            />
          </div>
          {/* End Date */}
          <div className="card justify-content-center flex flex-col">
            <div>End Date</div>
            <Calendar
              style={{ flexGrow: 1 }}
              value={endDate}
              onChange={(e: CalendarChangeEvent) => {
                if (e && e.value !== undefined) {
                  setEndDate(e.value);
                }
              }}
            />
          </div>
        </div>

        {/* <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12"> */}
        {/* Percentage */}
        <FormFieldInput
          type="number"
          formFieldName="percentage"
          label="Discount (%)"
          required={true}
          placeholder="e.g. 20"
          pattern={undefined}
          value={percentage}
          setValue={setPercentage}
          validateFunction={validatePercentage}
        />
        {/* Minimum Spending */}
        <FormFieldInput
          type="number"
          formFieldName="minimumSpending"
          label="Minimum Spending ($)"
          required={true}
          placeholder="Enter minimum spending for this promotion to be eligible"
          pattern={undefined}
          value={minimumSpending}
          setValue={setMinimumSpending}
          validateFunction={validateMinimumSpending}
        />
        {/* </div> */}

        {/* <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12"> */}
        {/* Promo code */}
        <FormFieldInput
          type="text"
          formFieldName="promotionCode"
          label="Promotion Code"
          required={true}
          placeholder="e.g. ZOOVANNABIRTHDAY"
          pattern={undefined}
          value={promotionCode}
          setValue={setPromotionCode}
          validateFunction={validatePromotionCode}
        />
        {/* Maximum Redemption Number */}
        <FormFieldInput
          type="number"
          formFieldName="maxRedeemNum"
          label="Maximum Redemption Number"
          required={true}
          placeholder="Enter maximum total number of redemption for this promotion"
          pattern={undefined}
          value={maxRedeemNum}
          setValue={setMaxRedeemNum}
          validateFunction={validateMaxRedeemNum}
        />
        {/* </div> */}

        <Form.Submit asChild>
          <Button
            disabled={apiFormData.loading}
            className="h-12 w-2/3 self-center rounded-full text-lg"
          >
            {!apiFormData.loading ? <div>Submit</div> : <div>Loading</div>}
          </Button>
        </Form.Submit>
      </Form.Root>
    </div>
  );
}

export default CreateNewPromotionForm;
