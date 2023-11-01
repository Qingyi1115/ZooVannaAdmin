import React, { useEffect, useRef, useState } from "react";

interface Authorization {
  authorization: any;
}

function ViewCamera(props: Authorization) {

  const [pageContent, setPageContent] = useState<any>(undefined);
  const { authorization } = props;
  const url = "http://" + authorization.ipAddressName + ":8000";


  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok || !response.body) {
          throw response.statusText;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            setLoading(false);
            break;
          }

          const decodedChunk = decoder.decode(value, { stream: true });
          setData(prevValue => `${prevValue}${decodedChunk}`);
        }
      } catch (error) {
        setLoading(false);
        // Handle other errors
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-full">
      <iframe className="w-full h-full" src={url}></iframe>
    </div>

    // <div className="w-[100vw] h-[100vh]">
    //   <iframe className="w-[100vw] h-[100vh]" src={url}></iframe>
    // </div>
  );
}

export default ViewCamera;
