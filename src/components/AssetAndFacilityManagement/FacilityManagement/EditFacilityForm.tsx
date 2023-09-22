import React, { useEffect, useState } from "react";
import * as Form from "@radix-ui/react-form";

import { MultiSelectChangeEvent } from "primereact/multiselect";

import useApiFormData from "../../../hooks/useApiFormData";
import FormFieldInput from "../../FormFieldInput";
import Facility from "../../../models/Facility";
import useApiJson from "../../../hooks/useApiJson";
import { useToast } from "@/components/ui/use-toast";
import FormFieldSelect from "../../../components/FormFieldSelect";

interface EditFacilityFormProps {
  curFacility: Facility;
  refreshSeed: number;
  setRefreshSeed: React.Dispatch<React.SetStateAction<number>>;
}

function EditFacilityForm(props: EditFacilityFormProps) {
  const apiFormData = useApiFormData();
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;

  const { curFacility, refreshSeed, setRefreshSeed } = props;

  const [facilityName, setFacilityName] = useState<string>(curFacility.facilityName);
  const [xCoordinate, setXCoordinate] = useState<number>(curFacility.xCoordinate);
  const [yCoordinate, setYCoordinate] = useState<number>(curFacility.yCoordinate);
  const [facilityDetail, setFacilityDetail] = useState<string>(curFacility.facilityDetail);
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

  function validateFacilityName(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter an facility name
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
      try {
        const responseJson = await apiFormData.put(
          "http://localhost:3000/api/assetFacility/updateFacilityImage",
          formData
        );
        // success
        toastShadcn({
          description: "Successfully edited facility",
        });
        setRefreshSeed(refreshSeed + 1);
      } catch (error: any) {
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while editing facility details: \n" +
            error.message,
        });
      }
    } 
    // no image
    const updatedFacility = {
      facilityName,
      xCoordinate,
      yCoordinate,
      facilityDetail
    };

    try {
      const responseJson = await apiJson.put(
        `http://localhost:3000/api/assetFacility/updateFacility/${curFacility.facilityId}`,
        updatedFacility
      );
      // success
      toastShadcn({
        description: "Successfully edited facility",
      });
      setRefreshSeed(refreshSeed + 1);
    } catch (error: any) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while editing facility details: \n" +
          error.message,
      });
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
              "An error has occurred while editing facility details: \n" +
              apiFormData.error,
          });
        } else if (apiFormData.result) {
          // success
          console.log("success?");
          toastShadcn({
            description: "Successfully edited facility:",
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
              "An error has occurred while editing facility details: \n" +
              apiJson.error,
          });
        } else if (apiJson.result) {
          // success
          console.log("succes?");
          toastShadcn({
            description: "Successfully edited facility:",
          });
        }
      }
    }
  }, [apiFormData.loading, apiJson.loading]);

  return (
    <div>
      {curFacility && (
        <Form.Root
          className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <span className="self-center text-title-xl font-bold">
            Edit Facility: {curFacility.facilityName}
          </span>
          <hr className="bg-stroke opacity-20" />

          <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
            {/* Facility Name */}
            <FormFieldInput
              type="text"
              formFieldName="facilityName"
              label="Facility Name"
              required={true}
              placeholder="e.g., Toilet"
              value={facilityName}
              setValue={setFacilityName}
              validateFunction={validateFacilityName}
              />
            {/* X Coordinate */}
            <FormFieldInput
              type="number"
              formFieldName="xCoordinate"
              label="X Coordinate"
              required={true}
              placeholder="1-1000"
              value={xCoordinate}
              setValue={setXCoordinate}
              validateFunction={validateFacilityName}
              />
            {/* Y Coordinate */}
            <FormFieldInput
              type="number"
              formFieldName="yCoordinate"
              label="Y Coordinate"
              required={true}
              placeholder="1-1000"
              value={yCoordinate}
              setValue={setYCoordinate}
              validateFunction={validateFacilityName}
              />
            <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
              {/* Facility Details */}
              <FormFieldInput
                type="text"
                formFieldName="facilityDetail"
                label="Facility Name"
                required={true}
                placeholder="e.g., Toilet"
                value={facilityDetail}
                setValue={setFacilityDetail}
                validateFunction={validateFacilityName}
                />
            </div>

            <Form.Submit asChild>
              <button className="mt-10 h-12 w-2/3 self-center rounded-full border bg-primary text-lg text-whiten transition-all hover:bg-opacity-80">
                Submit Edit Facility
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

export default EditFacilityForm;
