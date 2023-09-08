import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";
import * as Select from "@radix-ui/react-select";

import useApi from "../../../hooks/useApi";

function CreateNewSpeciesForm() {
  const api = useApi();
  /*
    -speciesId: Long
-speciesCode: String // how to generate code??? Has to be unique also, but not the system ID
-commonName: String
-scientificName: String
-aliasName: String
-conservationStatus: ENUM
-domain: String
-kingdom: String	
-phylum: String
-class: String
-order: String
-family: String
-genus:	String
-nativeContinent: String
-nativeBiome: List<BiomeEnum>
-educationalDescription: String
-groupSexualDynamic: GroupSexualDynamicEnum
-isBigHabitatSpecies: Boolean

*/
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

  function handleSubmit() {}

  return (
    <Form.Root
      className="bg-zoovanna-cream-light p-4 text-zoovanna-brown"
      onSubmit={handleSubmit}
    >
      <Form.Field name="email" className="mb-10 flex flex-col gap-1">
        <Form.Label className="font-medium">Common Name</Form.Label>
        <Form.Control
          type="text"
          required
          placeholder="E.g., Lion, Zebra,..."
          value={commonName}
          onChange={(e) => setCommonName(e.target.value)}
          //   className="h-14 w-full rounded-md border border-zoovanna-brown/50 bg-[#FFF9F2] px-4 text-zoovanna-brown placeholder-zoovanna-brown/70"
          className="rounded-md border border-zoovanna-beige/50 bg-zoovanna-cream-light p-1 text-sm placeholder:italic"
        />
        {/* <Form.ValidityState>{validateEmail}</Form.ValidityState> */}
      </Form.Field>

      <Select.Root>
        <Select.Trigger
          className="text-violet11 hover:bg-mauve3 data-[placeholder]:text-violet9 inline-flex h-[35px] items-center justify-center gap-[5px] rounded bg-white px-[15px] text-[13px] leading-none shadow-[0_2px_10px] shadow-black/10 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
          aria-label="Species Domain"
        >
          <Select.Value placeholder="Select a domain…" />
          <Select.Icon className="text-violet11">
            {/* <ChevronDownIcon /> */}
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="overflow-hidden rounded-md bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
            <Select.ScrollUpButton className="text-violet11 flex h-[25px] cursor-default items-center justify-center bg-white">
              {/* <ChevronUpIcon /> */}
            </Select.ScrollUpButton>
            <Select.Viewport className="p-[5px]">
              <Select.Group>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </Select.Group>
            </Select.Viewport>
            <Select.ScrollDownButton className="text-violet11 flex h-[25px] cursor-default items-center justify-center bg-white">
              {/* <ChevronDownIcon /> */}
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      <Form.Submit asChild>
        <button className="h-12 w-full rounded-full border bg-zoovanna-brown text-zoovanna-cream">
          Create Species
        </button>
      </Form.Submit>
      {/* {error && (
        <div className="m-2 border-red-400 bg-red-100 p-2">{error}</div>
      )} */}
    </Form.Root>
  );
}

interface SelectItemProps {
  children: React.ReactNode;
  className?: string;
  forwardedRef: React.Ref<HTMLDivElement>; // Assuming it's a div, adjust the type if needed
}

const SelectItem = React.forwardRef(
  ({ children, className, ...props }: any, forwardedRef) => {
    return (
      <Select.Item
        className="text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px] leading-none data-[disabled]:pointer-events-none data-[highlighted]:outline-none"
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
          {/* <CheckIcon /> */}
        </Select.ItemIndicator>
      </Select.Item>
    );
  }
);

export default CreateNewSpeciesForm;
