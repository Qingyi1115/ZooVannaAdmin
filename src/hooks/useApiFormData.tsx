import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

function useApiFormData<TData = any>() {
  const [result, setResult] = useState<TData | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { state } = useAuthContext();
  const { user } = state;

  const request = async (
    url: string,
    method: string = "POST",
    data: FormData | null = null
  ) => {
    setLoading(true);
    try {
      const options: RequestInit = {
        method,
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: data,
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const json = (await response.json()) as TData;
      setResult(json);
    } catch (err: any) {
      setError(err.message || "Unexpected Error!");
    } finally {
      setLoading(false);
    }
  };

  const post = async (url: string, data: FormData) => {
    await request(url, "POST", data);
  };

  const put = async (url: string, data: FormData) => {
    await request(url, "PUT", data);
  };

  return {
    result,
    error,
    loading,
    post,
    put,
  };
}

export default useApiFormData;
