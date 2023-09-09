import React from "react";

import * as Form from "@radix-ui/react-form";

interface PropsType {
  type: "email" | "password" | "text" | "number";
  formFieldName: string;
  required: boolean;
  placeholder: string;
  label: string;
  value: string;
  setValue: (value: React.SetStateAction<string>) => void;
  validateFunction: (props: ValidityState) => JSX.Element | null;
}

function FormFieldText(props: PropsType) {
  const {
    type,
    formFieldName,
    label,
    required,
    placeholder,
    value,
    setValue,
    validateFunction,
  } = props;

  return (
    <Form.Field
      name={formFieldName}
      className="flex flex-col gap-1 data-[invalid]:text-zoovanna-red lg:w-1/3"
    >
      <Form.Label className="font-medium">{label}</Form.Label>
      <Form.Control
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-10 rounded-md border border-zoovanna-beige/50 bg-zoovanna-cream-100 p-1 text-sm shadow-[0_2px_10px] shadow-black/10 placeholder:italic placeholder:text-zoovanna-brown/50 hover:bg-zoovanna-cream-200"
      />
      <Form.ValidityState>{validateFunction}</Form.ValidityState>
    </Form.Field>
  );
}

export default FormFieldText;
