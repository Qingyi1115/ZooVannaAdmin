import React, { useEffect, useState } from "react";

import * as Form from "@radix-ui/react-form";

import useApiJson from "../../../hooks/useApiJson";
import FormFieldInput from "../../FormFieldInput";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import Enclosure from "../../../models/Enclosure";
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

  const [acceptableTempMin, setAcceptableTempMin] = useState<
    number | null | undefined
  >(curEnclosure.acceptableTempMin);
  const [acceptableTempMax, setAcceptableTempMax] = useState<
    number | null | undefined
  >(curEnclosure.acceptableTempMax);
  const [acceptableHumidityMin, setAcceptableHumidityMin] = useState<
    number | null | undefined
  >(curEnclosure.acceptableHumidityMin);
  const [acceptableHumidityMax, setAcceptableHumidityMax] = useState<
    number | null | undefined
  >(curEnclosure.acceptableHumidityMax);


  /////
  // fetch recommendation
  type Recommends = {
    minLandAreaRequired: number;
    minWaterAreaRequired: number;
    acceptableTempMin: number;
    acceptableTempMax: number;
    acceptableHumidityMin: number;
    acceptableHumidityMax: number;
    plantationCoveragePercentMin: number;
    plantationCoveragePercentMax: number;
    longGrassPercentMin: number;
    longGrassPercentMax: number;
    shortGrassPercentMin: number;
    shortGrassPercentMax: number;
    rockPercentMin: number;
    rockPercentMax: number;
    sandPercentMin: number;
    sandPercentMax: number;
    snowPercentMin: number;
    snowPercentMax: number;
    soilPercentMin: number;
    soilPercentMax: number;
  };
  const [
    enclosureTerrainDistributionRecommendation,
    setEnclosureTerrainDistributionRecommendation,
  ] = useState<Recommends>();
  useEffect(() => {
    const fetchEnclosureTerrainStuffReco = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/enclosure/getEnclosureTerrainDistributionRecommendation/${curEnclosure.enclosureId}`
        );
        // console.log("test");
        // console.log(responseJson);
        setEnclosureTerrainDistributionRecommendation(
          responseJson.enclosureTerrainDistributionReco as Recommends
        );
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchEnclosureTerrainStuffReco();
  }, [curEnclosure]);
  /////

  ///////
  // validate functions
  ////////


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

  ///////
  // validate functions end
  ////////

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Remember, your form must have enctype="multipart/form-data" for upload pictures
    e.preventDefault();
    const newEnclosureRequirements = {
      enclosureId,

      acceptableTempMin,
      acceptableTempMax,
      acceptableHumidityMin,
      acceptableHumidityMax,
    };

    console.log("new enclosure req obj:", newEnclosureRequirements);

    const updateEnclosureEnclosureRequirements = async () => {
      try {
        const response = await apiJson.put(
          "http://localhost:3000/api/enclosure/updateEnclosureClimateDesign",
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


        <div className="text-lg font-bold">Acceptable Condition Ranges</div>
        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
          {/* Min Acceptable Temperature */}
          <div className="w-full">
            <div className="italic">
              Recommended:{" "}
              <span className="font-bold text-emerald-700">
                {enclosureTerrainDistributionRecommendation?.acceptableTempMin !=
                  Number.MIN_SAFE_INTEGER ? (
                  <span>
                    {
                      enclosureTerrainDistributionRecommendation?.acceptableTempMin
                    }
                    °C
                  </span>
                ) : (
                  <span>Not available</span>
                )}
              </span>
            </div>
            <FormFieldInput
              type="number"
              formFieldName="acceptableTempMin"
              label={`Minimum Acceptable Temperate (°C)`}
              required={true}
              placeholder="e.g., 8"
              pattern={undefined}
              value={acceptableTempMin || 0}
              setValue={setAcceptableTempMin}
              validateFunction={validateMinTemperature}
            />
          </div>
          {/* Max Acceptable Temperature */}
          <div className="w-full">
            <div className="italic">
              Recommended:{" "}
              <span className="font-bold text-emerald-700">
                {enclosureTerrainDistributionRecommendation?.acceptableTempMax !=
                  Number.MAX_SAFE_INTEGER ? (
                  <span>
                    {
                      enclosureTerrainDistributionRecommendation?.acceptableTempMax
                    }
                    °C
                  </span>
                ) : (
                  <span>Not available</span>
                )}
              </span>
            </div>
            <FormFieldInput
              type="number"
              formFieldName="acceptableTempMax"
              label={`Maximum Acceptable Temperate (°C)`}
              required={true}
              placeholder="e.g., 8"
              pattern={undefined}
              value={acceptableTempMax || 0}
              setValue={setAcceptableTempMax}
              validateFunction={validateMaxTemperature}
            />
          </div>
        </div>
        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
          {/* Min Acceptable Humidity */}
          <div className="w-full">
            <div className="italic">
              Recommended:{" "}
              <span className="font-bold text-emerald-700">
                {enclosureTerrainDistributionRecommendation?.acceptableHumidityMin !=
                  Number.MIN_SAFE_INTEGER ? (
                  <span>
                    {
                      enclosureTerrainDistributionRecommendation?.acceptableHumidityMin
                    }
                    g.m⁻³
                  </span>
                ) : (
                  <span>Not available</span>
                )}
              </span>
            </div>
            <FormFieldInput
              type="number"
              formFieldName="acceptableHumidityMin"
              label={`Minimum Acceptable Humidity (g.m⁻³)`}
              required={true}
              placeholder="e.g., 8"
              pattern={undefined}
              value={acceptableHumidityMin || 0}
              setValue={setAcceptableHumidityMin}
              validateFunction={validateMinHumidity}
            />
          </div>
          {/* Max Acceptable Humidity */}
          <div className="w-full">
            <div className="italic">
              Recommended:{" "}
              <span className="font-bold text-emerald-700">
                {enclosureTerrainDistributionRecommendation?.acceptableHumidityMax !=
                  Number.MAX_SAFE_INTEGER ? (
                  <span>
                    {
                      enclosureTerrainDistributionRecommendation?.acceptableHumidityMax
                    }
                    g.m⁻³
                  </span>
                ) : (
                  <span>Not available</span>
                )}
              </span>
            </div>
            <FormFieldInput
              type="number"
              formFieldName="acceptableTempMax"
              label={`Maximum Acceptable Humidity (g.m⁻³)`}
              required={true}
              placeholder="e.g., 8"
              pattern={undefined}
              value={acceptableHumidityMax || 0}
              setValue={setAcceptableHumidityMax}
              validateFunction={validateMaxHumidity}
            />
          </div>
        </div>

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
