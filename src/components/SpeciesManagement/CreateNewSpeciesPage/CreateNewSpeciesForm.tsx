import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Checkbox from "@radix-ui/react-checkbox";

import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";

import useApi from "../../../hooks/useApi";
import FormFieldText from "../../FormFieldText";
import FormFieldSelect from "../../FormFieldSelect";
import { ContinentEnum } from "../../../enums/ContinentEnum";
import { HiCheck } from "react-icons/hi";
import { BiomeEnum } from "../../../enums/BiomeEnum";
import FormFieldRadioGroup from "../../FormFieldRadioGroup";

function CreateNewSpeciesForm() {
  const api = useApi();

  //   const [speciesCode, setSpeciesCode] = useState<string>("");
  const [commonName, setCommonName] = useState<string>("");
  const [scientificName, setScientificName] = useState<string>("");
  const [aliasName, setAliasName] = useState<string>("");
  const [conservationStatus, setConservationStatus] = useState<string>(""); // select from set list
  const [domain, setDomain] = useState<string>("");
  const [kingdom, setKingdom] = useState<string>("");
  const [phylum, setPhylum] = useState<string>("");
  const [speciesClass, setSpeciesClass] = useState<string>("");
  const [order, setOrder] = useState<string>("");
  const [family, setFamily] = useState<string>("");
  const [genus, setGenus] = useState<string>("");
  const [nativeContinent, setNativeContinent] = useState<string>("");
  const [selectedBiomes, setSelectedBiomes] = useState<string[]>([]);
  const [groupSexualDynamic, setGroupSexualDynamic] = useState<string>("");
  const [habitatOrExhibit, setHabitatOrExhibit] = useState<string>("");
  const [generalDietPreference, setGeneralDietPreference] =
    useState<string>("");

  const [formError, setFormError] = useState<string | null>(null);
  //   function validatePassword(props: ValidityState) {
  //     if (props != undefined) {
  //       if (props.valueMissing) {
  //         return (
  //           <div className="font-medium text-red-600">
  //             * Please enter a password
  //           </div>
  //         );
  //       }
  //     }
  //     return null;
  //   }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // remember to validate again, esp the select ones (domain, kingdom) that values aren't "")
    console.log("inside handleSUbmit");
    console.log("conservation status:" + conservationStatus);
    console.log("domain:" + domain);
    console.log("kingdom:" + kingdom);
    console.log("selected biomes:");
    console.log(selectedBiomes);
  }

  return (
    <Form.Root
      className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
      onSubmit={handleSubmit}
    >
      <span className="self-center text-title-xl font-bold">
        Create a New Species
      </span>
      <hr className="bg-stroke opacity-20" />
      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
        {/* Common Name */}
        <FormFieldText
          type="text"
          formFieldName="commonName"
          label="Common Name"
          required={true}
          placeholder="e.g., African Lion, Sumatran Tiger,..."
          value={commonName}
          setValue={setCommonName}
          validateFunction={() => null}
        />
        {/* Scientific Name */}
        <FormFieldText
          type="text"
          formFieldName="scientificName"
          label="Scientific Name (Binomial/Trinomial Name)"
          required={true}
          placeholder="e.g., Homo sapiens, Panthera leo leo..."
          value={scientificName}
          setValue={setScientificName}
          validateFunction={() => null}
        />
      </div>

      {/* Alias Name */}
      <FormFieldText
        type="text"
        formFieldName="aliasName"
        label="Alias Name"
        required={true}
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
          validateFunction={() => null}
        />
      </div>

      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
        {/* Domain */}
        <FormFieldSelect
          formFieldName="domain"
          label="Species Domain"
          placeholder="Select a domain..."
          valueLabelPair={[
            ["Archaea", "Archaea"],
            ["Bacteria", "Bacteria"],
            ["Eukarya", "Eukarya"],
          ]}
          setValue={setDomain}
        />

        {/* Kingdom */}
        <FormFieldSelect
          formFieldName="kingdom"
          label="Species Kingdom"
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
          setValue={setKingdom}
        />
      </div>

      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
        {/* Species Phylum */}
        <FormFieldText
          type="text"
          formFieldName="phylum"
          label="Phylum"
          required={true}
          placeholder="e.g., Chordata, Entoprocta,..."
          value={phylum}
          setValue={setPhylum}
          validateFunction={() => null}
        />
        {/* Species Class */}
        <FormFieldText
          type="text"
          formFieldName="speciesClass"
          label="Class"
          required={true}
          placeholder="e.g., Mammalia, Reptilia..."
          value={speciesClass}
          setValue={setSpeciesClass}
          validateFunction={() => null}
        />
      </div>

      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
        {/* Species Order */}
        <FormFieldText
          type="text"
          formFieldName="order"
          label="Order"
          required={true}
          placeholder="e.g., Rodentia, Carnivora..."
          value={order}
          setValue={setOrder}
          validateFunction={() => null}
        />
        {/* Species Family */}
        <FormFieldText
          type="text"
          formFieldName="family"
          label="Family"
          required={true}
          placeholder="e.g., Caviidae, Felidae..."
          value={family}
          setValue={setFamily}
          validateFunction={() => null}
        />
      </div>

      {/* Species Genus */}
      <FormFieldText
        type="text"
        formFieldName="genus"
        label="Genus"
        required={true}
        placeholder="e.g., Homo, Panthera..."
        value={genus}
        setValue={setGenus}
        validateFunction={() => null}
      />

      {/* Native Continent */}
      <FormFieldSelect
        formFieldName="nativeContinent"
        label="Native Continent"
        placeholder="Select a continent..."
        valueLabelPair={Object.values(ContinentEnum).map((continent) => [
          continent,
          continent,
        ])}
        setValue={setNativeContinent}
      />

      {/* Biomes */}
      <Form.Field name="biomes" className="flex flex-col gap-1 lg:w-full">
        <Form.Label className="font-medium">Biome</Form.Label>
        <MultiSelect
          value={selectedBiomes}
          onChange={(e: MultiSelectChangeEvent) => setSelectedBiomes(e.value)}
          options={Object.values(BiomeEnum).map((biome) => ({
            biome: biome,
          }))}
          optionLabel="biome"
          placeholder="Select native biomes"
          className="p-multiselect-token:tailwind-multiselect-chip w-full"
          display="chip"
        />
      </Form.Field>

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-24">
        {/* Group Sexual Dynamic */}
        <FormFieldSelect
          formFieldName="groupSexualDynamic"
          label="Group Sexual Dynamic"
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
          setValue={setGroupSexualDynamic}
        />

        {/* Group Sexual Dynamic */}
        <FormFieldSelect
          formFieldName="generalDietPreference"
          label="General Diet Preference"
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
          setValue={setGeneralDietPreference}
        />
      </div>

      {/* Habitat or Exhibit */}
      <FormFieldRadioGroup
        formFieldName="habitatOrExhibit"
        label="Habitat or Exhibit Species?"
        valueIdPair={[
          ["Exhibit", "exhibit"],
          ["Habitat", "habitat"],
        ]}
        value={habitatOrExhibit}
        setValue={setHabitatOrExhibit}
        validateFunction={() => null}
      />

      <Form.Submit asChild>
        <button className="mt-10 h-12 w-2/3 self-center rounded-full border bg-primary text-lg text-whiten transition-all hover:bg-opacity-80">
          Create Species
        </button>
      </Form.Submit>
      {/* {error && (
        <div className="m-2 border-red-400 bg-red-100 p-2">{error}</div>
      )} */}
    </Form.Root>
  );
}

export default CreateNewSpeciesForm;
