import React, { useState } from "react";

import * as Form from "@radix-ui/react-form";

import useApiJson from "../../../hooks/useApiJson";
import FormFieldInput from "../../FormFieldInput";
import FormFieldSelect from "../../FormFieldSelect";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { NavLink } from "react-router-dom";
import Species from "../../../models/Species";

import {
  AnimalFeedCategory,
  AnimalGrowthStage,
  PresentationContainer,
  PresentationLocation,
  PresentationMethod,
} from "../../../enums/Enumurated";
import SpeciesDietNeed from "../../../models/SpeciesDietNeed";

import { useNavigate } from "react-router-dom";
interface EditDietaryRequirementsFormProps {
  curSpecies: Species;
  curSpeciesDietNeed: SpeciesDietNeed;
}

function EditDietaryRequirementsForm(props: EditDietaryRequirementsFormProps) {
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();
  const { curSpecies, curSpeciesDietNeed } = props;

  // fields
  const [speciesCode, setSpeciesCode] = useState<string>(
    curSpecies.speciesCode
  );
  const [speciesDietNeedId, setSpeciesDietNeedId] = useState<number>(
    curSpeciesDietNeed.speciesDietNeedId
  );
  const [animalFeedCategory, setAnimalFeedCategory] = useState<
    string | undefined
  >(curSpeciesDietNeed.animalFeedCategory);
  const [amountPerMealGram, setAmountPerMealGram] = useState<
    number | undefined
  >(curSpeciesDietNeed.amountPerMealGram);
  const [amountPerWeekGram, setAmountPerWeekGram] = useState<
    number | undefined
  >(curSpeciesDietNeed.amountPerWeekGram);
  const [presentationContainer, setPresentationContainer] = useState<
    string | undefined
  >(curSpeciesDietNeed.presentationContainer);
  const [presentationMethod, setPresentationMethod] = useState<
    string | undefined
  >(curSpeciesDietNeed.presentationMethod);
  const [presentationLocation, setPresentationLocation] = useState<
    string | undefined
  >(curSpeciesDietNeed.presentationLocation);
  const [growthStage, setGrowthStage] = useState<string | undefined>(
    curSpeciesDietNeed.growthStage
  );

  // end fields

  //////
  // validation functions
  /////
  function validateGrowthStage(props: ValidityState) {
    if (props != undefined) {
      if (growthStage == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please select a growth stage
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateFeedCategory(props: ValidityState) {
    if (props != undefined) {
      if (animalFeedCategory == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please select a feed category
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validatePresentationContainer(props: ValidityState) {
    if (props != undefined) {
      if (presentationContainer == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please select a presentation container
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validatePresentationMethod(props: ValidityState) {
    if (props != undefined) {
      if (presentationMethod == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please select a presentation method
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validatePresentationLocation(props: ValidityState) {
    if (props != undefined) {
      if (presentationLocation == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please select a presentation location
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateAmountPerMeal(props: ValidityState) {
    if (props != undefined) {
      if (amountPerMealGram == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please enter a recommended amount per meal
          </div>
        );
      } else if (amountPerMealGram <= 0) {
        return (
          <div className="font-medium text-danger">
            * Amount per meal must be greater than 0
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateAmountPerWeek(props: ValidityState) {
    if (props != undefined) {
      if (amountPerMealGram == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please enter a recommended amount per week
          </div>
        );
      } else if (amountPerMealGram <= 0) {
        return (
          <div className="font-medium text-danger">
            * Amount per week must be greater than 0
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  // end validation functions

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Remember, your form must have enctype="multipart/form-data" for upload pictures
    e.preventDefault();
    const toUpdateDietaryRequirementObj = {
      speciesDietNeedId,
      animalFeedCategory,
      amountPerMealGram,
      amountPerWeekGram,
      presentationContainer,
      presentationMethod,
      presentationLocation,
      growthStage,
    };

    // console.log("toUpdateDietaryRequirementObj");
    // console.log(toUpdateDietaryRequirementObj);

    const updateDietaryRequirementsApi = async () => {
      try {
        const response = await apiJson.put(
          "http://localhost:3000/api/species/updateDietNeed",
          toUpdateDietaryRequirementObj
        );
        // success
        toastShadcn({
          description: "Successfully updated new dietary requirements.",
        });
        // setNewDietaryRequirementCreated(true);
        const redirectUrl = `/species/viewspeciesdetails/${curSpecies.speciesCode}/dietneed`;
        navigate(redirectUrl);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while updating dietary requirements: \n" +
            error.message,
        });
      }
    };
    updateDietaryRequirementsApi();
  }

  return (
    <div>
      <Form.Root
        className="flex w-full flex-col gap-8 rounded-lg bg-white text-black"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">
            <NavLink
              className="flex"
              to={`/species/viewspeciesdetails/${speciesCode}/dietneed`}
            >
              <Button variant={"outline"} type="button" className="">
                Back
              </Button>
            </NavLink>
            <span className="self-center text-lg text-graydark">
              Edit Species Dietary Requirements
            </span>
            <Button disabled className="invisible">
              Back
            </Button>
          </div>
          <Separator />
          <span className="mt-4 self-center text-title-xl font-bold">
            {curSpecies.commonName}
          </span>
        </div>

        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
          {/* Growth Stage*/}
          <FormFieldSelect
            formFieldName="growthStage"
            label="Growth Stage"
            required={true}
            placeholder="Select a growth stage..."
            valueLabelPair={Object.keys(AnimalGrowthStage).map(
              (growthStageKey) => [
                growthStageKey.toString(),
                AnimalGrowthStage[
                  growthStageKey as keyof typeof AnimalGrowthStage
                ].toString(),
              ]
            )}
            value={growthStage}
            setValue={setGrowthStage}
            validateFunction={validateGrowthStage}
          />
          {/* Growth Stage*/}
          <FormFieldSelect
            formFieldName="animalFeedCategory"
            label="Feed Category"
            required={true}
            placeholder="Select a feed category..."
            valueLabelPair={Object.keys(AnimalFeedCategory).map((feedCat) => [
              AnimalFeedCategory[
                feedCat as keyof typeof AnimalFeedCategory
              ].toString(),
              AnimalFeedCategory[
                feedCat as keyof typeof AnimalFeedCategory
              ].toString(),
            ])}
            value={animalFeedCategory}
            setValue={setAnimalFeedCategory}
            validateFunction={validateFeedCategory}
          />
        </div>

        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
          {/* Presentation Container */}
          <FormFieldSelect
            formFieldName="presentationContainer"
            label="Presentation Container"
            required={true}
            placeholder="Select a presentation container..."
            valueLabelPair={Object.keys(PresentationContainer).map(
              (container) => [
                PresentationContainer[
                  container as keyof typeof PresentationContainer
                ].toString(),
                PresentationContainer[
                  container as keyof typeof PresentationContainer
                ].toString(),
              ]
            )}
            value={presentationContainer}
            setValue={setPresentationContainer}
            validateFunction={validatePresentationContainer}
          />
          {/* Presentation Method */}
          <FormFieldSelect
            formFieldName="presentationMethod"
            label="Presentation Method"
            required={true}
            placeholder="Select a presentation method..."
            valueLabelPair={Object.keys(PresentationMethod).map((method) => [
              method.toString(),
              PresentationMethod[
                method as keyof typeof PresentationMethod
              ].toString(),
            ])}
            value={presentationMethod}
            setValue={setPresentationMethod}
            validateFunction={validatePresentationMethod}
          />
          {/* Presentation Location */}
          <FormFieldSelect
            formFieldName="presentationLocation"
            label="Presentation Location"
            required={true}
            placeholder="Select a presentation location..."
            valueLabelPair={Object.keys(PresentationLocation).map(
              (location) => [
                location.toString(),
                PresentationLocation[
                  location as keyof typeof PresentationLocation
                ].toString(),
              ]
            )}
            value={presentationLocation}
            setValue={setPresentationLocation}
            validateFunction={validatePresentationLocation}
          />
        </div>

        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
          {/* Amount Per Meal */}
          <FormFieldInput
            type="number"
            formFieldName="amountPerMealGram"
            label={`Recommended Amount per Meal (g)`}
            required={true}
            pattern={undefined}
            placeholder="e.g., 8"
            value={amountPerMealGram}
            setValue={setAmountPerMealGram}
            validateFunction={validateAmountPerMeal}
          />
          {/* Amount Per Week */}
          <FormFieldInput
            type="number"
            formFieldName="amountPerWeekGram"
            label={`Recommended Amount per Week (g)`}
            required={true}
            placeholder="e.g., 8"
            pattern={undefined}
            value={amountPerWeekGram}
            setValue={setAmountPerWeekGram}
            validateFunction={validateAmountPerWeek}
          />
        </div>

        <Form.Submit asChild>
          <Button
            disabled={apiJson.loading}
            className="h-12 w-2/3 self-center rounded-full text-lg"
          >
            {!apiJson.loading ? (
              <div>Submit</div>
            ) : (
              <div>Loading</div>
            )}
          </Button>
        </Form.Submit>
      </Form.Root>
    </div>
  );
}

export default EditDietaryRequirementsForm;
