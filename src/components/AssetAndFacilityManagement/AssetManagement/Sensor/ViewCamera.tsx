import React, { useEffect, useRef, useState } from "react";
import * as Form from "@radix-ui/react-form";

import { MultiSelectChangeEvent } from "primereact/multiselect";

import useApiFormData from "../../../../hooks/useApiFormData";
import FormFieldInput from "../../../FormFieldInput";
import Sensor from "../../../../models/Sensor";
import useApiJson from "../../../../hooks/useApiJson";
import { useToast } from "@/components/ui/use-toast";
import FormFieldSelect from "../../../FormFieldSelect";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Authorization {
    authorization : any;
}

function ViewCamera(props: Authorization) {

    const [pageContent, setPageContent] = useState<any>(undefined);
    const { authorization } = props;
    console.log(authorization)
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

      <div>
      <iframe src={url}></iframe>
    </div>
    );
//   const ref : any= useRef();
//   useEffect(() => {
//      const iframe: any = ref.current;
//      iframe.addEventListener('load', () => {
//          iframe.contentWindow.postMessage('message', authorization.ipAddressName + ":8000");
//      });
//   }, [ref]);
    
//     return (
//         <iframe
//             ref={ref}
//             autoFocus={true}
//             title='test'
//             //@ts-ignore
//             minLength={100}
//             width={"100%"}
//             height={1000}
//             src={authorization.ipAddressName + ":8000"}
//          />
//     );
    
    // useEffect(() => {
    //     const options: RequestInit = {
    //         method:"GET",
    //         headers: {
    //         "Content-Type": "application/json",
    //         ...authorization,
    //         }
    //     };

    //     fetch(authorization.ipAddressName + ":8000", options).then(response=>{
    //         if (!response.ok) {
    //             console.log(response);
    //         }
    //         // const json = await response.json();
            
    //         setPageContent(response.blob)
    //     });
    // });


//   userId: string;
//   hubId: string;
//   date: string;
//   ipAddressName: string;
//   signature: string;

  return (
    <div>
      <iframe src={authorization.ipAddressName + ":8000"}></iframe>
    </div>
  );
}


export default ViewCamera;
