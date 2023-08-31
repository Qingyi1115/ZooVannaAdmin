import React from "react";
import LoginForm from "../components/forms/LoginForm";

function LoginPage() {
  return (
    <div className="flex h-screen">
      <aside className="bg-zoovanna-green w-1/2 flex flex-col justify-center">
        <img
          src="/logos/nocircle-cream.png"
          alt="Zoovanna Logo"
          className="h-1/6 w-min fixed top-8 left-8"
        />
        <span className="text-zoovanna-cream text-5xl leading-tight font-medium font-dmSans self-center">
          Welcome to <br /> Zoovanna Admin Portal
        </span>
      </aside>
      <main className="bg-zoovanna-cream w-1/2 flex justify-center items-center">
        <LoginForm />
      </main>
    </div>
  );
}

export default LoginPage;
