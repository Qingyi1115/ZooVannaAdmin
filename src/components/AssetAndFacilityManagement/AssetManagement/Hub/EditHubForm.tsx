import React, { useEffect, useState } from "react";
import * as Form from "@radix-ui/react-form";

import { MultiSelectChangeEvent } from "primereact/multiselect";

import useApiFormData from "../../../../hooks/useApiFormData";
import FormFieldInput from "../../../FormFieldInput";
import Hub from "../../../../models/Hub";
import useApiJson from "../../../../hooks/useApiJson";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import FormFieldSelect from "../../../FormFieldSelect";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

interface EditHubFormProps {
  curHub: Hub;
  refreshSeed: number;
  setRefreshSeed: React.Dispatch<React.SetStateAction<number>>;
}

function EditHubForm(props: EditHubFormProps) {
  const apiFormData = useApiFormData();
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();

  const { curHub, refreshSeed, setRefreshSeed } = props;

  const hubProcessorId = curHub.hubProcessorId;
  const [processorName, setHubName] = useState<string>(
    curHub.processorName
  );
  const [hubStatus, setHubStatus] = useState<
    string | undefined
  >(curHub.hubStatus); // select from set list

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formError, setFormError] = useState<string | null>(null);

  function validateHubName(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter an hub name
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateHubStatus(props: ValidityState) {
    // console.log(props);
    if (props != undefined) {
      if (hubStatus == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please select an hub category
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  // end field validations

  function onHubStatusSelectChange(e: MultiSelectChangeEvent) {
    setHubStatus(e.value);

    const element = document.getElementById(
      "selectMultiHubStatusField"
    );
    if (element) {
      const isDataInvalid = element.getAttribute("data-invalid");
      if (isDataInvalid == "true") {
        element.setAttribute("data-valid", "true");
        element.removeAttribute("data-invalid");
      }
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files && event.target.files[0];
    setImageFile(file);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile || "");
      formData.append("hubProcessorId", hubProcessorId.toString() || "");
      formData.append("processorName", processorName);
      formData.append(
        "hubStatus",
        hubStatus?.toString() || ""
      );
      try {
        const responseJson = await apiFormData.put(
          "http://localhost:3000/api/assetfacility/updateHub",
          formData
        );
        // success
        toastShadcn({
          description: "Successfully edited hub",
        });
        setRefreshSeed(refreshSeed + 1);
        const redirectUrl = `/assetfacility/viewallanimalfeed`;
        navigate(redirectUrl);
      } catch (error: any) {
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while editing hub details: \n" +
            error.message,
        });
      }
    }
    // no image
    const updatedHubStatus = hubStatus?.toString();
    const updatedHub = {
      hubProcessorId,
      processorName,
      hubStatus,
    };
    console.log(updatedHub);

    try {
      const responseJson = await apiJson.put(
        "http://localhost:3000/api/assetFacility/updateHub",
        updatedHub
      );
      // success
      toastShadcn({
        description: "Successfully edited hub",
      });
      setRefreshSeed(refreshSeed + 1);
      const redirectUrl = `/assetfacility/viewallanimalfeed`;
      navigate(redirectUrl);
    } catch (error: any) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while editing hub details: \n" +
          error.message,
      });
    }
  }

  // useEffect(() => {
  //   if (imageFile) {
  //     if (!apiFormData.loading) {
  //       if (apiFormData.error) {
  //         // got error
  //         toastShadcn({
  //           variant: "destructive",
  //           title: "Uh oh! Something went wrong.",
  //           description:
  //             "An error has occurred while editing hub details: \n" +
  //             apiFormData.error,
  //         });
  //       } else if (apiFormData.result) {
  //         // success
  //         console.log("success?");
  //         toastShadcn({
  //           description: "Successfully edited hub:",
  //         });
  //       }
  //     }
  //   } else {
  //     if (!apiJson.loading) {
  //       if (apiJson.error) {
  //         // got error
  //         toastShadcn({
  //           variant: "destructive",
  //           title: "Uh oh! Something went wrong.",
  //           description:
  //             "An error has occurred while editing hub details: \n" +
  //             apiJson.error,
  //         });
  //       } else if (apiJson.result) {
  //         // success
  //         console.log("succes?");
  //         toastShadcn({
  //           description: "Successfully edited hub:",
  //         });
  //       }
  //     }
  //   }
  // }, [apiFormData.loading, apiJson.loading]);

  return (
    <div>
      {curHub && (
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
              <span className="self-center text-lg text-graydark">
                Edit Hub
              </span>
              <Button disabled className="invisible">
                Back
              </Button>
            </div>
            <Separator />
            <span className="mt-4 self-center text-title-xl font-bold">
              {curHub.processorName}
            </span>
          </div>
          <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
            {/* Hub Name */}
            <FormFieldInput
              type="text"
              formFieldName="processorName"
              label="Hub Name"
              required={true}
              placeholder="e.g., Carrots, Beef,..."
              value={processorName}
              setValue={setHubName}
              validateFunction={validateHubName}
              pattern={undefined}
            />
          </div>
          <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
            {/* Hub Category */}
            <FormFieldSelect
              formFieldName="hubStatus"
              label="Hub Category"
              required={true}
              placeholder="Select an hub category..."
              valueLabelPair={[
                ["RED_MEAT", "Red Meat"],
                ["WHITE_MEAT", "White Meat"],
                ["FISH", "Fish"],
                ["INSECTS", "Insects"],
                ["HAY", "Hay"],
                ["VEGETABLES", "Vegetables"],
                ["FRUITS", "Fruits"],
                ["GRAINS", "Grains"],
                ["BROWSE", "Browse"],
                ["PELLETS", "Pellets"],
                ["NECTAR", "Nectar"],
                ["SUPPLEMENTS", "Supplements"],
                ["OTHERS", "Others"],
              ]}
              value={hubStatus}
              setValue={setHubStatus}
              validateFunction={validateHubStatus}
            />
          </div>

          <Form.Submit asChild>
            <button className="mt-10 h-12 w-2/3 self-center rounded-full border bg-primary text-lg text-whiten transition-all hover:bg-opacity-80">
              Submit Edit Hub
            </button>
          </Form.Submit>
          {formError && (
            <div className="m-2 border-danger bg-red-100 p-2">{formError}</div>
          )}
        </Form.Root>
      )}
    </div>
  );
}

export default EditHubForm;
