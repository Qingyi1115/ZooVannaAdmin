import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";

import { MultiSelectChangeEvent } from "primereact/multiselect";

import useApiFormData from "../../../hooks/useApiFormData";
import FormFieldInput from "../../FormFieldInput";
import FormFieldRadioGroup from "../../FormFieldRadioGroup";
import EnrichmentItem from "../../../models/EnrichmentItem";
import useApiJson from "../../../hooks/useApiJson";
import { useToast } from "@/components/ui/use-toast";

interface EditEnrichmentItemFormProps {
  curEnrichmentItem: EnrichmentItem;
  refreshSeed: number;
  setRefreshSeed: React.Dispatch<React.SetStateAction<number>>;
}

function EditEnrichmentItemForm(props: EditEnrichmentItemFormProps) {
  const apiFormData = useApiFormData();
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;

  const { curEnrichmentItem, refreshSeed, setRefreshSeed } = props;

  const [enrichmentItemName, setEnrichmentItemName] = useState<string>(curEnrichmentItem.enrichmentItemName);
  const [enrichmentItemImageUrl, setImageUrl] = useState<string | null>(curEnrichmentItem.enrichmentItemImageUrl);
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

  function validateEnrichmentItemName(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter an enrichment item name
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }


  // end field validations

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files && event.target.files[0];
    setImageFile(file);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (imageFile) {
      const formData = new FormData();
      formData.append("enrichmentItemName", enrichmentItemName);
      formData.append("file", imageFile || "");
      try {
        const responseJson = await apiFormData.put(
          "http://localhost:3000/api/assetfacility/updateEnrichmentItem",
          formData
        );
        // success
        toastShadcn({
          description: "Successfully edited enrichment item",
        });
        setRefreshSeed(refreshSeed + 1);
      } catch (error: any) {
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while editing enrichment item details: \n" +
            error.message,
        });
      }
    } else {
      // no image
      const updatedEnrichmentItem = {
        enrichmentItemName,
        enrichmentItemImageUrl
      };

      try {
        const responseJson = await apiJson.put(
          "http://localhost:3000/api/animalfeed/updateanimalfeed",
          updatedEnrichmentItem
        );
        // success
        toastShadcn({
          description: "Successfully edited enrichment item",
        });
        setRefreshSeed(refreshSeed + 1);
      } catch (error: any) {
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while editing enrichment item details: \n" +
            error.message,
        });
      }
    }
    const formData = new FormData();
    formData.append("enrichmentItemName", enrichmentItemName);
    formData.append("file", imageFile || "");
    await apiFormData.put(
      "http://localhost:3000/api/enrichmentItem/updateenrichmentItem",
      formData
    );
    console.log(apiFormData.result);
  }

  return (
    <div>
      {curEnrichmentItem && (
        <Form.Root
          className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <span className="self-center text-title-xl font-bold">
            Edit EnrichmentItem: {curEnrichmentItem.enrichmentItemName}
          </span>
          <hr className="bg-stroke opacity-20" />
          {/* EnrichmentItem Picture */}
          <Form.Field
            name="enrichmentItemImage"
            className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
          >
            <span className="font-medium">Current Image</span>
            <img src={curEnrichmentItem.enrichmentItemImageUrl} alt="Current enrichmentItem image" />
            <Form.Label className="font-medium">
              Change EnrichmentItem Image
            </Form.Label>
            <Form.Control
              type="file"
              placeholder="Change image"
              required
              accept=".png, .jpg, .jpeg, .webp"
              onChange={handleFileChange}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
            />
            {/* <Form.ValidityState>{validateImage}</Form.ValidityState> */}
          </Form.Field>
          <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
            {/* Animal Feed Name */}
            <FormFieldInput
              type="text"
              formFieldName="enrichmentItemName"
              label="Animal Feed Name"
              required={true}
              placeholder="e.g., Puzzle Feeder, Chew Toy,..."
              value={enrichmentItemName}
              setValue={setEnrichmentItemName}
              validateFunction={validateEnrichmentItemName} pattern={undefined}            />

            <Form.Submit asChild>
              <button className="mt-10 h-12 w-2/3 self-center rounded-full border bg-primary text-lg text-whiten transition-all hover:bg-opacity-80">
                Submit Edit EnrichmentItem
              </button>
            </Form.Submit>
            {formError && (
              <div className="m-2 border-danger bg-red-100 p-2">{formError}</div>
            )}
          </div>
        </Form.Root>
      )}
    </div>
  );
}

export default EditEnrichmentItemForm;
