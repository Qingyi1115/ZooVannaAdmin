import React, { useState } from "react";

import * as Form from "@radix-ui/react-form";

import useApiJson from "../../../hooks/useApiJson";
import FormFieldInput from "../../FormFieldInput";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import Enclosure from "../../../models/Enclosure";
import { TwoThumbSliderWithNumber } from "../../SpeciesManagement/TwoThumbSliderWithNumber";
interface EditEnclosureEnvironmentFormProps {
  curEnclosure: Enclosure;
}

function EditEnclosureEnvironmentForm(
  props: EditEnclosureEnvironmentFormProps
) {
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();

  const { curEnclosure } = props;

  // fields
  const [enclosureId, setEnclosureId] = useState<number>(
    curEnclosure.enclosureId
  );
  const [landArea, setLandArea] = useState<number | null | undefined>(
    curEnclosure.landArea
  ); // must validate > 0
  const [waterArea, setWaterArea] = useState<number | null | undefined>(
    curEnclosure.waterArea
  );
  const [acceptableTempMin, setAcceptableTempMin] = useState<number | null | undefined>(
    curEnclosure.acceptableTempMin
  );
  const [acceptableTempMax, setAcceptableTempMax] = useState<number | null | undefined>(
    curEnclosure.acceptableTempMax
  );
  const [acceptableHumidityMin, setAcceptableHumidityMin] = useState<number | null | undefined>(
    curEnclosure.acceptableHumidityMin
  );
  const [acceptableHumidityMax, setAcceptableHumidityMax] = useState<number | null | undefined>(
    curEnclosure.acceptableHumidityMax
  );
  // const [
  //   recommendedStandOffBarrierDistMetres,
  //   setRecommendedStandOffBarrierDistMetres,
  // ] = useState<number | undefined>(
  //   curEnclosure.recommendedStandOffBarrierDistMetres
  // );
  const [plantationCoveragePercent, setPlantationCoveragePercent] =
    useState<number | null | undefined>(curEnclosure.plantationCoveragePercent);
  const [longGrassPercent, setLongGrassPercent] = useState<number | null | undefined>(
    curEnclosure.longGrassPercent
  );
  const [shortGrassPercent, setShortGrassPercent] = useState<number | null | undefined>(
    curEnclosure.shortGrassPercent
  );
  const [rockPercent, setRockPercent] = useState<number | null | undefined>(
    curEnclosure.rockPercent
  );
  const [sandPercent, setSandPercent] = useState<number | null | undefined>(
    curEnclosure.sandPercent
  );
  const [snowPercent, setSnowPercent] = useState<number | null | undefined>(
    curEnclosure.snowPercent
  );
  const [soilPercent, setSoilPercent] = useState<number | null | undefined>(
    curEnclosure.soilPercent
  );

  ///////
  // validate functions
  ////////
  function validateLandArea(props: ValidityState) {
    // if (props != undefined) {
    if (landArea <= 0) {
      return (
        <div className="font-medium text-danger">
          * Minimum land area required must be greater than 0
        </div>
      );
    }
    // add any other cases here
    // }
    return null;
  }

  function validateWaterArea(props: ValidityState) {
    // if (props != undefined) {
    if (landArea < 0) {
      return (
        <div className="font-medium text-danger">
          * Minimum water area required must be equal to or greater than 0
        </div>
      );
    }
    // add any other cases here
    // }
    return null;
  }

  function validateMinTemperature(props: ValidityState) {
    if (props != undefined) {
      if (Number(acceptableTempMin) >= Number(acceptableTempMax)) {
        return (
          <div className="font-medium text-danger">
            * Minimum acceptable temperature must be smaller than the maximum
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateMaxTemperature(props: ValidityState) {
    if (props != undefined) {
      if (Number(acceptableTempMin) >= Number(acceptableTempMax)) {
        return (
          <div className="font-medium text-danger">
            * Maximum acceptable temperature must be greater than the minimum
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateMinHumidity(props: ValidityState) {
    if (props != undefined) {
      if (Number(acceptableHumidityMax) < Number(acceptableHumidityMin)) {
        return (
          <div className="font-medium text-danger">
            * Minimum acceptable humidity must be smaller than the maximum
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateMaxHumidity(props: ValidityState) {
    if (props != undefined) {
      if (Number(acceptableHumidityMin) >= Number(acceptableHumidityMax)) {
        return (
          <div className="font-medium text-danger">
            * Maximum acceptable humidity must be greater than the minimum
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  // function validateStandOffBarrierDist(props: ValidityState) {
  //   if (props != undefined) {
  //     if (recommendedStandOffBarrierDistMetres == undefined) {
  //       return (
  //         <div className="font-medium text-danger">
  //           * Please enter a recommended stand-off barrier distance
  //         </div>
  //       );
  //     } else if (recommendedStandOffBarrierDistMetres <= 0) {
  //       return (
  //         <div className="font-medium text-danger">
  //           * Stand-off barrier distance must be greater than 0
  //         </div>
  //       );
  //     }
  //     // add any other cases here
  //   }
  //   return null;
  // }


  ///////
  // validate functions end
  ////////

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Remember, your form must have enctype="multipart/form-data" for upload pictures
    e.preventDefault();
    const newEnclosureRequirements = {
      enclosureId,
      landArea,
      waterArea,
      acceptableTempMin,
      acceptableTempMax,
      acceptableHumidityMin,
      acceptableHumidityMax,
      plantationCoveragePercent,
      longGrassPercent,
      shortGrassPercent,
      rockPercent,
      sandPercent,
      snowPercent,
      soilPercent,
    };

    console.log("new enclosure req obj:", newEnclosureRequirements);

    const updateEnclosureEnclosureRequirements = async () => {
      try {
        const response = await apiJson.put(
          "http://localhost:3000/api/enclosure/updateEnclosureEnvironment",
          newEnclosureRequirements
        );
        // success
        console.log("succes?");
        toastShadcn({
          description: "Successfully updated enclosure environment details.",
        });

        // clearForm();
        navigate(-1);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while updating enclosure environment details: \n" +
            error.message,
        });
      }
    };
    updateEnclosureEnclosureRequirements();
  }

  return (
    <div>
      <Form.Root
        className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">
            <Button
              onClick={() => navigate(-1)}
              variant={"outline"}
              type="button"
              className=""
            >
              Back
            </Button>
            <span className="self-center text-lg text-graydark">
              Edit Enclosure Environment Details
            </span>
            <Button disabled className="invisible">
              Back
            </Button>
          </div>
          <Separator />
          <span className="mt-4 flex flex-col items-center self-center text-title-xl font-bold">
            {curEnclosure.name}
          </span>
        </div>
        <Separator className="opacity-20" />
        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
          {/* Min Land Area Required */}
          <FormFieldInput
            type="number"
            formFieldName="landArea"
            label={`Minimum Land Area Required (m\u00B2)`}
            required={true}
            placeholder="e.g., 8"
            pattern={undefined}
            value={landArea}
            setValue={setLandArea}
            validateFunction={validateLandArea}
          />
          {/* Min Water Area Required */}
          <FormFieldInput
            type="number"
            formFieldName="waterArea"
            label={`Minimum Water Area Required (m\u00B2)`}
            required={true}
            placeholder="e.g., 8"
            pattern={undefined}
            value={waterArea}
            setValue={setWaterArea}
            validateFunction={validateWaterArea}
          />
        </div>
        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
          {/* Min Land Area Required */}
          <FormFieldInput
            type="number"
            formFieldName="acceptableTempMin"
            label={`Minimum acceptable temperate (°C)`}
            required={true}
            placeholder="e.g., 8"
            pattern={undefined}
            value={acceptableTempMin}
            setValue={setAcceptableTempMin}
            validateFunction={validateMinTemperature}
          />
          {/* Min Water Area Required */}
          <FormFieldInput
            type="number"
            formFieldName="acceptableTempMax"
            label={`Maximum acceptable temperate (°C)`}
            required={true}
            placeholder="e.g., 8"
            pattern={undefined}
            value={acceptableTempMax}
            setValue={setAcceptableTempMax}
            validateFunction={validateMaxTemperature}
          />
        </div>
        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
          {/* Min Acceptable Humidity */}
          <FormFieldInput
            type="number"
            formFieldName="acceptableHumidityMin"
            label={`Minimum acceptable humidity (g.m⁻³)`}
            required={true}
            placeholder="e.g., 8"
            pattern={undefined}
            value={acceptableHumidityMin}
            setValue={setAcceptableHumidityMin}
            validateFunction={validateMinHumidity}
          />
          {/* Max Acceptable Humidity */}
          <FormFieldInput
            type="number"
            formFieldName="acceptableTempMax"
            label={`Maximum acceptable humidity (g.m⁻³)`}
            required={true}
            placeholder="e.g., 8"
            pattern={undefined}
            value={acceptableHumidityMax}
            setValue={setAcceptableHumidityMax}
            validateFunction={validateMaxHumidity}
          />
        </div>
        {/* Recommended Stand-off Barrier Distance */}
        {/* <FormFieldInput
          type="number"
          formFieldName="recommendedStandOffBarrierDistMetres"
          label={`Recommended Stand-off Barrier Distance (m)`}
          required={true}
          placeholder="e.g., 12"
          pattern={undefined}
          value={recommendedStandOffBarrierDistMetres}
          setValue={setRecommendedStandOffBarrierDistMetres}
          validateFunction={validateStandOffBarrierDist}
        /> */}
        {/* Plantation Coverage Range */}
        <Form.Field
          name="educationalDescription"
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Label className="font-medium">
            Plantation Coverage Range (%)
          </Form.Label>
          <div className="h-14 w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter">
            <div className="flex h-full items-center justify-center gap-2">
              <span>0%</span>
              <TwoThumbSliderWithNumber
                value={[
                  plantationCoveragePercent, plantationCoveragePercent,
                ]}
                onValueChange={(value) => {
                  // console.log(
                  //   "value[0]: " + value[0] + ", value[1]: " + value[1]
                  // );
                  setPlantationCoveragePercent(value[0]);
                }}
                min={0}
                max={100}
                step={1}
                minStepsBetweenThumbs={0}
              />
              <span>100%</span>
            </div>
          </div>
          {/* <Form.ValidityState> */}
          {/* {validatePlantationCoverageRange} */}
          {/* </Form.ValidityState> */}
        </Form.Field>
        <br />

        {/* Long Grass Coverage Range */}
        <Form.Field
          name="longGrassRange"
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Label className="font-medium">
            <div className="flex items-center gap-2 pl-1">
              <img
                src="../../../../src/assets/terrain/long-grass.jpg"
                className="aspect-square h-6 w-6 rounded-full"
              />
              <span>Long Grass (%)</span>
            </div>
          </Form.Label>
          <div className="h-14 w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter">
            <div className="flex h-full items-center justify-center gap-2">
              <span>0%</span>
              <TwoThumbSliderWithNumber
                value={[longGrassPercent, longGrassPercent]}
                onValueChange={(value) => {
                  setLongGrassPercent(value[0]);
                }}
                min={0}
                max={100}
                step={1}
                minStepsBetweenThumbs={0}
              />
              <span>100%</span>
            </div>
          </div>
        </Form.Field>
        {/* Short Grass Coverage Range */}
        <Form.Field
          name="shortGrassRange"
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Label className="font-medium">
            <div className="flex items-center gap-2 pl-1">
              <img
                src="../../../../src/assets/terrain/short-grass.jpg"
                className="aspect-square h-6 w-6 rounded-full"
              />
              <span>Short Grass (%)</span>
            </div>
          </Form.Label>
          <div className="h-14 w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter">
            <div className="flex h-full items-center justify-center gap-2">
              <span>0%</span>
              <TwoThumbSliderWithNumber
                value={[shortGrassPercent, shortGrassPercent]}
                onValueChange={(value) => {
                  setShortGrassPercent(value[0]);
                }}
                min={0}
                max={100}
                step={1}
                minStepsBetweenThumbs={0}
              />
              <span>100%</span>
            </div>
          </div>
        </Form.Field>
        {/* Soil Coverage Range */}
        <Form.Field
          name="soilRange"
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Label className="font-medium">
            <div className="flex items-center gap-2 pl-1">
              <img
                src="../../../../src/assets/terrain/soil.jpg"
                className="aspect-square h-6 w-6 rounded-full"
              />
              <span>Soil (%)</span>
            </div>
          </Form.Label>
          <div className="h-14 w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter">
            <div className="flex h-full items-center justify-center gap-2">
              <span>0%</span>
              <TwoThumbSliderWithNumber
                value={[soilPercent, soilPercent]}
                onValueChange={(value) => {
                  setSoilPercent(value[0]);
                }}
                min={0}
                max={100}
                step={1}
                minStepsBetweenThumbs={0}
              />
              <span>100%</span>
            </div>
          </div>
        </Form.Field>
        {/* Rock Coverage Range */}
        <Form.Field
          name="rockRange"
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Label className="font-medium">
            <div className="flex items-center gap-2 pl-1">
              <img
                src="../../../../src/assets/terrain/rock.jpg"
                className="aspect-square h-6 w-6 rounded-full"
              />
              <span>Rock (%)</span>
            </div>
          </Form.Label>
          <div className="h-14 w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter">
            <div className="flex h-full items-center justify-center gap-2">
              <span>0%</span>
              <TwoThumbSliderWithNumber
                value={[rockPercent, rockPercent]}
                onValueChange={(value) => {
                  setRockPercent(value[0]);
                }}
                min={0}
                max={100}
                step={1}
                minStepsBetweenThumbs={0}
              />
              <span>100%</span>
            </div>
          </div>
        </Form.Field>
        {/* Rock Coverage Range */}
        <Form.Field
          name="sandRange"
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Label className="font-medium">
            <div className="flex items-center gap-2 pl-1">
              <img
                src="../../../../src/assets/terrain/sand.jpg"
                className="aspect-square h-6 w-6 rounded-full"
              />
              <span>Sand (%)</span>
            </div>
          </Form.Label>
          <div className="h-14 w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter">
            <div className="flex h-full items-center justify-center gap-2">
              <span>0%</span>
              <TwoThumbSliderWithNumber
                value={[sandPercent, sandPercent]}
                onValueChange={(value) => {
                  setSandPercent(value[0]);
                }}
                min={0}
                max={100}
                step={1}
                minStepsBetweenThumbs={0}
              />
              <span>100%</span>
            </div>
          </div>
        </Form.Field>
        {/* Snow Coverage Range */}
        <Form.Field
          name="snowRange"
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Label className="font-medium">
            <div className="flex items-center gap-2 pl-1">
              <img
                src="../../../../src/assets/terrain/snow.jpg"
                className="aspect-square h-6 w-6 rounded-full"
              />
              <span>Snow (%)</span>
            </div>
          </Form.Label>
          <div className="h-14 w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter">
            <div className="flex h-full items-center justify-center gap-2">
              <span>0%</span>
              <TwoThumbSliderWithNumber
                value={[snowPercent, snowPercent]}
                onValueChange={(value) => {
                  setSnowPercent(value[0]);
                }}
                min={0}
                max={100}
                step={1}
                minStepsBetweenThumbs={0}
              />
              <span>100%</span>
            </div>
          </div>
        </Form.Field>
        <Form.Submit asChild>
          <Button
            disabled={apiJson.loading}
            className="h-12 w-2/3 self-center rounded-full text-lg"
          >
            {!apiJson.loading ? <div>Submit</div> : <div>Loading</div>}
          </Button>
        </Form.Submit>
        {/* {formError && (
                  <div className="m-2 border-danger bg-red-100 p-2">{formError}</div>
                )} */}
      </Form.Root>
    </div>
  );
}

export default EditEnclosureEnvironmentForm;
