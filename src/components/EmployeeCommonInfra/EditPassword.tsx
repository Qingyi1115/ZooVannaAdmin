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
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

{
  /*const toast = useRef<Toast>(null);*/
}

function EditPassword() {
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  const [oldpass1, setOldPass1] = useState<string>("");
  const [newpass, setNewPass] = useState<string>("");
  const [newpass2, setNewPass2] = useState<string>("");
  const [formError, setFormError] = useState<JSX.Element | null>(null);

  function setPassword1(value:any){
      setNewPass(value)
  }

  function setPassword2(value:any){
    setNewPass2(value)
  }

  useEffect(() => {
    handleValidation();
  }, [newpass, newpass2]);


  function handleValidation(){
    if (newpass.length < 8){
      setFormError(
        <div className="font-medium text-danger">
          Password must be at least length 8 and above!
        </div>
      );
      return false;
    }
    if (newpass != newpass2) {
      setFormError(
        <div className="font-medium text-danger">
          Password does not match!
        </div>
      );
      return false;
    }
    setFormError(null);
    return true;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (!handleValidation()) {
        return setFormError(
          <div className="font-medium text-danger">
            Please remedy issues!
          </div>
        );
      }
      setFormError(null);

      const response = await apiJson.put(
        "http://localhost:3000/api/employee/updateEmployeePassword",
        {
          newPassword: newpass,
          oldPassword: oldpass1,
        }
      );
      toastShadcn({
        description: "Successfully changed your password",
      });
      navigate("/profile");
      // clearForm();
    } catch (error: any) {
      console.log("err", error);
      return toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    }
  }

  function validateMatchingPassword(props: ValidityState) {
    return formError;
  }

  // const header = (
  //   <div className="flex flex-wrap items-center justify-between gap-2">
  //     <h4 className="m-1">Edit Profile</h4>
  //     <span className="p-input-icon-left">
  //       <i className="pi pi-search" />
  //     </span>
  //   </div>
  // );

  return (
    <Form.Root
      className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
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
          Change Password
        </span>
      </div>

      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
        <FormFieldInput
          type="password"
          formFieldName="op"
          label="Old Password"
          required={true}
          pattern={undefined}
          placeholder="old password"
          value={oldpass1}
          setValue={setOldPass1}
          validateFunction={() => null}
        />
      </div>

      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
        <FormFieldInput
          type="password"
          formFieldName="newPassword"
          label="New Password"
          required={true}
          pattern={undefined}
          placeholder="new password"
          value={newpass}
          setValue={setPassword1}
          validateFunction={() => null}
        />
      </div>

      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
        <FormFieldInput
          type="password"
          formFieldName="newPassword2"
          label="New Password(again)"
          required={true}
          pattern={undefined}
          placeholder="new password"
          value={newpass2}
          setValue={setPassword2}
          validateFunction={() => null}
        />
      </div>

      <Form.Submit asChild>
        <button className="mt-10 h-12 w-2/3 self-center rounded-full border bg-primary text-lg text-whiten transition-all hover:bg-opacity-80">
          Change Password
        </button>
      </Form.Submit>
      {formError && (
        <div className="m-2 border-danger bg-red-100 p-2">{formError}</div>
      )}
    </Form.Root>
  );
}

export default EditPassword;
