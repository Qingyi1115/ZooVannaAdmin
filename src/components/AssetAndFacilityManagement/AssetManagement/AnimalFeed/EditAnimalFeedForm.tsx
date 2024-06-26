import * as Form from "@radix-ui/react-form";
import React, { useState } from "react";

import { MultiSelectChangeEvent } from "primereact/multiselect";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import useApiFormData from "../../../../hooks/useApiFormData";
import useApiJson from "../../../../hooks/useApiJson";
import AnimalFeed from "../../../../models/AnimalFeed";
import FormFieldInput from "../../../FormFieldInput";
import FormFieldSelect from "../../../FormFieldSelect";

interface EditAnimalFeedFormProps {
  curAnimalFeed: AnimalFeed;
  refreshSeed: number;
  setRefreshSeed: React.Dispatch<React.SetStateAction<number>>;
}

function EditAnimalFeedForm(props: EditAnimalFeedFormProps) {
  const apiFormData = useApiFormData();
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();

  const { curAnimalFeed, refreshSeed, setRefreshSeed } = props;

  const animalFeedId = curAnimalFeed.animalFeedId;
  const [animalFeedName, setAnimalFeedName] = useState<string>(
    curAnimalFeed.animalFeedName
  );
  const [animalFeedCategory, setAnimalFeedCategory] = useState<
    string | undefined
  >(curAnimalFeed.animalFeedCategory); // select from set list
  const [animalFeedImageUrl, setImageUrl] = useState<string | null>(
    curAnimalFeed.animalFeedImageUrl
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

  function validateAnimalFeedName(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter an animal feed name
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateAnimalFeedCategory(props: ValidityState) {
    // console.log(props);
    if (props != undefined) {
      if (animalFeedCategory == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please select an animal feed category
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  // end field validations

  function onAnimalFeedCategorySelectChange(e: MultiSelectChangeEvent) {
    setAnimalFeedCategory(e.value);

    const element = document.getElementById(
      "selectMultiAnimalFeedCategoryField"
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
      formData.append("animalFeedId", animalFeedId.toString() || "");
      formData.append("animalFeedName", animalFeedName);
      formData.append(
        "animalFeedCategory",
        animalFeedCategory?.toString() || ""
      );
      try {
        const responseJson = await apiFormData.put(
          "http://localhost:3000/api/assetfacility/updateAnimalFeed",
          formData
        );
        // success
        toastShadcn({
          description: "Successfully edited animal feed",
        });
        setRefreshSeed(refreshSeed + 1);
        const redirectUrl = `/assetfacility/viewallassets/animalFeed`;
        navigate(redirectUrl);
      } catch (error: any) {
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while editing animal feed details: \n" +
            error.message,
        });
      }
    }
    // no image
    const updatedAnimalFeedCategory = animalFeedCategory?.toString();
    const updatedAnimalFeed = {
      animalFeedId,
      animalFeedName,
      animalFeedCategory,
    };
    console.log(updatedAnimalFeed);

    try {
      const responseJson = await apiJson.put(
        "http://localhost:3000/api/assetFacility/updateAnimalFeed",
        updatedAnimalFeed
      );
      // success
      toastShadcn({
        description: "Successfully edited animal feed",
      });
      setRefreshSeed(refreshSeed + 1);
      const redirectUrl = `/assetfacility/viewallassets/animalFeed`;
      navigate(redirectUrl);
    } catch (error: any) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while editing animal feed details: \n" +
          error.message,
      });
    }
  }

  return (
    <div>
      {curAnimalFeed && (
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
                Edit Animal Feed
              </span>
              <Button disabled className="invisible">
                Back
              </Button>
            </div>
            <Separator />
            <span className="mt-4 self-center text-title-xl font-bold">
              {curAnimalFeed.animalFeedName}
            </span>
          </div>

          {/* Animal Feed Picture */}
          <Form.Field
            name="animalFeedImage"
            className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
          >
            <Form.Label className="font-medium">Current Image</Form.Label>
            <img
              src={"http://localhost:3000/" + curAnimalFeed.animalFeedImageUrl}
              alt="Current animal feed image"
              className="my-4 aspect-square w-1/5 rounded-full border object-cover shadow-4"
            />
            <Form.Label className="font-medium">
              Upload A New Image
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
          <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
            {/* Animal Feed Name */}
            <FormFieldInput
              type="text"
              formFieldName="animalFeedName"
              label="Animal Feed Name"
              required={true}
              placeholder="e.g., Carrots, Beef,..."
              value={animalFeedName}
              setValue={setAnimalFeedName}
              validateFunction={validateAnimalFeedName}
              pattern={undefined}
            />
          </div>
          <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
            {/* Animal Feed Category */}
            <FormFieldSelect
              formFieldName="animalFeedCategory"
              label="Animal Feed Category"
              required={true}
              placeholder="Select an animal feed category..."
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
              value={animalFeedCategory}
              setValue={setAnimalFeedCategory}
              validateFunction={validateAnimalFeedCategory}
            />
          </div>

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

export default EditAnimalFeedForm;
