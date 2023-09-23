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
import Species from "../../../models/Species";
import { TwoThumbSliderWithNumber } from "../TwoThumbSliderWithNumber";
import { NavLink } from "react-router-dom";

import SpeciesEnclosureNeed from "../../../models/SpeciesEnclosureNeed";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
interface EditEducationalContentForm {
  curSpecies: Species;
}

function EditEducationalContentForm(props: EditEducationalContentForm) {
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();
  const { curSpecies } = props;

  // fields
  const speciesCode = curSpecies.speciesCode;
  const [educationalDescription, setEducationalDescription] = useState<string>(
    curSpecies.educationalDescription || ""
  );
  const [educationalFunFact, setEducationalFunFact] = useState<string>(
    curSpecies.educationalFunFact || ""
  );
  // end fields

  // validation
  // end validation

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Remember, your form must have enctype="multipart/form-data" for upload pictures
    e.preventDefault();
    const updatedEducationalContent = {
      speciesCode,
      educationalDescription,
      educationalFunFact,
    };

    const updateEducationalContent = async () => {
      try {
        const response = await apiJson.put(
          "http://localhost:3000/api/species/updateSpeciesEdu",
          updatedEducationalContent
        );
        // success
        console.log("succes?");
        toastShadcn({
          description: "Successfully updated educational.",
        });

        // clearForm();
        const redirectUrl = `/species/viewspeciesdetails/${curSpecies.speciesCode}/educontent`;
        navigate(redirectUrl);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while updating educational content: \n" +
            error.message,
        });
      }
    };
    updateEducationalContent();
  }

  return (
    <div className="">
      <Form.Root
        className="flex w-full flex-col gap-6 rounded-lg bg-white text-black "
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">
            <NavLink
              className="flex"
              to={`/species/viewspeciesdetails/${curSpecies.speciesCode}/educontent`}
            >
              <Button variant={"outline"} type="button" className="">
                Back
              </Button>
            </NavLink>
            <span className="self-center text-lg text-graydark">
              Edit Educational Content
            </span>
            <Button disabled className="invisible">
              Back
            </Button>
          </div>
          <Separator />
          <span className="mt-4 flex flex-col items-center self-center text-title-xl font-bold">
            {curSpecies.commonName}
          </span>
        </div>
        <Separator className="opacity-20" />
        {/* Species Educational Desc */}
        <Form.Field
          name="educationalDescription"
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Label className="font-medium">
            Educational Description
          </Form.Label>
          <Form.Control
            asChild
            value={educationalDescription}
            onChange={(e) => setEducationalDescription(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          >
            <textarea
              rows={6}
              // className="bg-blackA5 shadow-blackA9 selection:color-white selection:bg-blackA9 box-border inline-flex w-full resize-none appearance-none items-center justify-center rounded-[4px] p-[10px] text-[15px] leading-none text-white shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
              required
            />
          </Form.Control>
          {/* <Form.ValidityState>
                {validateEducationalDescription}
              </Form.ValidityState> */}
        </Form.Field>
        {/* Recommended Stand-off Barrier Distance */}
        <FormFieldInput
          type="text"
          formFieldName="educationalFunFact"
          label="Educational Fun Fact"
          required={true}
          placeholder="e.g., 12"
          pattern={undefined}
          value={educationalFunFact}
          setValue={setEducationalFunFact}
          validateFunction={() => null}
        />
        <Form.Submit asChild>
          <Button
            disabled={apiJson.loading}
            className="h-12 w-2/3 self-center rounded-full text-lg"
          >
            {!apiJson.loading ? (
              <div>Edit Educational Content</div>
            ) : (
              <div>Loading</div>
            )}
          </Button>
        </Form.Submit>
        {/* {formError && (
              <div className="m-2 border-danger bg-red-100 p-2">{formError}</div>
            )} */}
      </Form.Root>
    </div>
  );
}

export default EditEducationalContentForm;
