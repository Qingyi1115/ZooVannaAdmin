import React, { useState, useEffect } from "react";

import * as Form from "@radix-ui/react-form";

import useApiJson from "../../../hooks/useApiJson";
import FormFieldInput from "../../FormFieldInput";
import FormFieldSelect from "../../FormFieldSelect";
import { ContinentEnum } from "../../../enums/ContinentEnum";
import { HiCheck } from "react-icons/hi";
import { BiomeEnum } from "../../../enums/BiomeEnum";
import FormFieldRadioGroup from "../../FormFieldRadioGroup";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Species from "../../../models/Species";
import { TwoThumbSliderWithNumber } from "../TwoThumbSliderWithNumber";
import { NavLink } from "react-router-dom";

import SpeciesEnclosureNeed from "../../../models/SpeciesEnclosureNeed";
import SpeciesDietNeed from "../../../models/SpeciesDietNeed";
import {
  AnimalFeedCategory,
  AnimalGrowthStage,
  PresentationContainer,
  PresentationLocation,
  PresentationMethod,
} from "../../../enums/Enumurated";
import PhysiologicalReferenceNorms from "../../../models/PhysiologicalReferenceNorms";
import { useNavigate } from "react-router-dom";

interface EditPhysioRefNormFormProps {
  curSpecies: Species;
  curPhysioRefNorm: PhysiologicalReferenceNorms;
}

function EditPhysioRefNormForm(props: EditPhysioRefNormFormProps) {
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();
  const { curSpecies, curPhysioRefNorm } = props;

  // fields
  const [speciesCode, setSpeciesCode] = useState<string>(
    curSpecies.speciesCode
  );
  const physiologicalRefId = curPhysioRefNorm.physiologicalRefId;
  const [sizeMaleCm, setSizeMaleCm] = useState<number>(
    curPhysioRefNorm.sizeMaleCm
  );
  const [sizeFemaleCm, setSizeFemaleCm] = useState<number>(
    curPhysioRefNorm.sizeFemaleCm
  );
  const [weightMaleKg, setWeightMaleKg] = useState<number>(
    curPhysioRefNorm.weightMaleKg
  );
  const [weightFemaleKg, setWeightFemaleKg] = useState<number>(
    curPhysioRefNorm.weightFemaleKg
  );
  const [ageToGrowthAge, setAgeToGrowthAge] = useState<number>(
    curPhysioRefNorm.ageToGrowthAge
  );
  const [growthStage, setGrowthStage] = useState<string | undefined>(
    curPhysioRefNorm.growthStage
  );

  // end fields

  // validation functions
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

  function validateAgeToGrowthAge(props: ValidityState) {
    // if (props != undefined) {
    if (sizeMaleCm <= 0) {
      return (
        <div className="font-medium text-danger">
          * Age to reach growth age must be greater than 0
        </div>
      );
    }
    // add any other cases here
    // }
    return null;
  }

  function validateSizeMaleCm(props: ValidityState) {
    // if (props != undefined) {
    if (sizeMaleCm <= 0) {
      return (
        <div className="font-medium text-danger">
          * Average size of male must be greater than 0
        </div>
      );
    }
    // add any other cases here
    // }
    return null;
  }

  function validateSizeFemaleCm(props: ValidityState) {
    // if (props != undefined) {
    if (sizeFemaleCm <= 0) {
      return (
        <div className="font-medium text-danger">
          * Average size of female must be greater than 0
        </div>
      );
    }
    // add any other cases here
    // }
    return null;
  }

  function validateWeightMaleKg(props: ValidityState) {
    // if (props != undefined) {
    if (weightMaleKg <= 0) {
      return (
        <div className="font-medium text-danger">
          * Average weight of male must be greater than 0
        </div>
      );
    }
    // add any other cases here
    // }
    return null;
  }

  function validateWeightFemaleKg(props: ValidityState) {
    // if (props != undefined) {
    if (weightFemaleKg <= 0) {
      return (
        <div className="font-medium text-danger">
          * Average weight of female must be greater than 0
        </div>
      );
    }
    // add any other cases here
    // }
    return null;
  }

  ///// end validation

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Remember, your form must have enctype="multipart/form-data" for upload pictures
    e.preventDefault();
    const toUpdatePhysioRefNorm = {
      physiologicalRefId,
      sizeMaleCm,
      sizeFemaleCm,
      weightMaleKg,
      weightFemaleKg,
      ageToGrowthAge,
      growthStage,
    };

    const updatePhysioRefNormApi = async () => {
      try {
        const response = await apiJson.put(
          "http://localhost:3000/api/species/updatePhysiologicalReferenceNorms",
          toUpdatePhysioRefNorm
        );
        // success
        toastShadcn({
          description: "Successfully updated physiological reference norm.",
        });
        const redirectUrl = `/species/viewspeciesdetails/${curSpecies.speciesCode}/physioref`;
        navigate(redirectUrl);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while updating physiological reference norm: \n" +
            error.message,
        });
      }
    };
    updatePhysioRefNormApi();
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
              to={`/species/viewspeciesdetails/${speciesCode}/physioref`}
            >
              <Button variant={"outline"} type="button" className="">
                Back
              </Button>
            </NavLink>
            <span className="self-center text-lg text-graydark">
              Edit Physiological Reference Norms
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

        {/* Age to Growth Stage */}
        <FormFieldInput
          type="number"
          formFieldName="ageToGrowthAge"
          label={`Age to Reach Growth Stage`}
          required={true}
          pattern={undefined}
          placeholder="e.g., 8"
          value={ageToGrowthAge}
          setValue={setAgeToGrowthAge}
          validateFunction={validateAgeToGrowthAge}
        />

        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
          {/* Size Male cm */}
          <FormFieldInput
            type="number"
            formFieldName="sizeMaleCm"
            label={`Average Male Size (cm)`}
            required={true}
            pattern={undefined}
            placeholder="e.g., 8"
            value={sizeMaleCm}
            setValue={setSizeMaleCm}
            validateFunction={validateSizeMaleCm}
          />
          {/* Weight Male kg */}
          <FormFieldInput
            type="number"
            formFieldName="weightMaleKg"
            label={`Average Male Weight (kg)`}
            required={true}
            placeholder="e.g., 8"
            pattern={undefined}
            value={weightMaleKg}
            setValue={setWeightMaleKg}
            validateFunction={validateWeightMaleKg}
          />
        </div>

        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
          {/* Size Female cm */}
          <FormFieldInput
            type="number"
            formFieldName="sizeFemaleCm"
            label={`Average Female Size (cm)`}
            required={true}
            pattern={undefined}
            placeholder="e.g., 8"
            value={sizeFemaleCm}
            setValue={setSizeFemaleCm}
            validateFunction={validateSizeFemaleCm}
          />
          {/* Weight Female kg */}
          <FormFieldInput
            type="number"
            formFieldName="weightFemaleKg"
            label={`Average Female Weight (kg)`}
            required={true}
            placeholder="e.g., 8"
            pattern={undefined}
            value={weightFemaleKg}
            setValue={setWeightFemaleKg}
            validateFunction={validateWeightFemaleKg}
          />
        </div>

        <Form.Submit asChild>
          <Button
            disabled={apiJson.loading}
            className="h-12 w-2/3 self-center rounded-full text-lg"
          >
            {!apiJson.loading ? (
              <div>Edit Physiological Reference Norm</div>
            ) : (
              <div>Loading</div>
            )}
          </Button>
        </Form.Submit>
      </Form.Root>
    </div>
  );
}

export default EditPhysioRefNormForm;
