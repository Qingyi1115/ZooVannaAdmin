import * as Form from "@radix-ui/react-form";
import React, { useState } from "react";


import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import useApiFormData from "../../../../hooks/useApiFormData";
import useApiJson from "../../../../hooks/useApiJson";
import EnrichmentItem from "../../../../models/EnrichmentItem";
import FormFieldInput from "../../../FormFieldInput";

interface EditEnrichmentItemFormProps {
  curEnrichmentItem: EnrichmentItem;
  refreshSeed: number;
  setRefreshSeed: React.Dispatch<React.SetStateAction<number>>;
}

function EditEnrichmentItemForm(props: EditEnrichmentItemFormProps) {
  const apiFormData = useApiFormData();
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();

  const { curEnrichmentItem, refreshSeed, setRefreshSeed } = props;
  const [enrichmentItemId, setEnrichmentItemId] = useState<number>(
    curEnrichmentItem.enrichmentItemId
  );
  const [enrichmentItemName, setEnrichmentItemName] = useState<string>(
    curEnrichmentItem.enrichmentItemName
  );
  const [enrichmentItemImageUrl, setImageUrl] = useState<string | null>(
    curEnrichmentItem.enrichmentItemImageUrl
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formError, setFormError] = useState<string | null>(null);

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
      formData.append("file", imageFile || "");
      formData.append("enrichmentItemName", enrichmentItemName);
      formData.append("enrichmentItemId", enrichmentItemId.toString() || "");
      console.log(formData);
      try {
        const responseJson = await apiFormData.put(
          "http://localhost:3000/api/assetfacility/updateEnrichmentItemImage",
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
    }
    // no image
    const updatedEnrichmentItem = {
      enrichmentItemId,
      enrichmentItemName,
    };
    console.log(updatedEnrichmentItem);
    try {
      const responseJson = await apiJson.put(
        "http://localhost:3000/api/assetfacility/updateEnrichmentItem",
        updatedEnrichmentItem
      );
      // success
      toastShadcn({
        description: "Successfully edited enrichment item",
      });
      setRefreshSeed(refreshSeed + 1);
      const redirectUrl = `/assetfacility/viewallenrichmentitems`;
      navigate(redirectUrl);
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

  return (
    <div>
      {curEnrichmentItem && (
        <Form.Root
          className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="flex flex-col">
            <div className="mb-4 flex justify-between">
              <Button variant={"outline"} type="button" onClick={() => navigate(-1)} className="">
                Back
              </Button>
              <span className="self-center text-lg text-graydark">
                Edit Enrichment Item
              </span>
              <Button disabled className="invisible">
                Back
              </Button>
            </div>
            <Separator />
            <span className="mt-4 self-center text-title-xl font-bold">
              {curEnrichmentItem.enrichmentItemName}
            </span>
          </div>
          {/* Enrichment Item Picture */}
          <Form.Field
            name="enrichmentItemImage"
            className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
          >
            <span className="font-medium">Current Image</span>
            <img
              src={
                "http://localhost:3000/" +
                curEnrichmentItem.enrichmentItemImageUrl
              }
              alt="Current enrichment item image"
              className="my-4 aspect-square w-1/5 rounded-full border object-cover shadow-4"
            />
            <Form.Label className="font-medium">
              Change Enrichment Item Image
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
          {/* Enrichment Item Name */}
          <FormFieldInput
            type="text"
            formFieldName="enrichmentItemName"
            label="Enrichment Item Name"
            required={true}
            placeholder="e.g., Puzzle Feeder, Chew Toy,..."
            value={enrichmentItemName}
            setValue={setEnrichmentItemName}
            validateFunction={validateEnrichmentItemName}
            pattern={undefined}
          />

          <Form.Submit asChild>
            <Button
              disabled={apiFormData.loading}
              className="mt-10 h-12 w-2/3 self-center rounded-full border bg-primary text-lg text-whiten transition-all hover:bg-opacity-80">
              {!apiFormData.loading ? (
                <div>Submit</div>
              ) : (
                <div>Loading</div>
              )}
            </Button>
          </Form.Submit>
          {formError && (
            <div className="m-2 border-danger bg-red-100 p-2">{formError}</div>
          )}
        </Form.Root>
      )}
    </div>
  );
}

export default EditEnrichmentItemForm;
