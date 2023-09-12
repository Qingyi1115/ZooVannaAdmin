import React from "react";
import * as Form from "@radix-ui/react-form";
import * as RadioGroup from "@radix-ui/react-radio-group";

interface PropsType {
  formFieldName: string;
  label: string;
  required: boolean;
  valueIdPair: [string, string][];
  value: string | undefined;
  setValue: (value: React.SetStateAction<string | undefined>) => void;
  validateFunction: (props: ValidityState) => JSX.Element | null;
}

function FormFieldRadioGroup(props: PropsType) {
  const {
    formFieldName,
    label,
    required,
    valueIdPair,
    value,
    setValue,
    validateFunction,
  } = props;

  function onValueChange(selectedValue: string) {
    setValue(selectedValue);

    const element = document.getElementById(label + "id");
    if (element) {
      const isDataInvalid = element.getAttribute("data-invalid");
      if (isDataInvalid == "true") {
        element.setAttribute("data-valid", "true");
        element.removeAttribute("data-invalid");
      }
    }
  }

  return (
    <Form.Field
      id={label + "id"}
      name={formFieldName}
      className="flex cursor-pointer flex-col gap-1 data-[invalid]:text-danger lg:w-full"
    >
      <Form.Label className="font-medium">{label}</Form.Label>
      <Form.Control
        className="hidden"
        type="text"
        value={value}
        required
        // onChange={onValueChange}
      />
      <RadioGroup.Root
        className="flex flex-col gap-3 text-black"
        value={value}
        required={required}
        onValueChange={onValueChange}
        aria-label={label}
      >
        {valueIdPair.map(([value, id]) => (
          <div key={id} className="flex items-center">
            <RadioGroup.Item
              className="h-5 w-5 rounded-full bg-whiter shadow-[0_0_2px] shadow-black outline-none after:shadow-primary hover:bg-stroke focus:shadow-[0_0_0_2px] focus:shadow-primary"
              value={value}
              id={id}
            >
              <RadioGroup.Indicator className="relative flex h-full w-full items-center justify-center after:block after:h-3 after:w-3 after:rounded-[50%] after:bg-primary after:content-['']" />
            </RadioGroup.Item>
            <label className="pl-6 text-base leading-none" htmlFor={id}>
              {value}
            </label>
          </div>
        ))}
      </RadioGroup.Root>
      <Form.ValidityState>{validateFunction}</Form.ValidityState>
    </Form.Field>
  );
}

export default FormFieldRadioGroup;
