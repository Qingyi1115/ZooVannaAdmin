import React, { useState, useEffect } from "react";

import * as Form from "@radix-ui/react-form";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Checkbox from "@radix-ui/react-checkbox";

import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";

import useApiFormData from "../../hooks/useApiFormData";
import { HiCheck } from "react-icons/hi";

import useApiJson from "../../hooks/useApiJson";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { NavLink } from "react-router-dom";
import {
  AcquisitionMethod,
  AnimalGrowthStage,
  AnimalSex,
  AnimalStatusType,
  IdentifierType,
} from "../../enums/Enumurated";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import Species from "../../models/Species";

import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

function AddItemToActivityPage() {
  return <div>AddItemToActivityPage</div>;
}

export default AddItemToActivityPage;
