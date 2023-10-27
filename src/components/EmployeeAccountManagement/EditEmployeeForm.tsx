import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";

import { MultiSelectChangeEvent } from "primereact/multiselect";

import useApiFormData from "../../hooks/useApiFormData";
import FormFieldInput from "../FormFieldInput";
import FormFieldRadioGroup from "../FormFieldRadioGroup";
import Employee from "src/models/Employee";
import FormFieldSelect from "../FormFieldSelect";
import { Button } from "@/components/ui/button";

interface EditEmployeeFormProps {
  curEmployee: Employee;
}

function EditEmployeeForm(props: EditEmployeeFormProps) {
  const apiFormData = useApiFormData();

  const { curEmployee } = props;

  const [employeeName, setEmployeeName] = useState<string>(
    curEmployee.employeeName
  ); // text input
  const [employeeEmail, setEmployeeEmail] = useState<string>(
    curEmployee.employeeEmail
  ); // text input
  const [employeeAddress, setEmployeeAddress] = useState<string>(
    curEmployee.employeeAddress
  ); // text input
  const [employeePhoneNumber, setEmployeePhoneNumber] = useState<string>(
    curEmployee.employeePhoneNumber
  ); // text input
  const [employeeEducation, setEmployeeEducation] = useState<string>(
    curEmployee.employeeEducation
  ); // text inputt
  const [isAccountManager, setIsAccountManager] = useState<Boolean>(
    curEmployee.isAccountManager
  );
  // const [employeePasswordHash, setEmployeePasswordHash] = useState<string>(""); // text input
  // const [employeeSalt, setEmployeeSalt] = useState<string>(""); // text input
  const [employeeDoorAccessCode, setEmployeeDoorAccessCode] = useState<string>(
    curEmployee.employeeDoorAccessCode
  ); // text input
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

  function validateName(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter a valid value
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function clearForm() {
    setEmployeeName("");
    setEmployeeEmail("");
    setEmployeeAddress("");
    setEmployeePhoneNumber("");
    setEmployeeEducation("");
    setEmployeeDoorAccessCode("");
    setIsAccountManager(false);
    setImageFile(null);
  }

  function validateIsAccountManager(props: ValidityState) {
    // console.log(props);
    if (props != undefined) {
      if (isAccountManager == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please select admin privileges
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  // end field valisations

  function onAccountManagerSelectChange(e: MultiSelectChangeEvent) {
    setIsAccountManager(e.value);

    const element = document.getElementById(
      "selectMultiHasAdminPrivilegesField"
    );
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
    formData.append("employeeName", employeeName);
    formData.append("employeeEmail", employeeEmail);
    formData.append("employeeAddress", employeeAddress);
    formData.append("employeePhoneNumber", employeePhoneNumber);
    formData.append("employeeEducation", employeeEducation);
    formData.append("isAccountManager", isAccountManager ? toString() : "");
    formData.append("employeeDoorAccessCode", employeeDoorAccessCode);
    formData.append("file", imageFile || "");
    await apiFormData.put(
      "http://localhost:3000/api/employee/updateemployee",
      formData
    );
    console.log(apiFormData.result);
  }

  return (
    <div>
      {curEmployee && (
        <Form.Root
          className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <span className="self-center text-title-xl font-bold">
            Edit Employee: {curEmployee.employeeName}
          </span>
          <hr className="bg-stroke opacity-20" />
          {/* Employee Picture */}
          <Form.Field
            name="employeeImage"
            className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
          >
            <span className="font-medium">Current Image</span>
            {/* <img src={curEmployee.employeeImageUrl} alt="Current employee image" /> */}
            <Form.Label className="font-medium">
              Change Profile Picture
            </Form.Label>
            <Form.Control
              type="file"
              placeholder="Change image"
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
              pattern={undefined}
              value={employeeName}
              setValue={setEmployeeName}
              validateFunction={validateName}
            />
            {/* Employee Email */}
            <FormFieldInput
              type="text"
              formFieldName="employeeEmail"
              label="Employee Email"
              required={true}
              placeholder="EmployeeEmail"
              pattern={undefined}
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
              pattern={undefined}
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
              pattern={undefined}
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
              pattern={undefined}
              value={employeeEducation}
              setValue={setEmployeeEducation}
              validateFunction={validateName}
            />
            <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12"></div>
            <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12"></div>

            <Form.Submit asChild>
              <Button
                disabled={apiFormData.loading}
                className="h-12 w-2/3 self-center rounded-full text-lg"
              >
                {!apiFormData.loading ? <div>Submit</div> : <div>Loading</div>}
              </Button>
            </Form.Submit>
            {formError && (
              <div className="m-2 border-danger bg-red-100 p-2">
                {formError}
              </div>
            )}
          </div>
        </Form.Root>
      )}
    </div>
  );
}

export default EditEmployeeForm;
