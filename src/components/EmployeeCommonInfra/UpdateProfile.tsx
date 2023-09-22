import { Toast } from "primereact/toast";
import * as Form from "@radix-ui/react-form";
import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import useApiJson from "../../hooks/useApiJson";
import Employee from "src/models/Employee";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import { NavLink } from "react-router-dom";
import { HiCheck, HiPencil, HiTrash, HiX } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import FormFieldInput from "../FormFieldInput";
import FormFieldSelect from "../FormFieldSelect";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
{
  /*const toast = useRef<Toast>(null);*/
}

function UpdateProfile() {
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  let emptyEmployee: Employee = {
    employeeId: -1,
    employeeName: "",
    employeeEmail: "",
    employeeAddress: "",
    employeePhoneNumber: "",
    employeeDoorAccessCode: "",
    employeeEducation: "",
    employeeBirthDate: null,
    isAccountManager: false,
    dateOfResignation: null,
    employeeProfileUrl: "",
  };

  const { state, dispatch } = useAuthContext();
  const { user } = state;

  const [email, setEmail] = useState<string>(emptyEmployee.employeeEmail);
  const [address, setAddress] = useState<string>(emptyEmployee.employeeAddress);
  const [pn, setPn] = useState<string>(emptyEmployee.employeePhoneNumber);
  const [edu, setEdu] = useState<string>(emptyEmployee.employeeEducation);
  const [formError, setFormError] = useState<string | null>(null);

  const [curEmployee, setCurEmployee] = useState<Employee>(emptyEmployee);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const responseJson = await apiJson.get(
          "http://localhost:3000/api/employee/getEmployee"
        );
        const emp = responseJson["employee"];
        console.log("emp", emp);
        setEmail(emp.employeeEmail);
        setAddress(emp.employeeAddress);
        setPn(emp.employeePhoneNumber);
        setEdu(emp.employeeEducation);
        setCurEmployee(emp);
      } catch (error: any) {
        setFormError(error.message);
        console.log(error);
      }
    };
    fetchEmployees();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await apiJson.put(
        "http://localhost:3000/api/employee/updateEmployeeAccount",
        {
          employeeAddress: address,
          employeeEmail: email,
          employeePhoneNumber: pn,
          employeeEducation: edu,
        }
      );

      if (response["newToken"] !== undefined) {
        const json = {
          email: response["employee"].employeeEmail,
          token: response["newToken"],
        };
        dispatch({ type: "LOGIN", payload: json });
      }
      toastShadcn({
        description: "Successfully updated profile details.",
      });
      navigate("/profile");
      // clearForm();
    } catch (error: any) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while updating profile details: \n" +
          error.message,
      });
    }
  }

  return (
    <Form.Root
      className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <div className="flex flex-col">
        <div className="mb-4 flex justify-between">
          <NavLink className="flex" to={`/profile`}>
            <Button variant={"outline"} type="button" className="">
              Back
            </Button>
          </NavLink>
          <span className="self-center text-lg text-graydark"> </span>
          <Button disabled className="invisible">
            Back
          </Button>
        </div>
        <Separator />
        <span className="mt-4 flex flex-col items-center self-center text-title-xl font-bold">
          Edit Profile
        </span>
      </div>
      <FormFieldInput
        type="text"
        formFieldName="email"
        label="Email"
        required={true}
        pattern={undefined}
        placeholder={curEmployee.employeeEmail}
        value={email}
        setValue={setEmail}
        validateFunction={() => null}
      />

      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
        <FormFieldInput
          type="text"
          formFieldName="address"
          label="Address"
          required={true}
          pattern={undefined}
          placeholder={curEmployee.employeeAddress}
          value={address}
          setValue={setAddress}
          validateFunction={() => null}
        />
      </div>

      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
        <FormFieldInput
          type="text"
          formFieldName="PhoneNumber"
          label="Phone No."
          required={true}
          pattern={undefined}
          placeholder={curEmployee.employeePhoneNumber}
          value={pn}
          setValue={setPn}
          validateFunction={() => null}
        />
      </div>

      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
        <FormFieldInput
          type="text"
          formFieldName="edu"
          label="Education"
          required={true}
          pattern={undefined}
          placeholder={curEmployee.employeeEducation}
          value={edu}
          setValue={setEdu}
          validateFunction={() => null}
        />
      </div>

      <Form.Submit asChild>
        <button className="mt-10 h-12 w-2/3 self-center rounded-full border bg-primary text-lg text-whiten transition-all hover:bg-opacity-80">
          Update
        </button>
      </Form.Submit>
      {formError && (
        <div className="m-2 border-danger bg-red-100 p-2">{formError}</div>
      )}
    </Form.Root>
  );
}

export default UpdateProfile;
