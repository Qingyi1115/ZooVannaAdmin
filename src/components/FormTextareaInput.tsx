import React from "react";
import * as Form from "@radix-ui/react-form";

interface PropsType {
  formFieldName: string;
  label: string;
  required: boolean;
  placeholder: string;
  value: string | undefined;
  setValue: (value: string) => void;
  validateFunction: (props: ValidityState) => JSX.Element | null;
}

function FormTextareaInput(props: PropsType) {
  const {
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
      className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
    >
      <Form.Label className="font-medium">{label}</Form.Label>
      <textarea
        id={formFieldName}
        name={formFieldName}
        required={required}
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium shadow outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
      />
      <Form.ValidityState>{validateFunction}</Form.ValidityState>
    </Form.Field>
  );
}

export default FormTextareaInput;
