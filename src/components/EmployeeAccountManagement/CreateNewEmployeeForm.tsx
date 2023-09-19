import React, { useState } from "react";

import * as Form from "@radix-ui/react-form";
import FormFieldRadioGroup from "../FormFieldRadioGroup";
import FormFieldInput from "../FormFieldInput";
import FormFieldSelect from "../FormFieldSelect";
import useApiJson from "../../hooks/useApiJson";
import useApiFormData from "../../hooks/useApiFormData";

// Field validations
function validateName(props: ValidityState) {
  if (props != undefined) {
    if (props.valueMissing) {
      return (
        <div className="font-medium text-danger">* Please enter a valid value</div>
      );
    }
    // add any other cases here
  }
  return null;
}

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

// end field validations

function CreateNewEmployeeForm() {
  const apiFormData = useApiFormData();

  const [employeeName, setEmployeeName] = useState<string>(""); // text input
  const [employeeEmail, setEmployeeEmail] = useState<string>(""); // text input
  const [employeeAddress, setEmployeeAddress] = useState<string>(""); // text input
  const [employeePhoneNumber, setEmployeePhoneNumber] = useState<string>(""); // text input
  const [employeeEducation, setEmployeeEducation] = useState<string>(""); // text input
  const [hasAdminPrivileges, setHasAdminPrivileges] = useState<boolean>(); // text input
  // const [employeePasswordHash, setEmployeePasswordHash] = useState<string>(""); // text input
  // const [employeeSalt, setEmployeeSalt] = useState<string>(""); // text input
  const [employeeDoorAccessCode, setEmployeeDoorAccessCode] = useState<string>(""); // text input
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  function clearForm() {
    setEmployeeName("");
    setEmployeeEmail("");
    setEmployeeAddress("");
    setEmployeePhoneNumber("");
    setEmployeeEducation("");
    setEmployeeDoorAccessCode("");
    setHasAdminPrivileges(undefined);
    setImageFile(null);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files && event.target.files[0];
    setImageFile(file);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Remember, your form must have enctype="multipart/form-data" for upload pictures
    e.preventDefault();
    console.log("Name:");
    console.log(employeeName);
    console.log("Email:");
    console.log(employeeEmail);

    const formData = new FormData();
    formData.append("employeeName", employeeName);
    formData.append("employeeEmail", employeeEmail);
    formData.append("employeeAddress", employeeAddress);
    formData.append("employeePhoneNumber", employeePhoneNumber);
    formData.append("employeeEducation", employeeEducation);
    formData.append("hasAdminPrivileges", hasAdminPrivileges ? toString() : "");
    formData.append("employeeDoorAccessCode", employeeDoorAccessCode);

    formData.append("file", imageFile || "");
    await apiFormData.post(
      "http://localhost:3000/api/species/createnewemployee",
      formData
    );
    console.log(apiFormData.result);

    // handle success case or failurecase using apiJson
  }

  return (
    <Form.Root
      className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <span className="self-center text-title-xl font-bold">
        Create New Employee
      </span>
      <hr className="bg-stroke opacity-20" />
      {/* Employee Picture */}
      <Form.Field
        name="employeeImage"
        className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
      >
        <Form.Label className="font-medium">Profile Picture</Form.Label>
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
        {/* Employee Name */}
        <FormFieldInput
          type="text"
          formFieldName="employeeName"
          label="Employee Name"
          required={true}
          placeholder="Full Name"
          value={employeeName}
          setValue={setEmployeeName}
          validateFunction={validateName}
        />
      </div>
      {/* Employee Email */}
      <FormFieldInput
        type="text"
        formFieldName="employeeEmail"
        label="Employee Email"
        required={true}
        placeholder="EmployeeEmail"
        value={employeeEmail}
        setValue={setEmployeeEmail}
        validateFunction={validateName}
      />
      {/* Employee Address */}
      <FormFieldInput
        type="text"
        formFieldName="employeeAddress"
        label="Employee Address"
        required={true}
        placeholder="EmployeeAddress"
        value={employeeAddress}
        setValue={setEmployeeAddress}
        validateFunction={validateName}
      />
      {/* Phone Number */}
      <FormFieldInput
        type="text"
        formFieldName="employeePhoneNumber"
        label="Phone Number"
        required={true}
        placeholder="Phone Number"
        value={employeePhoneNumber}
        setValue={setEmployeePhoneNumber}
        validateFunction={validateName}
      />
      
      {/* Education */}
      <FormFieldInput
        type="text"
        formFieldName="Employee Education"
        label="Employee Education"
        required={true}
        placeholder="Employee Education"
        value={employeeEducation}
        setValue={setEmployeeEducation}
        validateFunction={validateName}
      />

      
      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">

      </div>


      <Form.Submit asChild>
        <button className="mt-10 h-12 w-2/3 self-center rounded-full border bg-primary text-lg text-whiten transition-all hover:bg-opacity-80">
          Create Employee
        </button>
      </Form.Submit>
      {formError && (
        <div className="m-2 border-danger bg-red-100 p-2">{formError}</div>
      )}
    </Form.Root>
  );
}

export default CreateNewEmployeeForm;
