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

interface EditEnclosureRequirementsFormProps {
  curSpecies: Species;
}

function EditEnclosureRequirementsForm(
  props: EditEnclosureRequirementsFormProps
) {
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;

  const { curSpecies } = props;

  return <div>EditEnclosureRequirementsForm</div>;
}

export default EditEnclosureRequirementsForm;
