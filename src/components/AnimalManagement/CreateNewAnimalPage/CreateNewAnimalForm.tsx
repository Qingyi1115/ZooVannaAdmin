import React, { useState, useEffect } from "react";

import * as Form from "@radix-ui/react-form";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Checkbox from "@radix-ui/react-checkbox";

import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";

import useApiFormData from "../../../hooks/useApiFormData";
import FormFieldInput from "../../FormFieldInput";
import FormFieldSelect from "../../FormFieldSelect";
import { HiCheck } from "react-icons/hi";

import useApiJson from "../../../hooks/useApiJson";
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
} from "../../../enums/Enumurated";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import Species from "../../../models/Species";

import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

function CreateNewAnimalForm() {
  const apiFormData = useApiFormData();
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  // fields
  /*
    -animalId: Long
    -animalCode: String
    -houseName: String
    -sex: AnimalSex 
    -dateOfBirth: Date
    -placeOfBirth: String
    -rfidTagNum: String
    -acquisitionMethod: AcquisitionMethod
    -dateOfAcquisition: Date
    -acquisitionRemarks: String
    -currentWeight: double
    -physicalDefiningCharacteristics: String
    -behavioralDefiningCharacteristics: String
    -dateOfDeath: Date
    -locationOfDeath: String
    -causeOfDeath: String
    -growthStage: AnimalGrowthStage
    -animalStatus: List<AnimalStatus>

    -species
    -parent1 (if any), leave blank if unknown
    -parent2 (if any)
  */
  const [speciesList, setSpeciesList] = useState<Species[]>([]);

  const [houseName, setHouseName] = useState<string>("");
  const [sex, setSex] = useState<string | undefined>(undefined);
  const [dateOfBirth, setDateOfBirth] = useState<string | Date | Date[] | null>(
    null
  );
  const [placeOfBirth, setPlaceOfBirth] = useState<string>("");
  // const [rfidTagNum, setRfidTagNum] = useState<string>("");
  const [identifierType, setIdentifierType] = useState<string | undefined>(
    undefined
  );
  const [identifierValue, setIdentifierValue] = useState<string>("");
  const [acquisitionMethod, setAcquisitionMethod] = useState<
    string | undefined
  >(undefined);
  const [dateOfAcquisition, setDateOfAcquisition] = useState<
    string | Date | Date[] | null
  >(null);
  const [acquisitionRemarks, setAcquisitionRemarks] = useState<string>("");
  const [physicalDefiningCharacteristics, setPhysicalDefiningCharacteristics] =
    useState<string>("");
  const [
    behavioralDefiningCharacteristics,
    setBehavioralDefiningCharacteristics,
  ] = useState<string>("");
  const [isGroupString, setIsGroupString] = useState<string | undefined>(
    undefined
  );
  const [isGroup, setIsGroup] = useState<boolean>();
  // const [dateOfDeath, setDateOfDeath] = useState<string | Date | Date[] | null>(
  //   null

  // );
  // const [locationOfDeath, setLocationOfDeath] = useState<string>("");
  // const [causeOfDeath, setCauseOfDeath] = useState<string>("");
  // const [growthStage, setGrowthStage] = useState<string | undefined>(undefined);
  // const animalStatus = "NORMAL";
  const [selectedSpecies, setSelectedSpecies] = useState<Species | undefined>(
    undefined
  );

  const [imageFile, setImageFile] = useState<File | null>(null);

  // get list of all species
  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const responseJson = await apiJson.get(
          "http://localhost:3000/api/species/getallspecies"
        );
        setSpeciesList(responseJson as Species[]);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchSpecies();
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

  function validateIsGroup(props: ValidityState) {
    if (props != undefined) {
      if (isGroupString == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please select whether this is a Group or Individual animal!
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateIdentifierType(props: ValidityState) {
    if (props != undefined) {
      if (identifierType == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please select an identifier type! Select "None" if no non-natural
            identifier is used
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateHouseName(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter a house name
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateAnimalSex(props: ValidityState) {
    // console.log(props);
    if (props != undefined) {
      if (sex == undefined) {
        return (
          <div className="font-medium text-danger">* Please select a sex</div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateSpecies(props: ValidityState) {
    // console.log(props);
    if (props != undefined) {
      if (selectedSpecies == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please select a species
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateAcquisitionMethod(props: ValidityState) {
    // console.log(props);
    if (props != undefined) {
      if (sex == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please select an acquisition method
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateDateOfAcquisition(props: ValidityState) {
    if (props != undefined) {
      if (dateOfAcquisition == null) {
        return (
          <div className="font-medium text-danger">
            * Please enter the date of acquisition
          </div>
        );
      }
    }
    // add any other cases here
    return null;
  }

  function validatePhysicalDefiningCharacteristics(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter some physical defining characteristics
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateBehaviouralDefiningCharacteristics(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter some behavioural defining characteristics
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  // end validate functions

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files && event.target.files[0];
    setImageFile(file);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Remember, your form must have enctype="multipart/form-data" for upload pictures
    e.preventDefault();
    console.log(selectedSpecies);

    const formData = new FormData();
    formData.append("speciesCode", selectedSpecies?.speciesCode || "");
    formData.append("houseName", houseName);
    formData.append("isGroup", isGroup?.toString() || "false");
    formData.append("sex", sex?.toString() || "");
    formData.append("dateOfBirth", dateOfBirth?.toString() || "");
    formData.append("placeOfBirth", placeOfBirth);
    // formData.append("rfidTagNum", rfidTagNum);
    formData.append("identifierType", identifierType || "");
    formData.append("identifierValue", identifierValue);
    formData.append("acquisitionMethod", acquisitionMethod?.toString() || "");
    formData.append("acquisitionRemarks", acquisitionRemarks);
    formData.append("dateOfAcquisition", dateOfAcquisition?.toString() || "");
    formData.append(
      "physicalDefiningCharacteristics",
      physicalDefiningCharacteristics
    );
    formData.append(
      "behavioralDefiningCharacteristics",
      behavioralDefiningCharacteristics
    );
    formData.append("growthStage", "UNKNOWN");
    formData.append("animalStatus", "NORMAL");
    formData.append("file", imageFile || "");

    // formData.append("dateOfDeath", "");
    // formData.append("locationOfDeath", "");
    // formData.append("causeOfDeath", "");

    const createAnimal = async () => {
      try {
        const response = await apiFormData.post(
          "http://localhost:3000/api/animal/createNewAnimal",
          formData
        );
        // success
        console.log("succes?");
        toastShadcn({
          description: "Successfully created a new animal",
        });

        // clearForm();
        navigate("/animal/viewallanimals");
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while creating a new animal: " +
            error.message,
        });
      }
    };
    createAnimal();
  }

  // species dropdown
  const selectedSpeciesTemplate = (option: Species, props: any) => {
    if (option) {
      return (
        <div className="align-items-center flex">
          <img
            alt={option.commonName}
            src={"http://localhost:3000/" + option.imageUrl}
            className="mr-2 aspect-square h-6 w-6 rounded-full object-cover"
          />
          <div>{option.commonName}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const speceiesOptionTemplate = (option: Species) => {
    return (
      <div className="align-items-center flex">
        <img
          alt={option.commonName}
          src={"http://localhost:3000/" + option.imageUrl}
          className="mr-2 aspect-square h-8 w-8 rounded-full object-cover"
        />
        <div>{option.commonName}</div>
      </div>
    );
  };

  return (
    <div>
      <Form.Root
        className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        {/* Title Header and back button */}
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">
            <NavLink className="flex" to={`/animal/viewallanimals`}>
              <Button variant={"outline"} type="button" className="">
                Back
              </Button>
            </NavLink>
            <span className="self-center text-title-xl font-bold">
              Create Individual/Group Animal
            </span>
            <Button disabled className="invisible">
              Back
            </Button>
          </div>
          <Separator />
        </div>

        {/* Animal Picture */}
        <Form.Field
          name="speciesImage"
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Label className="font-medium">Animal Image</Form.Label>
          <Form.Control
            type="file"
            required
            asChild
            // accept=".png, .jpg, .jpeg, .webp"
            // onChange={handleFileChange}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          >
            <input
              type="file"
              id="speciesImage"
              accept=".jpeg, .png, .jpg ,.webp"
              onChange={handleFileChange}
            />
          </Form.Control>
          <Form.ValidityState>{validateImage}</Form.ValidityState>
        </Form.Field>

        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
          {/* House Name */}
          <FormFieldInput
            type="text"
            formFieldName="houseName"
            label="House Name"
            required={true}
            placeholder="e.g., Andy, Bob, Charlie,..."
            pattern={undefined}
            value={houseName}
            setValue={setHouseName}
            validateFunction={validateHouseName}
          />

          <FormFieldSelect
            formFieldName="isGroupString"
            label="Is Group Animal?"
            required={true}
            placeholder="Is this a group animal?"
            valueLabelPair={[
              ["true", "Yes"],
              ["false", "No"],
            ]}
            value={isGroupString}
            setValue={(e) => {
              if (e && e !== "undefined") {
                setIsGroupString(e);
                if (e === "true") {
                  setIsGroup(true);
                } else {
                  setIsGroup(false);
                }
              }
            }}
            validateFunction={validateIsGroup}
          />
        </div>

        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
          <FormFieldSelect
            formFieldName="identifierType"
            label="Identifier Type"
            required={true}
            placeholder="Select an identifier type..."
            valueLabelPair={Object.keys(IdentifierType).map(
              (identifierTypeKey) => [
                IdentifierType[
                  identifierTypeKey as keyof typeof IdentifierType
                ].toString(),
                IdentifierType[
                  identifierTypeKey as keyof typeof IdentifierType
                ].toString(),
              ]
            )}
            value={identifierType}
            setValue={setIdentifierType}
            validateFunction={validateIdentifierType}
          />
          {/* RFID Tag Number */}
          <FormFieldInput
            type="text"
            formFieldName="identifierValue"
            label="Identifier Value (if any)"
            required={false}
            placeholder="e.g., RFID12345, YELLOW..."
            pattern={undefined}
            value={identifierValue}
            setValue={setIdentifierValue}
            validateFunction={() => null}
          />
        </div>

        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
          {/* Animal Sex */}
          <FormFieldSelect
            formFieldName="sex"
            label="Animal Sex"
            required={true}
            placeholder="Select a sex..."
            valueLabelPair={Object.keys(AnimalSex).map((animalSexKey) => [
              animalSexKey.toString(),
              AnimalSex[animalSexKey as keyof typeof AnimalSex].toString(),
            ])}
            value={sex}
            setValue={setSex}
            validateFunction={validateAnimalSex}
          />

          {/* Date of Birth */}
          <Form.Field
            name="species"
            id="speciesField"
            className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
          >
            <Form.Label className="font-medium">Species</Form.Label>
            <Form.Control
              className="hidden"
              type="text"
              value={selectedSpecies?.commonName}
              required={true}
              onChange={() => null}
            ></Form.Control>
            <Dropdown
              value={selectedSpecies}
              onChange={(e: DropdownChangeEvent) => {
                setSelectedSpecies(e.value);
                const element = document.getElementById("speciesField");
                if (element) {
                  const isDataInvalid = element.getAttribute("data-invalid");
                  if (isDataInvalid == "true") {
                    element.setAttribute("data-valid", "true");
                    element.removeAttribute("data-invalid");
                  }
                }
              }}
              options={speciesList}
              optionLabel="commonName"
              placeholder="Select a Species"
              filter
              valueTemplate={selectedSpeciesTemplate}
              itemTemplate={speceiesOptionTemplate}
              className="md:w-14rem w-full"
            />
            <Form.ValidityState>{validateSpecies}</Form.ValidityState>
          </Form.Field>
        </div>

        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
          {/* Place of Birth */}
          <FormFieldInput
            type="text"
            formFieldName="placeOfBirth"
            label="Place of Birth (leave blank if unknown)"
            required={false}
            placeholder="e.g., African savannah, XYZ Zoo, Merlion Zoo,..."
            pattern={undefined}
            value={placeOfBirth}
            setValue={setPlaceOfBirth}
            validateFunction={() => null}
          />

          {/* Date of Birth */}
          <Form.Field
            name="dateOfBirth"
            className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
          >
            <Form.Label className="font-medium">
              Date of Birth (leave blank if unknown)
            </Form.Label>
            <Calendar
              value={dateOfBirth}
              className="w-fit"
              onChange={(e: CalendarChangeEvent) => {
                if (e && e.value !== undefined) {
                  setDateOfBirth(e.value);
                }
              }}
            />
            {/* <Form.ValidityState>{validateImage}</Form.ValidityState> */}
          </Form.Field>
        </div>

        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
          {/* Acquisition Method */}
          <FormFieldSelect
            formFieldName="acquisitionMethod"
            label="Acquisition Method"
            required={true}
            placeholder="Select an acquisition method..."
            valueLabelPair={Object.keys(AcquisitionMethod).map(
              (acquisitionMethodKey) => [
                // acquisitionMethodKey.toString(),
                AcquisitionMethod[
                  acquisitionMethodKey as keyof typeof AcquisitionMethod
                ].toString(),
                AcquisitionMethod[
                  acquisitionMethodKey as keyof typeof AcquisitionMethod
                ].toString(),
              ]
            )}
            value={acquisitionMethod}
            setValue={setAcquisitionMethod}
            validateFunction={validateAcquisitionMethod}
          />

          {/* Date of Acquisition */}
          <Form.Field
            name="dateOfAcquisition"
            id="dateOfAcquisitionField"
            className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
          >
            <Form.Label className="font-medium">Date of Acquisition</Form.Label>
            <Form.Control
              className="hidden"
              type="text"
              value={dateOfAcquisition?.toString()}
              required={true}
              onChange={() => null}
            ></Form.Control>
            <Calendar
              value={dateOfAcquisition}
              className="w-fit"
              onChange={(e: CalendarChangeEvent) => {
                if (e && e.value !== undefined) {
                  setDateOfAcquisition(e.value);

                  const element = document.getElementById(
                    "dateOfAcquisitionField"
                  );
                  if (element) {
                    const isDataInvalid = element.getAttribute("data-invalid");
                    if (isDataInvalid == "true") {
                      element.setAttribute("data-valid", "true");
                      element.removeAttribute("data-invalid");
                    }
                  }
                }
              }}
            />
            <Form.ValidityState>{validateDateOfAcquisition}</Form.ValidityState>
          </Form.Field>
        </div>

        {/* Acquisition Remarks */}
        <Form.Field
          name="physicalDefiningCharacteristics"
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Label className="font-medium">
            Acquisition Remarks (if any)
          </Form.Label>
          <Form.Control
            asChild
            value={acquisitionRemarks}
            onChange={(e) => setAcquisitionRemarks(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium shadow-md outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          >
            <textarea
              rows={3}
              placeholder="e.g., as part of XX breeding program, transferred from XYZ zoo,..."
              // className="bg-blackA5 shadow-blackA9 selection:color-white selection:bg-blackA9 box-border inline-flex w-full resize-none appearance-none items-center justify-center rounded-[4px] p-[10px] text-[15px] leading-none text-white shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
            />
          </Form.Control>
          {/* <Form.ValidityState>
                {validateEducationalDescription}
              </Form.ValidityState> */}
        </Form.Field>

        {/* Physical Defining Characteristics */}
        <Form.Field
          name="physicalDefiningCharacteristics"
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Label className="font-medium">
            Physical Defining Characteristics
          </Form.Label>
          <Form.Control
            asChild
            value={physicalDefiningCharacteristics}
            required={true}
            onChange={(e) => setPhysicalDefiningCharacteristics(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium shadow-md outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          >
            <textarea
              rows={6}
              placeholder="e.g., dark spot to the left of the eye, dark mane down to the belly,..."
              // className="bg-blackA5 shadow-blackA9 selection:color-white selection:bg-blackA9 box-border inline-flex w-full resize-none appearance-none items-center justify-center rounded-[4px] p-[10px] text-[15px] leading-none text-white shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
            />
          </Form.Control>
          <Form.ValidityState>
            {validatePhysicalDefiningCharacteristics}
          </Form.ValidityState>
        </Form.Field>

        {/* Behavioural Defining Characteristics */}
        <Form.Field
          name="physicalDefiningCharacteristics"
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Label className="font-medium">
            Behavioural Defining Characteristics
          </Form.Label>
          <Form.Control
            asChild
            value={behavioralDefiningCharacteristics}
            required={true}
            onChange={(e) =>
              setBehavioralDefiningCharacteristics(e.target.value)
            }
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium shadow-md outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          >
            <textarea
              rows={6}
              placeholder="e.g., the dominant one in the group, the docile one,..."
              // className="bg-blackA5 shadow-blackA9 selection:color-white selection:bg-blackA9 box-border inline-flex w-full resize-none appearance-none items-center justify-center rounded-[4px] p-[10px] text-[15px] leading-none text-white shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
            />
          </Form.Control>
          <Form.ValidityState>
            {validateBehaviouralDefiningCharacteristics}
          </Form.ValidityState>
        </Form.Field>

        <Form.Submit asChild>
          <Button
            disabled={apiFormData.loading}
            className="h-12 w-2/3 self-center rounded-full text-lg"
          >
            {!apiFormData.loading ? <div>Submit</div> : <div>Loading</div>}
          </Button>
        </Form.Submit>
      </Form.Root>
    </div>
  );
}

export default CreateNewAnimalForm;
