import React, { useState, useEffect } from "react";
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

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

function CreateNewSpeciesForm() {
  const apiFormData = useApiFormData();
  const toastShadcn = useToast().toast;

  //   const [speciesCode, setSpeciesCode] = useState<string>("");
  const [commonName, setCommonName] = useState<string>("");
  const [scientificName, setScientificName] = useState<string>("");
  const [aliasName, setAliasName] = useState<string>("");
  const [conservationStatus, setConservationStatus] = useState<
    string | undefined
  >(undefined); // select from set list
  const [domain, setDomain] = useState<string | undefined>(undefined);
  const [kingdom, setKingdom] = useState<string | undefined>(undefined);
  const [phylum, setPhylum] = useState<string>("");
  const [speciesClass, setSpeciesClass] = useState<string>("");
  const [order, setOrder] = useState<string>("");
  const [family, setFamily] = useState<string>("");
  const [genus, setGenus] = useState<string>("");
  const [nativeContinent, setNativeContinent] = useState<string | undefined>(
    undefined
  );
  const [selectedBiomes, setSelectedBiomes] = useState<string | undefined>(
    undefined
  );
  const [groupSexualDynamic, setGroupSexualDynamic] = useState<
    string | undefined
  >(undefined);
  const [habitatOrExhibit, setHabitatOrExhibit] = useState<string | undefined>(
    undefined
  );
  const [generalDietPreference, setGeneralDietPreference] = useState<
    string | undefined
  >(undefined);
  // const [educationalDescription, setEducationalDescription] =
  //   useState<string>("");
  const [lifeExpectancyYears, setLifeExpectancyYears] = useState<number>(0);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formError, setFormError] = useState<string | null>(null);

  const [newSpeciesCreated, setNewSpeciesCreated] = useState<boolean>(false);

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

  function validateLifeExpectancyYears(props: ValidityState) {
    // if (props != undefined) {
    if (lifeExpectancyYears <= 0) {
      return (
        <div className="font-medium text-danger">
          * Life expectancy must be greater than 0
        </div>
      );
    }
    // add any other cases here
    // }
    return null;
  }

  function validateEducationalDescription(props: ValidityState) {
    // console.log(props);
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please write a short educational description
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

  // function clearForm() {
  //   setCommonName("");
  //   setScientificName("");
  //   setAliasName("");
  //   setConservationStatus("");
  //   setConservationStatus(undefined);
  //   setDomain("");
  //   setDomain(undefined);
  //   setKingdom("");
  //   setKingdom(undefined);
  //   setPhylum("");
  //   setSpeciesClass("");
  //   setOrder("");
  //   setFamily("");
  //   setGenus("");
  //   setNativeContinent("");
  //   setNativeContinent(undefined);
  //   setSelectedBiomes(undefined);
  //   setGroupSexualDynamic("");
  //   setGroupSexualDynamic(undefined);
  //   setHabitatOrExhibit("");
  //   setHabitatOrExhibit(undefined);
  //   setGeneralDietPreference("");
  //   setGeneralDietPreference(undefined);
  //   setEducationalDescription("");
  //   setLifeExpectancyYears(0);
  //   // Clear image
  //   var speciesImageInput = document.getElementById(
  //     "speciesImage"
  //   ) as HTMLInputElement;
  //   if (speciesImageInput) {
  //     speciesImageInput.value = "";
  //   }
  //   setImageFile(null);
  // }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Remember, your form must have enctype="multipart/form-data" for upload pictures
    e.preventDefault();
    // remember to validate again, esp the select ones (domain, kingdom) that values aren't "")
    // console.log("inside handleSUbmit");
    // console.log("conservation status:" + conservationStatus);
    // console.log("domain:" + domain);
    // console.log("kingdom:" + kingdom);
    console.log("selected biomes:");
    console.log(selectedBiomes);

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
    formData.append("nativeBiomes", selectedBiomes?.toString() || "");
    formData.append("groupSexualDynamic", groupSexualDynamic || "");
    formData.append("habitatOrExhibit", habitatOrExhibit || "");
    formData.append("generalDietPreference", generalDietPreference || "");
    formData.append("file", imageFile || "");
    formData.append(
      "lifeExpectancyYears",
      lifeExpectancyYears?.toString() || ""
    );

    const createSpecies = async () => {
      try {
        const response = await apiFormData.post(
          "http://localhost:3000/api/species/createnewspecies",
          formData
        );
        // success
        console.log("succes?");
        toastShadcn({
          description: "Successfully created a new species:",
        });

        // clearForm();
        setNewSpeciesCreated(true);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while creating a new species: \n" +
            error.message,
        });
      }
    };
    createSpecies();
  }

  return (
    <div>
      <Form.Root
        className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <span className="self-center text-title-xl font-bold">
          Create a New Species
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
          {/* Common Name */}
          <FormFieldInput
            type="text"
            formFieldName="commonName"
            label="Common Name"
            required={true}
            placeholder="e.g., African Lion, Sumatran Tiger,..."
            pattern={undefined}
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
            pattern={undefined}
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
          pattern={undefined}
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
            valueIdLabelTriplet={[
              ["DATA_DEFICIENT", "r1", "Data Deficient"],
              ["DOMESTICATED", "r2", "Domesticated"],
              ["LEAST_CONCERN", "r3", "Least Concern"],
              ["NEAR_THREATENED", "r4", "Near Threatened"],
              ["VULNERABLE", "r5", "Vulnerable"],
              ["ENDANGERED", "r6", "Endangered"],
              ["CRITICALLY_ENDANGERED", "r7", "Critically Endangered"],
              ["EXTINCT_IN_WILD", "r8", "Extinct In Wild"],
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
            pattern={undefined}
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
            pattern={undefined}
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
            pattern={undefined}
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
            pattern={undefined}
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
          pattern={undefined}
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
          // valueLabelPair={Object.values(ContinentEnum).map((continent) => [
          //   continent,
          //   continent,
          // ])}
          valueLabelPair={[
            ["AFRICA", "Africa"],
            ["ASIA", "Asia"],
            ["EUROPE", "Europe"],
            ["NORTH_AMERICA", "North America"],
            ["OCEANIA", "Oceania"],
            ["SOUTH_OR_CENTRAL_AMERICA", "South or Central America"],
          ]}
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
            // options={Object.values(BiomeEnum).map((biome) => biome.toString())}
            options={[
              "Aquatic",
              "Desert",
              "Grassland",
              "Taiga",
              "Temperate",
              "Tropical",
              "Tundra",
            ].map((biome) => biome)}
            // optionLabel="biome"
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
              ["MONOGAMOUS", "Monogamous (1 male & 1 female exclusively mate)"],
              [
                "PROMISCUOUS",
                "Promiscuous (both males and females mate with multiple partners)",
              ],
              [
                "POLYGYNOUS",
                "Polygynous (one male mate with multiple females)",
              ],
              [
                "POLYANDROUS",
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
              ["Carnivore", "Carnivore"],
              ["Herbivore", "Herbivore"],
              ["Omnivore", "Omnivore"],
              ["Frugivore", "Frugivore"],
              ["Folivore", "Folivore"],
              ["Insectivore", "Insectivore"],
              ["Piscivore", "Piscivore"],
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
          valueIdLabelTriplet={[
            ["Exhibit", "exhibit", "Exhibit"],
            ["Habitat", "habitat", "Habitat"],
          ]}
          value={habitatOrExhibit}
          setValue={setHabitatOrExhibit}
          validateFunction={validateHabitatOrExhibit}
        />
        {/* Species Life Expectancy in Years */}
        <FormFieldInput
          type="number"
          formFieldName="lifeExpectancyYears"
          label="Life Expectancy (in Years)"
          required={true}
          placeholder="e.g., 8"
          pattern={undefined}
          value={lifeExpectancyYears}
          setValue={setLifeExpectancyYears}
          validateFunction={validateLifeExpectancyYears}
        />

        <Form.Submit asChild>
          {!newSpeciesCreated ? (
            <Button
              disabled={apiFormData.loading}
              className="h-12 w-2/3 self-center rounded-full text-lg"
            >
              {!apiFormData.loading ? (
                <div>Create Species</div>
              ) : (
                <div>Loading</div>
              )}
            </Button>
          ) : (
            <Button
              disabled
              className="h-12 w-2/3 self-center rounded-full text-lg"
            >
              Reload the page to create another species
            </Button>
          )}
        </Form.Submit>
        {formError && (
          <div className="m-2 border-danger bg-red-100 p-2">{formError}</div>
        )}
        {newSpeciesCreated && (
          <Button
            type="button"
            variant={"outline"}
            onClick={() => {
              window.location.reload();
            }}
            className="w-1/4 self-center rounded-full text-lg"
          >
            Reload Page
          </Button>
        )}
      </Form.Root>
    </div>
  );
}

export default CreateNewSpeciesForm;
