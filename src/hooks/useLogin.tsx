import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

interface User {
  email: string;
  password: string;
}

interface ErrorResponse {
  error: string;
}

interface LoginResponse extends User {
  email: string;
  token: string;
}

function useLogin() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { dispatch } = useAuthContext();

  async function login(email: string, password: string) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const json: ErrorResponse = await response.json();
        setIsLoading(false);
        setError(json.error);
        return;
      }

      const json: LoginResponse = await response.json();

      // Save user to local storage, along with token
      localStorage.setItem("user", JSON.stringify(json));

      // Update auth context
      dispatch({ type: "LOGIN", payload: json });

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError("An error occurred while logging in.");
    }
  }

  return { login, isLoading, error };
}

export default useLogin;
