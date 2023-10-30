import React, { useState, useEffect } from "react";

import * as Form from "@radix-ui/react-form";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Checkbox from "@radix-ui/react-checkbox";

import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";

import useApiFormData from "../../hooks/useApiFormData";
import FormFieldInput from "../FormFieldInput";
import FormFieldSelect from "../FormFieldSelect";
import { HiCheck } from "react-icons/hi";

import useApiJson from "../../hooks/useApiJson";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { NavLink } from "react-router-dom";
import {
  AcquisitionMethod,
  ActivityType,
  AnimalGrowthStage,
  AnimalSex,
  AnimalStatusType,
  EnclosureStatus,
  EventTimingType,
  IdentifierType,
} from "../../enums/Enumurated";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import Species from "../../models/Species";

import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Nullable } from "primereact/ts-helpers";
import { title } from "process";
import BarrierType from "../../models/BarrierType";
import EnrichmentItem from "../../models/EnrichmentItem";
import Keeper from "../../models/Keeper";
import Plantation from "../../models/Plantation";
import ZooEnclosure from "../../models/ZooEnclosure";
import CreateZooEventForm from "../EventManagement/CreateZooEventPage/CreateZooEventForm";
import TerrainDistribution from "../../models/TerrainDistribution";


function CreateZooEnclosureForm() {
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;
  const apiJson = useApiJson();

  const [name, setName] = useState<string>("");
  const [length, setLength] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [landArea, setLandArea] = useState<number>(0);
  const [waterArea, setWaterArea] = useState<number>(0);
  const [plantationCoveragePercent, setPlantationCoveragePercent] =
    useState<number>(0);
  const [standoffBarrierDist, setStandoffBarrierDist] = useState<number>(0);
  const [safetyFeatures, setSafetyFeatures] = useState<string>("");
  const [acceptableTempMin, setAcceptableTempMin] = useState<number>(0);
  const [acceptableTempMax, setAcceptableTempMax] = useState<number>(0);
  const [acceptableHumidityMin, setAcceptableHumidityMin] = useState<number>(0);
  const [acceptableHumidityMax, setAcceptableHumidityMax] = useState<number>(0);
  const [enclosureStatus, setEnclosureStatus] =
    useState<EnclosureStatus>(EnclosureStatus.ACTIVE);
  const [enrichmentItems, setEnrichmentItems] = useState<EnrichmentItem[]>([]);
  const [terrainDistribution, setTerrainDistribution] =
    useState<TerrainDistribution>();
  const [plantations, setPlantations] = useState<Plantation[] | null>(null);
  const [keepers, setKeepers] = useState<Keeper[]>([]);
  const [barrierType, setBarrierType] = useState<BarrierType | null>(null);

  // validate functions
  function validateName(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">* Please enter a name</div>
        );
      }
    }
    return null;
  }

  function validateLength(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter the length
          </div>
        );
      }
      if (props.typeMismatch) {
        return (
          <div className="font-medium text-danger">
            * Please enter a valid number for length
          </div>
        );
      }
    }
    return null;
  }

  function validateWidth(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter the width
          </div>
        );
      }
      if (props.typeMismatch) {
        return (
          <div className="font-medium text-danger">
            * Please enter a valid number for width
          </div>
        );
      }
    }
    return null;
  }

  function validateHeight(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter the height
          </div>
        );
      }
      if (props.typeMismatch) {
        return (
          <div className="font-medium text-danger">
            * Please enter a valid number for height
          </div>
        );
      }
    }
    return null;
  }

  function validateLandArea(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter the land area
          </div>
        );
      }
      if (props.typeMismatch) {
        return (
          <div className="font-medium text-danger">
            * Please enter a valid number for land area
          </div>
        );
      }
    }
    return null;
  }

  function validateWaterArea(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter the water area
          </div>
        );
      }
      if (props.typeMismatch) {
        return (
          <div className="font-medium text-danger">
            * Please enter a valid number for water area
          </div>
        );
      }
    }
    return null;
  }

  function validatePlantationCoveragePercent(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter the plantation coverage percent
          </div>
        );
      }
      if (props.typeMismatch) {
        return (
          <div className="font-medium text-danger">
            * Please enter a valid number for plantation coverage percent
          </div>
        );
      }
    }
    return null;
  }

  function validateStandoffBarrierDist(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter the standoff barrier distance
          </div>
        );
      }
      if (props.typeMismatch) {
        return (
          <div className="font-medium text-danger">
            * Please enter a valid number for standoff barrier distance
          </div>
        );
      }
    }
    return null;
  }

  function validateSafetyFeatures(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter the safety features
          </div>
        );
      }
    }
    return null;
  }

  function validateAcceptableTempMin(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter the acceptable minimum temperature
          </div>
        );
      }
      if (props.typeMismatch) {
        return (
          <div className="font-medium text-danger">
            * Please enter a valid number for acceptable minimum temperature
          </div>
        );
      }
    }
    return null;
  }

  function validateAcceptableTempMax(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter the acceptable maximum temperature
          </div>
        );
      }
      if (props.typeMismatch) {
        return (
          <div className="font-medium text-danger">
            * Please enter a valid number for acceptable maximum temperature
          </div>
        );
      }
    }
    return null;
  }

  function validateAcceptableHumidityMin(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter the acceptable minimum humidity
          </div>
        );
      }
      if (props.typeMismatch) {
        return (
          <div className="font-medium text-danger">
            * Please enter a valid number for acceptable minimum humidity
          </div>
        );
      }
    }
    return null;
  }

  function validateAcceptableHumidityMax(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter the acceptable maximum humidity
          </div>
        );
      }
      if (props.typeMismatch) {
        return (
          <div className="font-medium text-danger">
            * Please enter a valid number for acceptable maximum humidity
          </div>
        );
      }
    }
    return null;
  }


  // handle submit
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newEnclosure: ZooEnclosure = {
      enclosureId: 0,
      name,
      length,
      width,
      height,
      landArea,
      waterArea,
      plantationCoveragePercent,
      standoffBarrierDist,
      safetyFeatures,
      acceptableTempMin,
      acceptableTempMax,
      acceptableHumidityMin,
      acceptableHumidityMax,
      enclosureStatus,
      enrichmentItems,
      terrainDistribution,
      plantations,
      keepers,
      barrierType,
    };


    const createZooEnclosureApi = async () => {
      try {
        const response = await apiJson.post(
          "http://localhost:3000/api/zooEnclosure/createZooEnclosure",
          newEnclosure
        );
        // success
        toastShadcn({
          description: "Successfully created a new event",
        });
        navigate(-1);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while creating new enclosure: \n" +
            error.message,
        });
      }
    };
    createZooEnclosureApi();
  }

  return (
    <div>
      <Form.Root
        className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
        onSubmit={handleSubmit}
      // encType="multipart/form-data"
      >
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">
            {/* <NavLink className="flex" to={`/animal/viewallanimals`}> */}
            <Button
              onClick={() => navigate(-1)}
              variant={"outline"}
              type="button"
              className=""
            >
              Back
            </Button>
            {/* </NavLink> */}
            <span className="self-center text-title-xl font-bold">
              Create Enclosure
            </span>
            <Button disabled className="invisible">
              Back
            </Button>
          </div>
          <Separator />
        </div>

        <div className="flex flex-col justify-center gap-6 lg:flex-col lg:gap-12">
          <FormFieldInput
            label="Name"
            type="text"
            value={name}
            setValue={setName}
            validateFunction={validateName}
            formFieldName={""}
            required={true}
            placeholder={""}
            pattern={undefined} />

          <FormFieldInput
            label="Length"
            type="number"
            value={length}
            setValue={setLength}
            validateFunction={validateLength}
            formFieldName={""} required={true}
            placeholder={""}
            pattern={undefined} />

          <FormFieldInput
            label="Width"
            type="number"
            value={width}
            setValue={setWidth}
            validateFunction={validateWidth}
            formFieldName={""}
            required={true}
            placeholder={""}
            pattern={undefined} />

          <FormFieldInput
            label="Height"
            type="number"
            value={height}
            setValue={setHeight}
            validateFunction={validateHeight}
            formFieldName={""}
            required={true}
            placeholder={""}
            pattern={undefined} />

          <FormFieldInput
            label="Land Area"
            type="number"
            value={landArea}
            setValue={setLandArea}
            validateFunction={validateLandArea}
            formFieldName={""}
            required={true}
            placeholder={""}
            pattern={undefined} />

          <FormFieldInput
            label="Water Area"
            type="number"
            value={waterArea}
            setValue={setWaterArea}
            validateFunction={validateWaterArea}
            formFieldName={""}
            required={true}
            placeholder={""}
            pattern={undefined} />

          <FormFieldInput
            label="Plantation Coverage Percent"
            type="number"
            value={plantationCoveragePercent}
            setValue={setPlantationCoveragePercent}
            validateFunction={validatePlantationCoveragePercent}
            formFieldName={""}
            required={true}
            placeholder={""}
            pattern={undefined} />

          <FormFieldInput

            label="Standoff Barrier Distance"
            type="number"
            value={standoffBarrierDist}
            setValue={setStandoffBarrierDist}
            validateFunction={validateStandoffBarrierDist}
            formFieldName={""}
            required={true}
            placeholder={""}
            pattern={undefined} />

          <FormFieldInput
            label="Safety Features"
            type="text"
            value={safetyFeatures}
            setValue={setSafetyFeatures}
            validateFunction={validateSafetyFeatures} formFieldName={""}
            required={true}
            placeholder={""}
            pattern={undefined} />

          <FormFieldInput
            label="Acceptable Minimum Temperature"
            type="number"
            value={acceptableTempMin}
            setValue={setAcceptableTempMin}
            validateFunction={validateAcceptableTempMin} formFieldName={""}
            required={true}
            placeholder={""}
            pattern={undefined} />

          <FormFieldInput
            label="Acceptable Maximum Temperature"
            type="number"
            value={acceptableTempMax}
            setValue={setAcceptableTempMax}
            validateFunction={validateAcceptableTempMax} formFieldName={""}
            required={true}
            placeholder={""}
            pattern={undefined} />

          <FormFieldInput
            label="Acceptable Minimum Humidity"
            type="number"
            value={acceptableHumidityMin}
            setValue={setAcceptableHumidityMin}
            validateFunction={validateAcceptableHumidityMin} formFieldName={""}
            required={true}
            placeholder={""}
            pattern={undefined} />

          <FormFieldInput
            label="Acceptable Maximum Humidity"
            type="number"
            value={acceptableHumidityMax}
            setValue={setAcceptableHumidityMax}
            validateFunction={validateAcceptableHumidityMax} formFieldName={""}
            required={true}
            placeholder={""}
            pattern={undefined} />
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


export default CreateZooEnclosureForm;
