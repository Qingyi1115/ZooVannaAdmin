import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Checkbox from "@radix-ui/react-checkbox";

import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";

import useApiFormData from "../../../hooks/useApiFormData";
import FormFieldInput from "../../FormFieldInput";
import FormFieldSelect from "../../FormFieldSelect";
import { ContinentEnum } from "../../../enums/ContinentEnum";
import { HiCheck } from "react-icons/hi";
import { BiomeEnum } from "../../../enums/BiomeEnum";
import FormFieldRadioGroup from "../../FormFieldRadioGroup";
import Species from "src/models/Species";

interface EditSpeciesFormProps {
  curSpecies: Species;
}

function EditSpeciesForm(props: EditSpeciesFormProps) {
  const apiFormData = useApiFormData();

  const { curSpecies } = props;

  //   const [speciesCode, setSpeciesCode] = useState<string>("");
  const [commonName, setCommonName] = useState<string>(curSpecies.commonName);
  const [scientificName, setScientificName] = useState<string>(
    curSpecies.scientificName
  );
  const [aliasName, setAliasName] = useState<string>(curSpecies.aliasName);
  const [conservationStatus, setConservationStatus] = useState<
    string | undefined
  >(curSpecies.conservationStatus); // select from set list
  const [domain, setDomain] = useState<string | undefined>(curSpecies.domain);
  const [kingdom, setKingdom] = useState<string | undefined>(
    curSpecies.kingdom
  );
  const [phylum, setPhylum] = useState<string>(curSpecies.phylum);
  const [speciesClass, setSpeciesClass] = useState<string>(
    curSpecies.speciesClass
  );
  const [order, setOrder] = useState<string>(curSpecies.order);
  const [family, setFamily] = useState<string>(curSpecies.family);
  const [genus, setGenus] = useState<string>(curSpecies.genus);
  const [nativeContinent, setNativeContinent] = useState<string | undefined>(
    curSpecies.nativeContinent
  );
  const [selectedBiomes, setSelectedBiomes] = useState<string[] | undefined>(
    curSpecies.nativeBiomes.split(", ")
  );
  const [groupSexualDynamic, setGroupSexualDynamic] = useState<
    string | undefined
  >(curSpecies.groupSexualDynamic);
  const [habitatOrExhibit, setHabitatOrExhibit] = useState<string | undefined>(
    curSpecies.habitatOrExhibit
  );
  const [generalDietPreference, setGeneralDietPreference] = useState<
    string | undefined
  >(curSpecies.generalDietPreference);
  const [imageUrl, setImageUrl] = useState<string | null>(curSpecies.imageUrl);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formError, setFormError] = useState<string | null>(null);

  // field validations
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

  function validateCommonName(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter a common name
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateScientificName(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter a scientific name
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  // Alias name is nullable

  function validateConservationStatus(props: ValidityState) {
    // console.log(props);
    if (props != undefined) {
      if (conservationStatus == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please select a conservation status
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateDomain(props: ValidityState) {
    if (props != undefined) {
      if (domain == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please select a domain
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateKingdom(props: ValidityState) {
    if (props != undefined) {
      if (kingdom == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please select a kingdom
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validatePhylum(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">* Please enter a phylum</div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateSpeciesClass(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">* Please enter a class</div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateOrder(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">* Please enter an order</div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateFamily(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">* Please enter a family</div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateGenus(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">* Please enter a genus</div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateNativeContinent(props: ValidityState) {
    if (props != undefined) {
      if (nativeContinent == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please select a native continent
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateNativeBiome(props: ValidityState) {
    if (props != undefined) {
      if (selectedBiomes == undefined || selectedBiomes.length < 1) {
        return (
          <div className="font-medium text-danger">
            * Please select native biomes
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateGroupSexualDynamic(props: ValidityState) {
    if (props != undefined) {
      if (groupSexualDynamic == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please select a group sexual dynamic
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateGeneralDietPreference(props: ValidityState) {
    if (props != undefined) {
      if (generalDietPreference == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please select a diet preference
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateHabitatOrExhibit(props: ValidityState) {
    // console.log(props);
    if (props != undefined) {
      if (habitatOrExhibit == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please select whether the animal requires a habitat or exhibit
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  // end field validations

  function onBiomeSelectChange(e: MultiSelectChangeEvent) {
    setSelectedBiomes(e.value);

    const element = document.getElementById("selectMultiBiomeField");
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
    const formData = new FormData();
    formData.append("commonName", commonName);
    formData.append("scientificName", scientificName);
    formData.append("aliasName", aliasName);
    formData.append("conservationStatus", conservationStatus || "");
    formData.append("domain", domain || "");
    formData.append("kingdom", kingdom || "");
    formData.append("phylum", phylum);
    formData.append("speciesClass", speciesClass);
    formData.append("order", order);
    formData.append("family", family);
    formData.append("genus", genus);
    formData.append("nativeContinent", nativeContinent || "");
    formData.append("selectedBiomes", selectedBiomes?.toString() || "");
    formData.append("groupSexualDynamic", groupSexualDynamic || "");
    formData.append("habitatOrExhibit", habitatOrExhibit || "");
    formData.append("generalDietPreference", generalDietPreference || "");
    formData.append("educationalDescription", "educationalDescription");
    formData.append("file", imageFile || "");
    await apiFormData.post("", formData);
    console.log(apiFormData.result);
  }

  return (
    <Form.Root
      className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <span className="self-center text-title-xl font-bold">
        Edit Species: {curSpecies.commonName}
      </span>
      <hr className="bg-stroke opacity-20" />
      {/* Species Picture */}
      <Form.Field
        name="speciesImage"
        className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
      >
        <Form.Label className="font-medium">Species Image</Form.Label>
        <Form.Control
          type="file"
          required
          accept=".png, .jpg, .jpeg, .webp"
          onChange={handleFileChange}
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
        />
        <Form.ValidityState>{validateImage}</Form.ValidityState>
      </Form.Field>
      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
        {/* Common Name */}
        <FormFieldInput
          type="text"
          formFieldName="commonName"
          label="Common Name"
          required={true}
          placeholder="e.g., African Lion, Sumatran Tiger,..."
          value={commonName}
          setValue={setCommonName}
          validateFunction={validateCommonName}
        />
        {/* Scientific Name */}
        <FormFieldInput
          type="text"
          formFieldName="scientificName"
          label="Scientific Name (Binomial/Trinomial Name)"
          required={true}
          placeholder="e.g., Homo sapiens, Panthera leo leo..."
          value={scientificName}
          setValue={setScientificName}
          validateFunction={validateScientificName}
        />
      </div>

      {/* Alias Name */}
      <FormFieldInput
        type="text"
        formFieldName="aliasName"
        label="Alias Name"
        required={false}
        placeholder="e.g., Great Capybara, Sunda Island Tiger,..."
        value={aliasName}
        setValue={setAliasName}
        validateFunction={() => null}
      />

      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
        {/* Conservation Status */}
        <FormFieldRadioGroup
          formFieldName="conservationStatus"
          label="Conservation Status"
          required={true}
          valueIdPair={[
            ["Data Deficient", "r1"],
            ["Domesticated", "r2"],
            ["Least Concern", "r3"],
            ["Near Threatened", "r4"],
            ["Vulnerable", "r5"],
            ["Endangered", "r6"],
            ["Critically Endangered", "r7"],
            ["Extinct In Wild", "r8"],
          ]}
          value={conservationStatus}
          setValue={setConservationStatus}
          validateFunction={validateConservationStatus}
        />
      </div>

      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
        {/* Domain */}
        <FormFieldSelect
          formFieldName="domain"
          label="Species Domain"
          required={true}
          placeholder="Select a domain..."
          valueLabelPair={[
            ["Archaea", "Archaea"],
            ["Bacteria", "Bacteria"],
            ["Eukarya", "Eukarya"],
          ]}
          value={domain}
          setValue={setDomain}
          validateFunction={validateDomain}
        />

        {/* Kingdom */}
        <FormFieldSelect
          formFieldName="kingdom"
          label="Species Kingdom"
          required={true}
          placeholder="Select a kingdom..."
          valueLabelPair={[
            ["Animalia", "Animalia"],
            ["Archaea", "Archaea"],
            ["Bacteria", "Bacteria"],
            ["Chromista", "Chromista"],
            ["Fungi", "Fungi"],
            ["Plantae", "Plantae"],
            ["Protozoa", "Protozoa"],
          ]}
          value={kingdom}
          setValue={setKingdom}
          validateFunction={validateKingdom}
        />
      </div>

      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
        {/* Species Phylum */}
        <FormFieldInput
          type="text"
          formFieldName="phylum"
          label="Phylum"
          required={true}
          placeholder="e.g., Chordata, Entoprocta,..."
          value={phylum}
          setValue={setPhylum}
          validateFunction={validatePhylum}
        />
        {/* Species Class */}
        <FormFieldInput
          type="text"
          formFieldName="speciesClass"
          label="Class"
          required={true}
          placeholder="e.g., Mammalia, Reptilia..."
          value={speciesClass}
          setValue={setSpeciesClass}
          validateFunction={validateSpeciesClass}
        />
      </div>

      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
        {/* Species Order */}
        <FormFieldInput
          type="text"
          formFieldName="order"
          label="Order"
          required={true}
          placeholder="e.g., Rodentia, Carnivora..."
          value={order}
          setValue={setOrder}
          validateFunction={validateOrder}
        />
        {/* Species Family */}
        <FormFieldInput
          type="text"
          formFieldName="family"
          label="Family"
          required={true}
          placeholder="e.g., Caviidae, Felidae..."
          value={family}
          setValue={setFamily}
          validateFunction={validateFamily}
        />
      </div>

      {/* Species Genus */}
      <FormFieldInput
        type="text"
        formFieldName="genus"
        label="Genus"
        required={true}
        placeholder="e.g., Homo, Panthera..."
        value={genus}
        setValue={setGenus}
        validateFunction={validateGenus}
      />

      {/* Native Continent */}
      <FormFieldSelect
        formFieldName="nativeContinent"
        label="Native Continent"
        required={true}
        placeholder="Select a continent..."
        valueLabelPair={Object.values(ContinentEnum).map((continent) => [
          continent,
          continent,
        ])}
        value={nativeContinent}
        setValue={setNativeContinent}
        validateFunction={validateNativeContinent}
      />

      {/* Biomes */}
      <Form.Field
        id="selectMultiBiomeField"
        name="biomes"
        className="flex flex-col gap-1 data-[invalid]:text-danger lg:w-full"
      >
        <Form.Label className="font-medium">Biome</Form.Label>
        <Form.Control
          className="hidden"
          type="text"
          value={selectedBiomes}
          required
          // onChange={onValueChange}
        />
        <MultiSelect
          value={selectedBiomes}
          // onChange={(e: MultiSelectChangeEvent) => setSelectedBiomes(e.value)}
          onChange={onBiomeSelectChange}
          options={Object.values(BiomeEnum).map((biome) => ({
            biome: biome,
          }))}
          optionLabel="biome"
          placeholder="Select native biomes"
          className="p-multiselect-token:tailwind-multiselect-chip w-full"
          display="chip"
        />
        {/* <Form.Message /> */}
        <Form.ValidityState>{validateNativeBiome}</Form.ValidityState>
      </Form.Field>

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-24">
        {/* Group Sexual Dynamic */}
        <FormFieldSelect
          formFieldName="groupSexualDynamic"
          label="Group Sexual Dynamic"
          required={true}
          placeholder="Select a dynamic..."
          valueLabelPair={[
            ["Monogamous", "Monogamous (1 male & 1 female exclusively mate)"],
            [
              "Promiscuous",
              "Promiscuous (both males and females mate with multiple partners)",
            ],
            ["Polygynous", "Polygynous (one male mate with multiple females)"],
            [
              "Polyandrous",
              "Polyandrous (one female mate with multiple males)",
            ],
          ]}
          value={groupSexualDynamic}
          setValue={setGroupSexualDynamic}
          validateFunction={validateGroupSexualDynamic}
        />

        {/* Group Sexual Dynamic */}
        <FormFieldSelect
          formFieldName="generalDietPreference"
          label="General Diet Preference"
          required={true}
          placeholder="Select a diet preference..."
          valueLabelPair={[
            ["Monogamous", "Monogamous (1 male & 1 female exclusively mate)"],
            [
              "Promiscuous",
              "Promiscuous (both males and females mate with multiple partners)",
            ],
            ["Polygynous", "Polygynous (one male mate with multiple females)"],
            [
              "Polyandrous",
              "Polyandrous (one female mate with multiple males)",
            ],
          ]}
          value={generalDietPreference}
          setValue={setGeneralDietPreference}
          validateFunction={validateGeneralDietPreference}
        />
      </div>

      {/* Habitat or Exhibit */}
      <FormFieldRadioGroup
        formFieldName="habitatOrExhibit"
        label="Habitat or Exhibit Species?"
        required={true}
        valueIdPair={[
          ["Exhibit", "exhibit"],
          ["Habitat", "habitat"],
        ]}
        value={habitatOrExhibit}
        setValue={setHabitatOrExhibit}
        validateFunction={validateHabitatOrExhibit}
      />

      <Form.Submit asChild>
        <button className="mt-10 h-12 w-2/3 self-center rounded-full border bg-primary text-lg text-whiten transition-all hover:bg-opacity-80">
          Create Species
        </button>
      </Form.Submit>
      {formError && (
        <div className="m-2 border-danger bg-red-100 p-2">{formError}</div>
      )}
    </Form.Root>
  );
}

export default EditSpeciesForm;
