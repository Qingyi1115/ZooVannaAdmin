import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";
import useLogin from "../../hooks/useLogin";

function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login, error } = useLogin();

  // ValidityState properties: https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
  function validateEmail(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-red-600">
            * Please enter an e-mail
          </div>
        );
      } else if (props.typeMismatch) {
        return (
          <div className="font-medium text-red-600">
            * Invalid e-mail format
          </div>
        );
      }
    }
    return null;
  }

  function validatePassword(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-red-600">
            * Please enter a password
          </div>
        );
      }
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // console.log("Inside handleSubmit");
    // console.log(email);
    // console.log(password);
    await login(email, password);
  }

  return (
    <div className="flex w-full justify-center">
      <Form.Root className="w-3/5" onSubmit={handleSubmit}>
        <Form.Field name="email" className="mb-10 flex flex-col gap-1">
          <Form.Label className="text-base font-medium text-black">
            E-mail
          </Form.Label>
          <Form.Control
            type="email"
            required
            placeholder="Type your e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-14 w-full rounded-md border border-zoovanna-brown/50 bg-whiten px-4 text-black placeholder-black/70"
          />
          {/* <Form.Message name="email" match={"valueMissing"}>
            Please enter an email
          </Form.Message> */}
          <Form.ValidityState>{validateEmail}</Form.ValidityState>
        </Form.Field>

        <Form.Field name="password" className="mb-10 flex flex-col gap-1">
          <Form.Label className="text-base font-medium text-black">
            Password
          </Form.Label>
          <Form.Control
            type="password"
            required
            placeholder="Type your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-14 w-full rounded-md border border-zoovanna-brown/50 bg-whiten px-4 text-black placeholder-black/70"
          />
          {/* <Form.Message name="password" match={"valueMissing"}>
            Please enter a password
          </Form.Message> */}
          <Form.ValidityState>{validatePassword}</Form.ValidityState>
        </Form.Field>

        <Form.Submit asChild>
          <button className="h-12 w-full rounded-full border bg-black text-whiter">
            Log In
          </button>
        </Form.Submit>
        {error && (
          <div className="m-2 border-red-400 bg-red-100 p-2">{error}</div>
        )}
      </Form.Root>
    </div>
  );
}

export default LoginForm;
