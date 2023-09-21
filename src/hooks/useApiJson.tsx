import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

// in functional component, example:
/*
  const api = useApi();

  useEffect(() => {
    // GET request
    api.get("https://jsonplaceholder.typicode.com/posts");

    // POST request
    const postData = {
      title: "New Post",
      body: "This is a new post",
      userId: 1,
    };
    api.post("https://jsonplaceholder.typicode.com/posts", postData);

    // PUT request
    const updateData = {
      title: "Updated Post",
      body: "This post has been updated",
    };
    api.put("https://jsonplaceholder.typicode.com/posts/1", updateData);

    // DELETE request
    api.del("https://jsonplaceholder.typicode.com/posts/1");
  }, []);
*/
function useApiJson<TData = any>() {
  const [result, setResult] = useState<TData | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { state } = useAuthContext();
  const { user } = state;

  const request = async (
    url: string,
    method: string = "GET",
    body: any = null
  ) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          // Add any other headers as needed
          Authorization: `Bearer ${user?.token}`,
        },
        body: body ? JSON.stringify(body) : null,
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        const errorObject = await response.json();
        const errorString = errorObject.error.toString();
        throw new Error(errorString);
      }

      // const json = await response.json();
      setLoading(false);
      return await response.json();
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Unexpected Error!");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const get = async (url: string, body: any = null) => {
    return request(url);
  };

  const post = async (url: string, body: any) => {
    return request(url, "POST", body);
  };

  const put = async (url: string, body: any) => {
    return request(url, "PUT", body);
  };

  const del = async (url: string, body: any = null) => {
    return request(url, "DELETE");
  };

  return {
    result,
    error,
    loading,
    get,
    post,
    put,
    del,
  };
}

export default useApiJson;
