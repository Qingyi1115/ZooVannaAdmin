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
  const [minSizeMaleCm, setMinSizeMaleCm] = useState<number>(
    curPhysioRefNorm.minSizeMaleCm
  );
  const [maxSizeMaleCm, setMaxSizeMaleCm] = useState<number>(
    curPhysioRefNorm.maxSizeMaleCm
  );
  const [minSizeFemaleCm, setMinSizeFemaleCm] = useState<number>(
    curPhysioRefNorm.minSizeFemaleCm
  );
  const [maxSizeFemaleCm, setMaxSizeFemaleCm] = useState<number>(
    curPhysioRefNorm.maxSizeFemaleCm
  );
  const [minWeightMaleKg, setMinWeightMaleKg] = useState<number>(
    curPhysioRefNorm.minWeightMaleKg
  );
  const [maxWeightMaleKg, setMaxWeightMaleKg] = useState<number>(
    curPhysioRefNorm.maxWeightMaleKg
  );
  const [minWeightFemaleKg, setMinWeightFemaleKg] = useState<number>(
    curPhysioRefNorm.minWeightFemaleKg
  );
  const [maxWeightFemaleKg, setMaxWeightFemaleKg] = useState<number>(
    curPhysioRefNorm.maxWeightFemaleKg
  );
  const [minAge, setMinAge] = useState<number>(curPhysioRefNorm.minAge);
  const [maxAge, setMaxAge] = useState<number>(curPhysioRefNorm.maxAge);
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

  function validateMinAge(props: ValidityState) {
    // if (props != undefined) {
    if (Number(minAge) < 0) {
      return (
        <div className="font-medium text-danger">
          * Start age must be equal to or greater than 0
        </div>
      );
    }

    if (Number(minAge) > Number(maxAge)) {
      return (
        <div className="font-medium text-danger">
          * Start age must be smaller than end age
        </div>
      );
    }
    // add any other cases here
    // }
    return null;
  }

  function validateMaxAge(props: ValidityState) {
    // if (props != undefined) {
    if (Number(maxAge) <= 0) {
      return (
        <div className="font-medium text-danger">
          * End age must be greater than 0
        </div>
      );
    } else if (Number(minAge) > Number(maxAge)) {
      return (
        <div className="font-medium text-danger">
          * End age must be greater than start age
        </div>
      );
    }
    // add any other cases here
    // }
    return null;
  }

  function validateMinSizeMaleCm(props: ValidityState) {
    // if (props != undefined) {
    if (Number(minSizeMaleCm) <= 0) {
      return (
        <div className="font-medium text-danger">
          * Min size of male must be greater than 0
        </div>
      );
    }
    if (Number(minSizeMaleCm) >= Number(maxSizeMaleCm)) {
      return (
        <div className="font-medium text-danger">
          * Min size of male must be smaller than max size of male
        </div>
      );
    }
    // add any other cases here
    // }
    return null;
  }

  function validateMaxSizeMaleCm(props: ValidityState) {
    // if (props != undefined) {
    if (Number(minSizeMaleCm) >= Number(maxSizeMaleCm)) {
      return (
        <div className="font-medium text-danger">
          * Max size of male must be greater than min size of male
        </div>
      );
    }
    // add any other cases here
    // }
    return null;
  }

  function validateMinSizeFemaleCm(props: ValidityState) {
    // if (props != undefined) {
    if (Number(minSizeFemaleCm) <= 0) {
      return (
        <div className="font-medium text-danger">
          * Min size of female must be greater than 0
        </div>
      );
    }
    if (Number(minSizeFemaleCm) >= Number(maxSizeFemaleCm)) {
      return (
        <div className="font-medium text-danger">
          * Min size of female must be smaller than max size of female
        </div>
      );
    }
    // add any other cases here
    // }
    return null;
  }

  function validateMaxSizeFemaleCm(props: ValidityState) {
    // if (props != undefined) {
    if (Number(minSizeFemaleCm) >= Number(maxSizeFemaleCm)) {
      return (
        <div className="font-medium text-danger">
          * Max size of female must be greater than min size of female
        </div>
      );
    }
    // add any other cases here
    // }
    return null;
  }

  function validateMinWeightMaleKg(props: ValidityState) {
    // if (props != undefined) {
    if (Number(minWeightMaleKg) <= 0) {
      return (
        <div className="font-medium text-danger">
          * Weight of male must be greater than 0
        </div>
      );
    }
    if (Number(minWeightMaleKg) >= Number(maxWeightMaleKg)) {
      return (
        <div className="font-medium text-danger">
          * Min weight of male must be smaller than max weight of male
        </div>
      );
    }
    // add any other cases here
    // }
    return null;
  }

  function validateMaxWeightMaleKg(props: ValidityState) {
    // if (props != undefined) {
    if (Number(maxWeightMaleKg) <= 0) {
      return (
        <div className="font-medium text-danger">
          * Weight of male must be greater than 0
        </div>
      );
    }
    if (Number(minWeightMaleKg) >= Number(maxWeightMaleKg)) {
      return (
        <div className="font-medium text-danger">
          * Max weight of male must be greater than min weight of male
        </div>
      );
    }
    // add any other cases here
    // }
    return null;
  }

  function validateMinWeightFemaleKg(props: ValidityState) {
    // if (props != undefined) {
    if (Number(minWeightFemaleKg) <= 0) {
      return (
        <div className="font-medium text-danger">
          * Weight of female must be greater than 0
        </div>
      );
    }
    if (Number(minWeightFemaleKg) >= Number(maxWeightFemaleKg)) {
      return (
        <div className="font-medium text-danger">
          * Min weight of female must be smaller than max weight of female
        </div>
      );
    }
    // add any other cases here
    // }
    return null;
  }

  function validateMaxWeightFemaleKg(props: ValidityState) {
    // if (props != undefined) {
    if (Number(maxWeightFemaleKg) <= 0) {
      return (
        <div className="font-medium text-danger">
          * Weight of female must be greater than 0
        </div>
      );
    }
    if (Number(minWeightFemaleKg) >= Number(maxWeightFemaleKg)) {
      return (
        <div className="font-medium text-danger">
          * Max weight of female must be greater than min weight of female
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
      minSizeMaleCm,
      maxSizeMaleCm,
      minSizeFemaleCm,
      maxSizeFemaleCm,
      minWeightMaleKg,
      maxWeightMaleKg,
      minWeightFemaleKg,
      maxWeightFemaleKg,
      minAge,
      maxAge,
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

        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
          {/* Min Age / Start Age */}
          <FormFieldInput
            type="number"
            formFieldName="minAge"
            label={`Start Age`}
            required={true}
            pattern={undefined}
            placeholder="e.g., 8"
            value={minAge}
            setValue={setMinAge}
            validateFunction={validateMinAge}
          />
          {/* Max Age / End Age */}
          <FormFieldInput
            type="number"
            formFieldName="maxAge"
            label={`End Age`}
            required={true}
            pattern={undefined}
            placeholder="e.g., 8"
            value={maxAge}
            setValue={setMaxAge}
            validateFunction={validateMaxAge}
          />
        </div>

        <div>
          <div className="mb-2 text-lg font-bold text-[#3b82f6]">Male</div>
          <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
            {/* Min Size Male cm */}
            <FormFieldInput
              type="number"
              formFieldName="minSizeMaleCm"
              label={`Minimum Male Size (cm)`}
              required={true}
              pattern={undefined}
              placeholder="e.g., 8"
              value={minSizeMaleCm}
              setValue={setMinSizeMaleCm}
              validateFunction={validateMinSizeMaleCm}
            />
            {/* Max Size Male cm */}
            <FormFieldInput
              type="number"
              formFieldName="maxSizeMaleCm"
              label={`Maximum Male Size (cm)`}
              required={true}
              placeholder="e.g., 8"
              pattern={undefined}
              value={maxSizeMaleCm}
              setValue={setMaxSizeMaleCm}
              validateFunction={validateMaxSizeMaleCm}
            />
          </div>
        </div>

        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
          {/* Min Weight Male kg */}
          <FormFieldInput
            type="number"
            formFieldName="minWeightMaleKg"
            label={`Minimum Male Weight (kg)`}
            required={true}
            pattern={undefined}
            placeholder="e.g., 8"
            value={minWeightMaleKg}
            setValue={setMinWeightMaleKg}
            validateFunction={validateMinWeightMaleKg}
          />
          {/* Max Weight Male kg */}
          <FormFieldInput
            type="number"
            formFieldName="maxWeightMaleKg"
            label={`Maximum Male Weight (kg)`}
            required={true}
            placeholder="e.g., 8"
            pattern={undefined}
            value={maxWeightMaleKg}
            setValue={setMaxWeightMaleKg}
            validateFunction={validateMaxWeightMaleKg}
          />
        </div>
        <Separator />
        <div>
          <div className="mb-2 text-lg font-bold text-[#ec4899]">Female</div>
          <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
            {/* Min Size Female cm */}
            <FormFieldInput
              type="number"
              formFieldName="minSizeFemaleCm"
              label={`Minimum Female Size (cm)`}
              required={true}
              pattern={undefined}
              placeholder="e.g., 8"
              value={minSizeFemaleCm}
              setValue={setMinSizeFemaleCm}
              validateFunction={validateMinSizeFemaleCm}
            />
            {/* Max Size Female cm */}
            <FormFieldInput
              type="number"
              formFieldName="maxSizeFemaleCm"
              label={`Maximum Female Size (cm)`}
              required={true}
              placeholder="e.g., 8"
              pattern={undefined}
              value={maxSizeFemaleCm}
              setValue={setMaxSizeFemaleCm}
              validateFunction={validateMaxSizeFemaleCm}
            />
          </div>
        </div>
        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
          {/* Min Size Female cm */}
          <FormFieldInput
            type="number"
            formFieldName="minWeightFemaleKg"
            label={`Minimum Female Weight (kg)`}
            required={true}
            pattern={undefined}
            placeholder="e.g., 8"
            value={minWeightFemaleKg}
            setValue={setMinWeightFemaleKg}
            validateFunction={validateMinWeightFemaleKg}
          />
          {/* Max Size Female cm */}
          <FormFieldInput
            type="number"
            formFieldName="maxSizeFemaleCm"
            label={`Maximum Female Weight (kg)`}
            required={true}
            placeholder="e.g., 8"
            pattern={undefined}
            value={maxWeightFemaleKg}
            setValue={setMaxWeightFemaleKg}
            validateFunction={validateMaxWeightFemaleKg}
          />
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

export default EditPhysioRefNormForm;
