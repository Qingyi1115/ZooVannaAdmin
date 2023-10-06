import React, { useState, useEffect } from "react";
import * as Form from "@radix-ui/react-form";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Checkbox from "@radix-ui/react-checkbox";

import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import useApiJson from "../../hooks/useApiJson";
import Promotion from "../../models/Promotion";
import useApiFormData from "../../hooks/useApiFormData";
import FormFieldInput from "../FormFieldInput";
import FormFieldSelect from "../FormFieldSelect";
import FormFieldRadioGroup from "../FormFieldRadioGroup";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import FormTextareaInput from "../FormTextareaInput";

interface EditPromotionFormProps {
  curPromotion: Promotion;
  refreshSeed: number;
  setRefreshSeed: React.Dispatch<React.SetStateAction<number>>;
}

function EditPromotionForm(props: EditPromotionFormProps) {
  const apiFormData = useApiFormData();
  const navigate = useNavigate();
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;

  const { curPromotion, refreshSeed, setRefreshSeed } = props;

  const [promotionId, setPromotionId] = useState<number>(
    curPromotion.promotionId
  );
  const [title, setTitle] = useState<string>(curPromotion.title);
  const [description, setDescription] = useState<string>(
    curPromotion.description
  );
  const [publishDate, setPublishDate] = useState<string | Date | Date[] | null>(
    new Date(curPromotion.publishDate)
  );
  const [startDate, setStartDate] = useState<string | Date | Date[] | null>(
    new Date(curPromotion.startDate)
  );
  const [endDate, setEndDate] = useState<string | Date | Date[] | null>(
    new Date(curPromotion.endDate)
  );
  const [percentage, setPercentage] = useState<number>(curPromotion.percentage);
  const [minimumSpending, setMinimumSpending] = useState<number>(
    curPromotion.minimumSpending
  );
  const [promotionCode, setPromotionCode] = useState<string>(
    curPromotion.promotionCode
  );
  const [maxRedeemNum, setMaxRedeemNum] = useState<number>(
    curPromotion.maxRedeemNum
  );
  const [currentRedeemNum, setCurrentRedeemNum] = useState<number>(
    curPromotion.currentRedeemNum
  );
  const [imageUrl, setImageUrl] = useState<string | null>(
    curPromotion.imageUrl
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

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

    if (imageFile) {
      const formData = new FormData();
      formData.append("promotionId", curPromotion.promotionId.toString());
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
      formData.append("currentRedeemNum", currentRedeemNum.toString());
      formData.append("file", imageFile || "");

      try {
        const responseJson = await apiFormData.put(
          `http://localhost:3000/api/promotion/updatePromotion/${curPromotion.promotionId}`,
          formData
        );
        // success
        toastShadcn({
          description: "Successfully edited promotion",
        });
        setRefreshSeed(refreshSeed + 1);
        const redirectUrl = `/promotion/viewpromotion/${curPromotion.promotionId}`;
        navigate(redirectUrl);
      } catch (error: any) {
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while editing promotion details: \n" +
            error.message,
        });
      }
    } else {
      // no image

      const updatedPromotion = {
        title: title,
        description: description,
        publishDate: isoSingaporePublishDate,
        startDate: isoSingaporeStartDate,
        endDate: isoSingaporeEndDate,
        percentage: percentage,
        minimumSpending: minimumSpending,
        promotionCode: promotionCode,
        maxRedeemNum: maxRedeemNum,
        currentRedeemNum: currentRedeemNum,
        imageUrl: imageUrl,
      };

      try {
        const responseJson = await apiJson.put(
          `http://localhost:3000/api/promotion/updatePromotion/${curPromotion.promotionId}`,
          updatedPromotion
        );
        // success
        toastShadcn({
          description: "Successfully edited promotion",
        });
        setRefreshSeed(refreshSeed + 1);
        const redirectUrl = `/promotion/viewpromotion/${curPromotion.promotionId}`;
        navigate(redirectUrl);
      } catch (error: any) {
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while editing promotion details: \n" +
            error.message,
        });
      }
    }
  }

  useEffect(() => {
    if (imageFile) {
      if (!apiFormData.loading) {
        if (apiFormData.error) {
          // got error
          toastShadcn({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description:
              "An error has occurred while editing promotion details: \n" +
              apiFormData.error,
          });
        } else if (apiFormData.result) {
          // success
          console.log("success");
          toastShadcn({
            description: "Successfully edited promotion:",
          });
        }
      }
    } else {
      if (!apiJson.loading) {
        if (apiJson.error) {
          // got error
          toastShadcn({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description:
              "An error has occurred while editing promotion details: \n" +
              apiJson.error,
          });
        } else if (apiJson.result) {
          // success
          console.log("succes?");
          toastShadcn({
            description: "Successfully edited promotion:",
          });
        }
      }
    }
  }, [apiFormData.loading, apiJson.loading]);

  return (
    <div>
      <div>
        {curPromotion && (
          <Form.Root
            className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <div className="flex flex-col">
              <div className="mb-4 flex justify-between">
                <NavLink
                  className="flex"
                  to={`/promotion/viewpromotion/${promotionId}`}
                >
                  <Button variant={"outline"} type="button" className="">
                    Back
                  </Button>
                </NavLink>
                <span className="self-center text-lg text-graydark">
                  Edit Promotion Information
                </span>
                <Button disabled className="invisible">
                  Back
                </Button>
              </div>
              <Separator />
              <span className="mt-4 self-center text-title-xl font-bold">
                {curPromotion.title}
              </span>
            </div>
            {/* Promotion Picture */}
            <Form.Field
              name="promotionImage"
              className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
            >
              <Form.Label className="font-medium">Current Image</Form.Label>
              <img
                src={"http://localhost:3000/" + curPromotion.imageUrl}
                alt="Current promotion image"
                className="my-4 w-1/2 self-center rounded-md object-cover shadow-4"
              />
              <Form.Label className="font-medium">
                Upload A New Image &#40;Do not upload if no changes&#41;
              </Form.Label>
              <Form.Control
                type="file"
                placeholder="Change image"
                required={false}
                accept=".png, .jpg, .jpeg, .webp"
                onChange={handleFileChange}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              />
              {/* <Form.ValidityState>{validateImage}</Form.ValidityState> */}
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
                disabled={false}
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
            {formError && (
              <div className="m-2 border-danger bg-red-100 p-2">
                {formError}
              </div>
            )}
          </Form.Root>
        )}
      </div>
    </div>
  );
}

export default EditPromotionForm;
