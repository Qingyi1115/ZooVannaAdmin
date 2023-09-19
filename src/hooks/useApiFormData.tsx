import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

function useApiFormData<TData = any>() {
  const [result, setResult] = useState<TData | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { state } = useAuthContext();
  const { user } = state;

  const request = async (
    url: string,
    method: string = "POST",
    data: FormData | null = null
  ) => {
    setLoading(true);
    setError(null);
    setResult(null);
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
        const errorObject = await response.json();
        const errorString = errorObject.error.toString();
        throw new Error(errorString);
      }

      const json = (await response.json()) as TData;
      setResult(json);
    } catch (err: any) {
      console.log("test in err");
      setError(err || "Unexpected Error!");
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
