import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import * as Form from "@radix-ui/react-form";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import { useNavigate } from "react-router-dom";
import useApiJson from "../../hooks/useApiJson";
import FormFieldInput from "../FormFieldInput";
import FormFieldSelect from "../FormFieldSelect";

// end field validations

function CreateNewEmployeeForm() {
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  const [fullName, setFullName] = useState<string>(""); // text input
  const [email, setEmail] = useState<string>(""); // text input
  const [phoneNumber, setPhoneNumber] = useState<string>(""); // text input
  const [birthday, setBirthday] = useState<string | Date | Date[] | null>(null);
  const [address, setAddress] = useState<string>(""); // text input
  const [formError, setFormError] = useState<string | null>(null);
  const [role, setRole] = useState<string | undefined>(undefined);
  const [roleType, setRoleType] = useState<string | undefined>(undefined);
  const [specializationType, setSpecializationType] = useState<
    string | undefined
  >(undefined);
  const [education, setEducation] = useState<string>("");
  const [accountManager, setAccountManager] = useState<string | undefined>(
    undefined
  );
  const [isAccountManager, setIsAccountManager] = useState<Boolean>();

  function clearForm() {
    setFullName("");
    setEmail("");
    setPhoneNumber("");
    setBirthday(null);
    setAddress("");
    setRole("");
    setRoleType("");
    setSpecializationType("");
    setEducation("");
    setAccountManager("");
    setIsAccountManager(undefined);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Remember, your form must have enctype="multipart/form-data" for upload pictures
    e.preventDefault();
    console.log("Name:");
    console.log(fullName);

    let roleJson;

    if (role === "keeper") {
      roleJson = {
        keeperType: roleType,
        isDisabled: false,
        specialization: specializationType,
      };
    } else if (role === "generalStaff") {
      roleJson = {
        generalStaffType: roleType,
        isDisabled: false,
      };
    } else if (role === "planningStaff") {
      roleJson = {
        plannerType: roleType,
        isDisabled: false,
        specialization: specializationType,
      };
    }

    const newEmployee = {
      employeeName: fullName,
      employeeAddress: address,
      employeeEmail: email,
      employeePhoneNumber: phoneNumber,
      employeeEducation: education,
      employeeBirthDate: birthday,
      isAccountManager: isAccountManager,
      role: role,
      roleJson: roleJson,
    };

    try {
      const responseJson = await apiJson.post(
        "http://localhost:3000/api/employee/createEmployee",
        newEmployee
      );
      // success
      toastShadcn({
        description: "Successfully created new employee!",
      });
    } catch (error: any) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while creating new employee: \n" +
          error.message,
      });
    }
    // handle success case or failurecase using apiJson
  }

  // Field validations
  function validateName(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter a valid name!
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateAddress(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter a valid address!
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateEmail(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter a valid email!
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validatePhoneNumber(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter a valid phone number!
          </div>
        );
      } else if (props.patternMismatch) {
        return (
          <div className="font-medium text-danger">
            * Please enter 8-digit phone number
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateRole(props: ValidityState) {
    if (props != undefined) {
      if (role == undefined) {
        return (
          <div className="font-medium text-danger">* Please select a role</div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateRoleType(props: ValidityState) {
    if (props != undefined) {
      if (roleType == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please select a role type!
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateSpecializationType(props: ValidityState) {
    if (props != undefined) {
      if (specializationType == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please select a specialization type!
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateEducation(props: ValidityState) {
    if (props != undefined) {
      if (education == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please type in employee's education!
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateIsAccountManager(props: ValidityState) {
    if (props != undefined) {
      if (accountManager == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please select the access!
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  return (
    <Form.Root
      className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      {/* Title Header and back button */}
      <div className="flex flex-col">
        <div className="mb-4 flex justify-between">
          <Button
            variant={"outline"}
            type="button"
            onClick={() => navigate(-1)}
            className=""
          >
            Back
          </Button>
          <span className="self-center text-title-xl font-bold">
            Create New Employee
          </span>
          <Button disabled className="invisible">
            Back
          </Button>
        </div>
        <Separator />
      </div>
      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
        {/* First Name */}
        <FormFieldInput
          type="text"
          formFieldName="fullName"
          label="Full Name"
          required={true}
          pattern={undefined}
          placeholder="e.g. ZooVanna"
          value={fullName}
          setValue={setFullName}
          validateFunction={validateName}
        />
      </div>

      {/* Address */}
      <FormFieldInput
        type="text"
        formFieldName="address"
        label="Address"
        required={true}
        placeholder="Address"
        pattern={undefined}
        value={address}
        setValue={setAddress}
        validateFunction={validateAddress}
      />
      {/* Email */}
      <FormFieldInput
        type="text"
        formFieldName="email"
        label="Email"
        required={true}
        placeholder="e.g. zoovanna@gmail.com"
        pattern={undefined}
        value={email}
        setValue={setEmail}
        validateFunction={validateEmail}
      />
      {/* Phone Number */}
      <FormFieldInput
        type="text"
        formFieldName="phoneNumber"
        label="Phone Number"
        required={true}
        placeholder="e.g. 9012XXXX"
        pattern="[0-9]{8}"
        value={phoneNumber}
        setValue={setPhoneNumber}
        validateFunction={validatePhoneNumber}
      />
      {/* Education */}
      <FormFieldInput
        type="text"
        formFieldName="education"
        label="Education"
        required={true}
        placeholder="e.g. Bachelor's Degree in .."
        pattern={undefined}
        value={education}
        setValue={setEducation}
        validateFunction={validateEducation}
      />
      {/* Birthday */}
      <div className="card justify-content-center block ">
        <div className="mb-1 block font-medium">Birthday</div>
        <Calendar
          value={birthday}
          onChange={(e: CalendarChangeEvent) => {
            if (e && e.value !== undefined) {
              setBirthday(e.value);
            }
          }}
          className="border-100 bg-white "
        />
      </div>
      <FormFieldSelect
        formFieldName="isAccountManager"
        label="Account Manager"
        required={true}
        placeholder=""
        valueLabelPair={[
          ["true", "Yes"],
          ["false", "No"],
        ]}
        value={accountManager}
        setValue={(e) => {
          if (e && e !== "undefined") {
            setAccountManager(e);
            if (e === "true") {
              setIsAccountManager(true);
            } else {
              setIsAccountManager(false);
            }
          }
        }}
        validateFunction={validateIsAccountManager}
      />
      <FormFieldSelect
        formFieldName="role"
        label="Role"
        required={true}
        placeholder="Select a role"
        valueLabelPair={[
          ["keeper", "Keeper"],
          ["generalStaff", "General Staff"],
          ["planningStaff", "Planning Staff"],
        ]}
        value={role}
        setValue={setRole}
        validateFunction={validateRole}
      />

      {role === "keeper" && (
        <FormFieldSelect
          formFieldName="keeperType"
          label="Keeper Type"
          required={true}
          placeholder="Select a keeper type"
          valueLabelPair={[
            ["KEEPER", "Keeper"],
            ["SENIOR_KEEPER", "Senior Keeper"],
          ]}
          value={roleType}
          setValue={setRoleType}
          validateFunction={validateRoleType}
        />
      )}

      {role === "keeper" && (
        <FormFieldSelect
          formFieldName="specializationType"
          label="Specialization Type"
          required={true}
          placeholder="Select a specialization"
          valueLabelPair={[
            ["MAMMAL", "Mammal"],
            ["BIRD", "Bird"],
            ["FISH", "Fish"],
            ["REPTILE", "Reptile"],
            ["AMPHIBIAN", "Amphibian"],
          ]}
          value={specializationType}
          setValue={setSpecializationType}
          validateFunction={validateSpecializationType}
        />
      )}

      {role === "generalStaff" && (
        <FormFieldSelect
          formFieldName="generalStaffType"
          label="General Staff Type"
          required={true}
          placeholder="Select a general staff type."
          valueLabelPair={[
            ["ZOO_OPERATIONS", "Operations"],
            ["ZOO_MAINTENANCE", "Maintenance"],
          ]}
          value={roleType}
          setValue={setRoleType}
          validateFunction={validateRoleType}
        />
      )}

      {role === "planningStaff" && (
        <FormFieldSelect
          formFieldName="planningStaffType"
          label="Planning Staff Type"
          required={true}
          placeholder="Select a planning staff type."
          valueLabelPair={[
            ["CURATOR", "Curator"],
            ["OPERATIONS_MANAGER", "Operations Manager"],
            ["CUSTOMER_OPERATIONS", "Customer Operations"],
            ["MARKETING", "Marketing"],
            ["SALES", "Sales"],
          ]}
          value={roleType}
          setValue={setRoleType}
          validateFunction={validateRoleType}
        />
      )}

      {role === "planningStaff" && (
        <FormFieldSelect
          formFieldName="specializationType"
          label="Specialization Type"
          required={true}
          placeholder="Select a specialization"
          valueLabelPair={[
            ["MAMMAL", "Mammal"],
            ["BIRD", "Bird"],
            ["FISH", "Fish"],
            ["REPTILE", "Reptile"],
            ["AMPHIBIAN", "Amphibian"],
          ]}
          value={specializationType}
          setValue={setSpecializationType}
          validateFunction={validateSpecializationType}
        />
      )}
      <Form.Submit asChild>
        <Button
          disabled={apiJson.loading}
          className="h-12 w-2/3 self-center rounded-full text-lg"
        >
          {!apiJson.loading ? <div>Submit</div> : <div>Loading</div>}
        </Button>
      </Form.Submit>
      {formError && (
        <div className="m-2 border-danger bg-red-100 p-2">{formError}</div>
      )}
    </Form.Root>
  );
}

export default CreateNewEmployeeForm;
