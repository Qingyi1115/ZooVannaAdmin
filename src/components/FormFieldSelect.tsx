import React from "react";
import * as Form from "@radix-ui/react-form";
import * as Select from "@radix-ui/react-select";

import { HiChevronDown, HiChevronUp, HiCheck } from "react-icons/hi";

interface PropsType {
  formFieldName: string;
  placeholder: string;
  label: string;
  valueLabelPair: [string, string][];
  setValue: (value: React.SetStateAction<string>) => void;
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
        className="relative flex select-none items-center rounded-lg py-1.5 pl-6 pr-4 text-sm leading-none text-zoovanna-brown data-[disabled]:pointer-events-none data-[highlighted]:bg-zoovanna-beige data-[disabled]:text-zoovanna-beige data-[highlighted]:text-zoovanna-cream data-[highlighted]:outline-none"
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="absolute left-0 inline-flex w-6 items-center justify-center">
          <HiCheck />
        </Select.ItemIndicator>
      </Select.Item>
    );
  }
);

function FormFieldSelect(props: PropsType) {
  const {
    formFieldName,
    label,
    // required,
    placeholder,
    // value,
    valueLabelPair,
    setValue,
  } = props;
  return (
    <Form.Field name={formFieldName} className="flex flex-col gap-1 lg:w-1/3">
      <Form.Label className="font-medium">{label}</Form.Label>
      {/* for Edit forms, need to include value={domain} */}
      <Select.Root onValueChange={setValue}>
        <Select.Trigger
          className="inline-flex h-10 items-center justify-center gap-[5px] rounded border border-zoovanna-beige/50 bg-zoovanna-cream-light px-2 text-sm leading-none shadow-[0_2px_10px] shadow-black/10 outline-none hover:bg-zoovanna-cream focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-zoovanna-brown/50"
          aria-label="Species Domain"
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon className="text-zoovanna-brown">
            <HiChevronDown />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="overflow-hidden rounded-md bg-zoovanna-cream-light shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
            <Select.ScrollUpButton className="flex h-[25px] cursor-default items-center justify-center bg-white">
              <HiChevronUp />
            </Select.ScrollUpButton>
            <Select.Viewport className="p-2">
              <Select.Group>
                {valueLabelPair.map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </Select.Group>
            </Select.Viewport>
            <Select.ScrollDownButton className="flex h-[25px] cursor-default items-center justify-center bg-white text-zoovanna-beige">
              <HiChevronDown />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </Form.Field>
  );
}

export default FormFieldSelect;
