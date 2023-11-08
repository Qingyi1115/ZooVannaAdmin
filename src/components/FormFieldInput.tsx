
import * as Form from "@radix-ui/react-form";

interface PropsType {
  type: "email" | "password" | "text" | "number";
  formFieldName: string;
  required: boolean;
  placeholder: string;
  label: string;
  value: string | number | undefined;
  pattern: string | undefined;
  setValue: (value: any) => void; // React.SetStateAction<string> or React.SetStateAction<number>, I'm too tired man
  validateFunction: (props: ValidityState) => JSX.Element | null;
}

function FormFieldInput<T>(props: PropsType) {
  const {
    type,
    formFieldName,
    label,
    required,
    placeholder,
    value,
    pattern,
    setValue,
    validateFunction,
  } = props;

  return (
    <Form.Field
      name={formFieldName}
      className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
    >
      <Form.Label className="font-medium">{label}</Form.Label>
      <Form.Control
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        step={0.5}
        pattern={pattern}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium shadow outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
      />
      <Form.ValidityState>{validateFunction}</Form.ValidityState>
    </Form.Field>
  );
}

export default FormFieldInput;
