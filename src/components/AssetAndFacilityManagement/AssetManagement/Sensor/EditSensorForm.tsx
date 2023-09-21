import React, { useEffect, useState } from "react";
import * as Form from "@radix-ui/react-form";

import { MultiSelectChangeEvent } from "primereact/multiselect";

import useApiFormData from "../../../../hooks/useApiFormData";
import FormFieldInput from "../../../FormFieldInput";
import Sensor from "../../../../models/Sensor";
import useApiJson from "../../../../hooks/useApiJson";
import { useToast } from "@/components/ui/use-toast";
import FormFieldSelect from "../../../FormFieldSelect";

interface EditSensorFormProps {
  curSensor: Sensor;
  refreshSeed: number;
  setRefreshSeed: React.Dispatch<React.SetStateAction<number>>;
}

function EditSensorForm(props: EditSensorFormProps) {
  const apiFormData = useApiFormData();
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;

  const { curSensor, refreshSeed, setRefreshSeed } = props;

  const [sensorName, setSensorName] = useState<string>(curSensor.sensorName);
  const [sensorType, setSensorType] = useState<
    string | undefined
  >(curSensor.sensorType); // select from set list
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

  function validateSensorName(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter an sensor name
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }


  function validateSensorType(props: ValidityState) {
    // console.log(props);
    if (props != undefined) {
      if (sensorType == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please select an sensor category
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  // end field validations

  function onSensorTypeSelectChange(e: MultiSelectChangeEvent) {
    setSensorType(e.value);

    const element = document.getElementById("selectMultiSensorTypeField");
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
      formData.append("sensorName", sensorName);
      formData.append("sensorType", sensorType || "");
      formData.append("file", imageFile || "");
      try {
        const responseJson = await apiFormData.put(
          "http://localhost:3000/api/assetfacility/updateSensor",
          formData
        );
        // success
        toastShadcn({
          description: "Successfully edited sensor",
        });
        setRefreshSeed(refreshSeed + 1);
      } catch (error: any) {
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while editing sensor details: \n" +
            error.message,
        });
      }
    } else {
      // no image
      const updatedSensorType = sensorType?.toString();
      const updatedSensor = {
        sensorName,
        updatedSensorType
      };

      try {
        const responseJson = await apiJson.put(
          "http://localhost:3000/api/assetfacility/updateSensor",
          updatedSensor
        );
        // success
        toastShadcn({
          description: "Successfully edited sensor",
        });
        setRefreshSeed(refreshSeed + 1);
      } catch (error: any) {
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while editing sensor details: \n" +
            error.message,
        });
      }
    }
  }

  useEffect(() => {
    if (imageFile) {
      if (!apiFormData.loading) {
        if (apiFormData.error) {
          // got error
          toastShadcn({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description:
              "An error has occurred while editing sensor details: \n" +
              apiFormData.error,
          });
        } else if (apiFormData.result) {
          // success
          console.log("success?");
          toastShadcn({
            description: "Successfully edited sensor:",
          });
        }
      }
    } else {
      if (!apiJson.loading) {
        if (apiJson.error) {
          // got error
          toastShadcn({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description:
              "An error has occurred while editing sensor details: \n" +
              apiJson.error,
          });
        } else if (apiJson.result) {
          // success
          console.log("succes?");
          toastShadcn({
            description: "Successfully edited sensor:",
          });
        }
      }
    }
  }, [apiFormData.loading, apiJson.loading]);

  return (
    <div>
      {curSensor && (
        <Form.Root
          className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <span className="self-center text-title-xl font-bold">
            Edit Sensor: {curSensor.sensorName}
          </span>
          <hr className="bg-stroke opacity-20" />
          <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
            {/* Sensor Name */}
            <FormFieldInput
              type="text"
              formFieldName="sensorName"
              label="Sensor Name"
              required={true}
              placeholder="e.g., Carrots, Beef,..."
              value={sensorName}
              setValue={setSensorName}
              validateFunction={validateSensorName}            />

            <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
              {/* Sensor Category */}
              <FormFieldSelect
                formFieldName="sensorType"
                label="Sensor Category"
                required={true}
                placeholder="Select an sensor category..."
                valueLabelPair={[
                  ["TEMPERATURE", "TEMPERATURE"],
                  ["LIGHT", "LIGHT"],
                  ["HUMIDITY", "HUMIDITY"],
                  ["SOUND", "SOUND"],
                  ["MOTION", "MOTION"],
                  ["CAMERA", "CAMERA"]
                ]}
                value={sensorType}
                setValue={setSensorType}
                validateFunction={validateSensorType}
              />
            </div>

            <Form.Submit asChild>
              <button className="mt-10 h-12 w-2/3 self-center rounded-full border bg-primary text-lg text-whiten transition-all hover:bg-opacity-80">
                Submit Edit Sensor
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

export default EditSensorForm;
