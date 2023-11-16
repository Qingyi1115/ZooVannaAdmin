import React, { useEffect, useState } from "react";

import * as Form from "@radix-ui/react-form";


import FormFieldInput from "../FormFieldInput";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import {
  EnclosureStatus
} from "../../enums/Enumurated";
import useApiJson from "../../hooks/useApiJson";

import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import useApiFormData from "../../hooks/useApiFormData";
import Facility from "../../models/Facility";
import FormFieldSelect from "../FormFieldSelect";


function CreateNewEnclosureForm() {
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;
  const apiJson = useApiJson();
  const apiFormData = useApiFormData();
  const [curFacilityList, setCurFacilityList] = useState<any>(null);
  const [selectedFacility, setSelectedFacility] = useState<Facility[]>([]);
  const [name, setName] = useState<string>("");
  const [remark, setRemark] = useState<string>("");
  const [length, setLength] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [standOffBarrierDist, setStandOffBarrierDist] = useState<number>(0);
  const [xCoordinate, setXCoordinate] = useState<number>(0);
  const [yCoordinate, setYCoordinate] =
    useState<number>(0);
  const [enclosureStatus, setEnclosureStatus] = useState<string | undefined>(
    undefined
  );



  useEffect(() => {
    apiJson
      .post("http://localhost:3000/api/assetFacility/getAllFacility", {
        includes: ["facilityDetail"],
      })
      .catch((e) => {
        console.log(e);
      })
      .then((res) => {
        console.log("req", res)
        setCurFacilityList(res["facilities"]);
      });
  }, []);

  // validate functions
  function validateImage(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please upload an image
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateName(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">* Please enter a value</div>
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

  function validateStandOffBarrierDist(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter the stand off barrier distance
          </div>
        );
      }
      if (props.typeMismatch) {
        return (
          <div className="font-medium text-danger">
            * Please enter a valid number for stand off barrier distance
          </div>
        );
      }
    }
    return null;
  }

  function validateXCoordinate(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter the x coordinate
          </div>
        );
      }
      if (props.typeMismatch) {
        return (
          <div className="font-medium text-danger">
            * Please enter a valid number for x coordinate
          </div>
        );
      }
    }
    return null;
  }

  function validateYCoordinate(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter the y coordinate
          </div>
        );
      }
      if (props.typeMismatch) {
        return (
          <div className="font-medium text-danger">
            * Please enter a valid number for y coordinate
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

  function validateFacility(props: ValidityState) {
    if (props != undefined) {
      if (selectedFacility.length == 0) {
        return (
          <div className="font-medium text-danger">
            * Please select a facility
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateEnclosureStatus(props: ValidityState) {
    if (props != undefined) {
      if (enclosureStatus == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please select an enclosure status!
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }
  // Enclosure Image
  // function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
  //   const file = event.target.files && event.target.files[0];
  //   setImageFile(file);
  // }

  // handle submit
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const newEnclosure = {
      imageUrl: selectedFacility[0].imageUrl,
      name: name,
      remark: remark,
      length: length,
      width: width,
      height: height,
      standOffBarrierDist: standOffBarrierDist,
      xCoordinate: xCoordinate,
      yCoordinate: yCoordinate,
      facilityId: selectedFacility[0].facilityId,
      facilityName: selectedFacility[0].facilityName,
      isSheltered: selectedFacility[0].isSheltered,
      facilityDetail: selectedFacility[0].facilityDetail,
      facilityDetailJson: selectedFacility[0].facilityDetailJson,
      enclosureStatus: enclosureStatus,
    }

    console.log("facility", selectedFacility[0])

    const createEnclosureApi = async () => {
      try {
        const response = await apiJson.post(
          "http://localhost:3000/api/enclosure/createNewEnclosure",
          newEnclosure
        );
        // success
        toastShadcn({
          description: "Successfully created new enclosure",
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
    createEnclosureApi();
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
          {/* Facility */}
          <Form.Field
            name="facility"
            className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
          >
            <Form.Label className="font-medium">
              Facility
            </Form.Label>
            <MultiSelect
              value={selectedFacility}
              onChange={(e: MultiSelectChangeEvent) => setSelectedFacility(e.value)}
              options={curFacilityList}
              optionLabel="facilityName"
              filter
              display="chip"
              selectionLimit={1}
              placeholder="Select Facility"
              // maxSelectedLabels={3}
              className="w-full md:w-20rem" />
            <Form.ValidityState>
              {validateFacility}
            </Form.ValidityState>
          </Form.Field>

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
            label="Remark"
            type="text"
            value={remark}
            setValue={setRemark}
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
            label="Stand Off Barrier Distance"
            type="number"
            value={standOffBarrierDist}
            setValue={setStandOffBarrierDist}
            validateFunction={validateStandOffBarrierDist}
            formFieldName={""}
            required={true}
            placeholder={""}
            pattern={undefined} />

          <FormFieldInput
            label="X Coordinate"
            type="number"
            value={xCoordinate}
            setValue={setXCoordinate}
            validateFunction={validateXCoordinate}
            formFieldName={""}
            required={true}
            placeholder={""}
            pattern={undefined} />

          <FormFieldInput
            label="Y Coordinate"
            type="number"
            value={yCoordinate}
            setValue={setYCoordinate}
            validateFunction={validateYCoordinate}
            formFieldName={""}
            required={true}
            placeholder={""}
            pattern={undefined} />

          {/* Enclosure Status */}
          <FormFieldSelect
            formFieldName="enclosureStatus"
            label="Enclosure Status"
            required={true}
            placeholder="Select an enclosure status..."
            valueLabelPair={Object.keys(EnclosureStatus).map((activiTypeKey) => [
              EnclosureStatus[
                activiTypeKey as keyof typeof EnclosureStatus
              ].toString(),
              EnclosureStatus[
                activiTypeKey as keyof typeof EnclosureStatus
              ].toString(),
            ])}
            value={enclosureStatus}
            setValue={setEnclosureStatus}
            validateFunction={validateEnclosureStatus}
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


export default CreateNewEnclosureForm;
