import React, { useState } from "react";

import * as Form from "@radix-ui/react-form";

import useApiJson from "../../../hooks/useApiJson";
import FormFieldInput from "../../FormFieldInput";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import Enclosure from "../../../models/Enclosure";
interface EditEnclosureSafetyFormProps {
  curEnclosure: Enclosure;
}

function EditEnclosureSafetyForm(
  props: EditEnclosureSafetyFormProps
) {
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();

  const { curEnclosure } = props;

  // fields
  const [enclosureId, setEnclosureId] = useState<number>(
    curEnclosure.enclosureId
  );
  const [
    standOffBarrierDist,
    setStandOffBarrierDist,] = useState<number | null>(curEnclosure.standOffBarrierDist);

  ///////
  // validate functions
  ////////

  function validateStandOffBarrierDist(props: ValidityState) {
    if (props != undefined) {
      if (standOffBarrierDist == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please enter a stand-off barrier distance
          </div>
        );
      } else if (standOffBarrierDist <= 0) {
        return (
          <div className="font-medium text-danger">
            * Stand-off barrier distance must be greater than 0
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
      standOffBarrierDist,
      name: curEnclosure.name,
      remark: curEnclosure.remark,
      length: curEnclosure.length,
      width: curEnclosure.width,
      height: curEnclosure.height,
      enclosureStatus: curEnclosure.enclosureStatus,
    };

    console.log("new enclosure req obj:", newEnclosureRequirements);

    const updateEnclosureEnclosureRequirements = async () => {
      try {
        const response = await apiJson.put(
          "http://localhost:3000/api/enclosure/updateEnclosure",
          newEnclosureRequirements
        );
        // success
        console.log("succes?");
        toastShadcn({
          description: "Successfully updated enclosure safety details.",
        });

        // clearForm();
        navigate(-1);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while updating enclosure safety details: \n" +
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
              Edit Enclosure Safety Details
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
        {/* Recommended Stand-off Barrier Distance */}
        <FormFieldInput
          type="number"
          formFieldName="standOffBarrierDist"
          label={`Stand-off Barrier Distance (m)`}
          required={true}
          placeholder="e.g., 12"
          pattern={undefined}
          value={standOffBarrierDist || 0}
          setValue={setStandOffBarrierDist}
          validateFunction={validateStandOffBarrierDist}
        />

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

export default EditEnclosureSafetyForm;
