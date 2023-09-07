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
function useApi<TData = any>() {
  const [result, setResult] = useState<TData | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { state } = useAuthContext();
  const { user } = state;

  const request = async (
    url: string,
    method: string = "GET",
    body: any = null
  ) => {
    setLoading(true);
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
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const json = await response.json();
      setResult(json);
    } catch (err: any) {
      setError(err.message || "Unexpected Error!");
    } finally {
      setLoading(false);
    }
  };

  const get = async (url: string) => {
    await request(url);
  };

  const post = async (url: string, body: any) => {
    await request(url, "POST", body);
  };

  const put = async (url: string, body: any) => {
    await request(url, "PUT", body);
  };

  const del = async (url: string) => {
    await request(url, "DELETE");
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

export default useApi;
