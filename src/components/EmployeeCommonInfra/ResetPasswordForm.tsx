import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Form from "@radix-ui/react-form";
import { useToast } from "@/components/ui/use-toast";
import useApiJson from "../../hooks/useApiJson";

function ResetPasswordForm() {
  const { token } = useParams();

  const apiJson = useApiJson();

  const toastShadcn = useToast().toast;
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState<string>("");
  const [newPassword2, setNewPassword2] = useState<string>("");

  // ValidityState properties: https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
  function validateNewPassword(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-red-600">
            * Please enter a password
          </div>
        );
      } else if (props.patternMismatch) {
        return (
          <div className="font-medium text-danger">
            * Password must be at least 8 characters long and contain at least
            one uppercase letter, one lowercase letter, and one digit.
          </div>
        );
      }
    }
    return null;
  }

  function validatePassword2(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-red-600">
            * Please enter a password
          </div>
        );
      } else if (newPassword2 !== newPassword) {
        return (
          <div className="font-medium text-red-600">
            * New passwords do not match. Please try again.
          </div>
        );
      }
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const packet = {
      token: token,
      password: newPassword2,
    };

    try {
      const responseJson = await apiJson.put(
        `http://localhost:3000/api/employee/resetForgottenPassword/` + token,
        packet
      );

      console.log(responseJson.result);

      // success
      toastShadcn({
        description: "You have successfully changed your password.",
      });
      navigate("/");
    } catch (error: any) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while updating your password: \n" +
          error.message,
      });
    }
  }

  return (
    <div className="flex w-full justify-center">
      <Form.Root className="w-4/5" onSubmit={handleSubmit}>
        {/* <Form.Field name="email" className="mb-10 flex flex-col gap-1">
          <Form.Label className="text-base font-medium text-black">
            Old password
          </Form.Label>
          <Form.Control
            type="password"
            required
            placeholder="Type your old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="h-14 w-full rounded-md border border-zoovanna-brown/50 bg-whiten px-4 text-black placeholder-black/70"
          />
          {/* <Form.Message name="email" match={"valueMissing"}>
              Please enter an email
            </Form.Message> */}
        {/* <Form.ValidityState>{validateOldPassword}</Form.ValidityState>
        </Form.Field> */}

        <Form.Field name="newPassword" className="mb-10 flex flex-col gap-1">
          <Form.Label className="text-base font-medium text-black">
            New Password
          </Form.Label>
          <Form.Control
            type="password"
            required
            placeholder="Type your new password"
            value={newPassword}
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
            title="Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit."
            onChange={(e) => setNewPassword(e.target.value)}
            className="h-14 w-full rounded-md border border-zoovanna-brown/50 bg-whiten px-4 text-black placeholder-black/70"
          />
          <Form.ValidityState>{validateNewPassword}</Form.ValidityState>
        </Form.Field>

        <Form.Field name="newPassword2" className="mb-10 flex flex-col gap-1">
          <Form.Label className="text-base font-medium text-black">
            Confirm New Password
          </Form.Label>
          <Form.Control
            type="password"
            required
            placeholder="Re-type your new password"
            value={newPassword2}
            onChange={(e) => setNewPassword2(e.target.value)}
            className="h-14 w-full rounded-md border border-zoovanna-brown/50 bg-whiten px-4 text-black placeholder-black/70"
          />
          <Form.ValidityState>{validatePassword2}</Form.ValidityState>
        </Form.Field>

        <Form.Submit asChild>
          <button className="mt-10 h-12 w-full rounded-full border bg-black text-whiter">
            Update password
          </button>
        </Form.Submit>
      </Form.Root>
    </div>
  );
}

export default ResetPasswordForm;
