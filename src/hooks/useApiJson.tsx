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
    body: any = null,
    datHandler:Function
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

      const json = datHandler(await response.json());
      setResult(json);
      return json;
    } catch (err: any) {
      setError(err.message || "Unexpected Error!");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const get = async (url: string, datHandler:Function=(dat:any)=> {}) => {
    return await request(url, "GET", {}, datHandler=datHandler);
  };

  const post = async (url: string, body: any, datHandler:Function=(dat:any)=> {}) => {
    return await request(url, "POST", body, datHandler=datHandler);
  };

  const put = async (url: string, body: any, datHandler:Function=(dat:any)=> {}) => {
    return await request(url, "PUT", body, datHandler=datHandler);
  };

  const del = async (url: string, datHandler:Function=(dat:any)=> {}) => {
    return await request(url, "DELETE", {}, datHandler=datHandler);
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
