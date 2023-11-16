import React, { useState } from "react";

import * as Form from "@radix-ui/react-form";


import FormFieldInput from "../FormFieldInput";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import useApiJson from "../../hooks/useApiJson";

import { EnclosureStatus } from "../../enums/Enumurated";
import useApiFormData from "../../hooks/useApiFormData";
import Enclosure from "../../models/Enclosure";
import FormFieldSelect from "../FormFieldSelect";

interface EditEnclosureFormProps {
  curEnclosure: Enclosure;
  refreshSeed: number;
  setRefreshSeed: React.Dispatch<React.SetStateAction<number>>;
}

function EditEnclosureForm(props: EditEnclosureFormProps) {

  const { curEnclosure, refreshSeed, setRefreshSeed } = props;

  const navigate = useNavigate();
  const toastShadcn = useToast().toast;
  const apiJson = useApiJson();
  const apiFormData = useApiFormData();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [name, setName] = useState<string>(curEnclosure.name);
  const [remark, setRemark] = useState<string>(curEnclosure.remark?.toString() || "");
  const [length, setLength] = useState<number>(curEnclosure.length);
  const [width, setWidth] = useState<number>(curEnclosure.width);
  const [height, setHeight] = useState<number>(curEnclosure.height);
  const [standOffBarrierDist, setStandOffBarrierDist] = useState<number>(0);

  const [enclosureStatus, setEnclosureStatus] = useState<string | undefined>(
    curEnclosure.enclosureStatus
  );

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
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files && event.target.files[0];
    setImageFile(file);
  }

  // handle submit
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("remark", remark);
    formData.append("length", length.toString());
    formData.append("width", width.toString());
    formData.append("height", height.toString());
    formData.append("enclosureStatus", enclosureStatus.toString());
    formData.append("standOffBarrierDist", standOffBarrierDist.toString());

    const createEnclosureApi = async () => {
      try {
        const response = await apiFormData.put(
          "http://localhost:3000/api/enclosure/updateEnclosure",
          formData
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
            <span className="self-center text-lg text-graydark">
              Edit Enclosure
            </span>
            <Button disabled className="invisible">
              Back
            </Button>
          </div>
          <Separator />
          <span className="mt-4 self-center text-title-xl font-bold">
            {/* {curEnclosure.name} */}
            "enclosure name"
          </span>
        </div>

        <div className="flex flex-col justify-center gap-6 lg:flex-col lg:gap-12">
          {/* Enclosure Picture */}
          {/* <Form.Field
            name="zooEventImage"
            className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
          >
            <span className="font-medium">Current Image</span>
            <img
              src={
                "http://localhost:3000/"
                // + curEnclosure.facility?.imageUrl
              }
              alt="Current enclosure image"
              className="my-4 aspect-square w-1/5 rounded-full border object-cover shadow-4"
            />
            <Form.Label className="font-medium">
              Change Enclosure Image
            </Form.Label>
            <Form.Control
              type="file"
              required
              accept=".png, .jpg, .jpeg, .webp"
              onChange={handleFileChange}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
            />
            <Form.ValidityState>{validateImage}</Form.ValidityState>
          </Form.Field> */}

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


export default EditEnclosureForm;
