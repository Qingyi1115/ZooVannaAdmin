import React from "react";
import LoginForm from "../components/LoginPage/LoginForm";

function LoginPage() {
  return (
    <div className="flex h-screen">
      <aside className="flex w-1/2 flex-col justify-center bg-zoovanna-green">
        <img
          src="/logos/nocircle-cream.png"
          alt="Zoovanna Logo"
          className="fixed left-8 top-8 h-1/6 w-min"
        />
        <span className="self-center font-dmSans text-5xl font-medium leading-tight text-zoovanna-cream-300">
          Welcome to <br /> Zoovanna Admin Portal
        </span>
      </aside>
      <main className="bg-zoovanna-cream flex w-1/2 items-center justify-center">
        <LoginForm />
      </main>
    </div>
  );
}

export default LoginPage;
